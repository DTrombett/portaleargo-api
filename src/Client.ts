import { CookieClient } from "http-cookie-agent/undici/v6";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { cwd, env } from "node:process";
import {
	fetch,
	interceptors,
	Pool,
	type Dispatcher,
	type RequestInfo,
	type RequestInit,
	type RetryHandler,
} from "undici";
import type CacheHandler from "undici/types/cache-interceptor";
import { BaseClient } from "./BaseClient";
import type { ClientOptions, Credentials } from "./types";
import { getCode } from "./util/getCode";
import { importData } from "./util/importData";
import { writeToFile } from "./util/writeToFile";
import { jar } from "./util/cookies"

const factory = (origin: import("url").URL, opts: object): CookieClient =>
	new CookieClient(origin, {
		...opts,
		cookies: { jar },
	});

/**
 * Un client per interagire con l'API
 */
export class Client extends BaseClient {
	/**
	 * Custom dispatcher.
	 */
	dispatcher: Dispatcher;

	override fetch = this.createFetch();

	/**
	 * @param options - Le opzioni per il client
	 */
	constructor(
		options: ClientOptions & {
			/**
			 * Il percorso della cartella dove salvare i dati.
			 * * Ignorato se `dataProvider` viene fornito
			 */
			dataPath?: string | null;

			/**
			 * Additional options for the pool
			 */
			poolOptions?: Pool.Options;

			/**
			 * Retry options
			 */
			retryOptions?: RetryHandler.RetryOptions;

			/**
			 * Cache options
			 */
			cacheOptions?: CacheHandler.CacheOptions;
		} = {},
	) {
		super(options);
		this.credentials = {
			schoolCode: options.schoolCode ?? env.CODICE_SCUOLA,
			password: options.password ?? env.PASSWORD,
			username: options.username ?? env.NOME_UTENTE,
		};
		this.dispatcher = new Pool(BaseClient.BASE_URL, {
			allowH2: true,
			autoSelectFamily: true,
			factory,
			...options.poolOptions,
		}).compose(
			interceptors.retry({
				maxRetries: 4,
				minTimeout: 100,
				timeoutFactor: 4,
				maxTimeout: 10_000,
				...options.retryOptions,
			}),
			interceptors.cache({
				cacheByDefault: 3_600_000,
				type: "private",
				...options.cacheOptions,
			}),
		);
		if (options.dataProvider !== null)
			this.dataProvider ??= Client.createDataProvider(
				options.dataPath ?? undefined,
			);
	}

	static createDataProvider(
		dataPath = join(cwd(), ".argo"),
	): NonNullable<ClientOptions["dataProvider"]> {
		let exists = existsSync(dataPath);

		return {
			read: (name) => importData(name, dataPath),
			write: async (name, value) => {
				if (!exists) {
					exists = true;
					await mkdir(dataPath);
				}
				return writeToFile(name, value, dataPath);
			},
			reset: () => rm(dataPath, { recursive: true, force: true }),
		};
	}

	createFetch(): typeof window.fetch {
		return (info, init) =>
			fetch(info as RequestInfo, {
				dispatcher: this.dispatcher,
				...(init as RequestInit),
			}) as unknown as Promise<Response>;
	}

	async getCode() {
		if (
			[
				this.credentials?.password,
				this.credentials?.schoolCode,
				this.credentials?.username,
			].includes(undefined)
		)
			throw new TypeError("Password, school code, or username missing");
		return getCode(this.credentials as Credentials);
	}
}

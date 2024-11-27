import { CookieClient } from "http-cookie-agent/undici";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { cwd, env } from "node:process";
import { CookieJar } from "tough-cookie";
import {
	fetch,
	interceptors,
	type RequestInfo,
	type RequestInit,
} from "undici";
import { BaseClient } from "./BaseClient";
import type { ClientOptions, Credentials } from "./types";
import { getCode } from "./util/getCode";
import { importData } from "./util/importData";
import { writeToFile } from "./util/writeToFile";

/**
 * Un client per interagire con l'API
 */
export class Client extends BaseClient {
	client = new CookieClient(BaseClient.BASE_URL, {
		allowH2: true,
		autoSelectFamily: true,
		autoSelectFamilyAttemptTimeout: 1,
		cookies: { jar: new CookieJar() },
	}).compose(
		interceptors.retry(),
		interceptors.cache({ cacheByDefault: 3_600_000, type: "private" }),
	);
	override fetch = this.createFetch();

	/**
	 * @param options - Le opzioni per il client
	 */
	constructor(options: ClientOptions = {}) {
		super(options);
		this.credentials = {
			schoolCode: options.schoolCode ?? env.CODICE_SCUOLA,
			password: options.password ?? env.PASSWORD,
			username: options.username ?? env.NOME_UTENTE,
		};
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
				dispatcher: this.client,
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

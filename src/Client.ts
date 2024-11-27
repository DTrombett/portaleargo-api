import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { cwd, env } from "node:process";
import { BaseClient } from "./BaseClient";
import type { ClientOptions, Credentials } from "./types";
import { getCode } from "./util/getCode";
import { importData } from "./util/importData";
import { writeToFile } from "./util/writeToFile";

/**
 * Un client per interagire con l'API
 */
export class Client extends BaseClient {
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
		if (options.dataProvider !== null && !this.dataProvider) {
			options.dataPath ??= join(cwd(), ".argo");
			let exists = existsSync(options.dataPath);

			this.dataProvider = {
				read: (name) => importData(name, options.dataPath!),
				write: async (name, value) => {
					if (!exists) {
						exists = true;
						await mkdir(options.dataPath!);
					}
					return writeToFile(name, value, options.dataPath!);
				},
				reset: () => rm(options.dataPath!, { recursive: true, force: true }),
			};
		}
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

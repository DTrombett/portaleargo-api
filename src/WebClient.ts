import { BaseClient } from "./BaseClient";
import type { ClientOptions } from "./types";

/**
 * Un client per interagire con l'API
 */
export class WebClient extends BaseClient {
	/**
	 * @param options - Le opzioni per il client
	 */
	constructor(options: ClientOptions = {}) {
		super(options);
		if (options.dataProvider !== null)
			this.dataProvider ??= WebClient.createDataProvider();
	}

	static createDataProvider(): NonNullable<ClientOptions["dataProvider"]> {
		return {
			read: async (name) => {
				const text = localStorage.getItem(name);

				if (text == null) return undefined;
				try {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return JSON.parse(text);
				} catch (err) {
					return undefined;
				}
			},
			write: async (name, value) => {
				try {
					const text = JSON.stringify(value);

					localStorage.setItem(name, text);
				} catch (err) {
					// Ignore errors; probably user disabled cookies
				}
			},
			reset: async () => {
				localStorage.clear();
			},
		};
	}

	getCode() {
		return Promise.reject(new Error("Cannot generate code in browser"));
	}
}

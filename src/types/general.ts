import type { IncomingHttpHeaders } from "node:http";
import type { Dashboard, Login, Profilo, Token } from "..";

export type ObjectJson = {
	[key: string]: Json;
};
export type Json =
	| Json[]
	| ObjectJson
	| boolean
	| number
	| string
	| null
	| undefined;
export type HttpMethod =
	| "CONNECT"
	| "DELETE"
	| "GET"
	| "HEAD"
	| "OPTIONS"
	| "PATCH"
	| "POST"
	| "PUT"
	| "TRACE";
export type ReadData = {
	dashboard: Dashboard;
	login: Login;
	profile: Profilo;
	token: Token;
};
export type Credentials = {
	/**
	 * Il codice scuola
	 */
	schoolCode: string;

	/**
	 * L'username
	 */
	username: string;

	/**
	 * La password
	 */
	password: string;
};
export type ClientOptions = Partial<
	Credentials & {
		/**
		 * I dati del token
		 */
		token: Token;

		/**
		 * I dati del login
		 */
		loginData: Login;

		/**
		 * I dati del profilo
		 */
		profile: Profilo;

		/**
		 * I dati della dashboard
		 */
		dashboard: Dashboard;

		/**
		 * Se scrivere nella console alcuni dati utili per il debug
		 */
		debug: boolean;

		/**
		 * Headers aggiuntivi per ogni richiesta API
		 */
		headers: IncomingHttpHeaders;

		/**
		 * Il percorso della cartella dove salvare i dati.
		 * * Ignorato se `dataProvider` viene fornito
		 */
		dataPath: string | null;

		/**
		 * Le funzioni per leggere e scrivere i dati
		 */
		dataProvider: {
			read?: <T extends keyof ReadData>(
				name: T
			) => Promise<Jsonify<ReadData[T]> | undefined>;
			write: <T extends keyof ReadData>(
				name: T,
				data: ReadData[T]
			) => Promise<void>;
			reset: () => Promise<void>;
		} | null;
	}
>;
export type Jsonify<T, N extends boolean = false, D extends boolean = true> = [
	T,
	D
] extends [
	{
		toJSON(): infer J;
	},
	true
]
	? Jsonify<J, false, false>
	: T extends boolean | number | string | null
	? T
	: T extends bigint
	? never
	: T extends symbol | ((...args: any[]) => any) | undefined
	? N extends true
		? never
		: undefined
	: {
			[K in keyof T]: Jsonify<T[K], true>;
	  };
export type LoginLink = {
	url: string;
	redirectUri: string;
	scopes: string[];
	codeVerifier: string;
	challenge: string;
	clientId: string;
	state: string;
	nonce: string;
};
export type ReadyClient = {
	token: Token;
	loginData: Login;
	profile: Profilo;
};

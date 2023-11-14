import type { IncomingHttpHeaders } from "node:http";
import type { APILogin, APIToken, Dashboard, Profilo } from "..";

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
	login: APILogin["data"][number];
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
export type Token = APIToken & {
	expireDate: Date;
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
		loginData: APILogin["data"][number];

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
				name: T,
			) => Promise<Jsonify<ReadData[T]> | undefined>;
			write: <T extends keyof ReadData>(
				name: T,
				data: ReadData[T],
			) => Promise<void>;
			reset: () => Promise<void>;
		} | null;

		/**
		 * La versione di didUp da specificare nell'header.
		 * * Modificare questa opzione potrebbe creare problemi nell'utilizzo della libreria
		 */
		version: string;
	}
>;
export type Jsonify<T, D extends boolean = true> = [D, T] extends [
	true,
	{
		toJSON(): infer J;
	},
]
	? Jsonify<J, false>
	: T extends boolean | number | string | null
	? T
	: T extends bigint
	? never
	: T extends symbol | ((...args: any[]) => any) | undefined
	? undefined
	: T extends (infer A)[]
	? Jsonify<A>[]
	: {
			[K in keyof T as T[K] extends
				| bigint
				| symbol
				| ((...args: any[]) => any)
				| undefined
				? never
				: K]: Jsonify<T[K]>;
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
	loginData: APILogin;
	profile: Profilo;
};

import type {
	APIDashboard,
	APILogin,
	APIOperation,
	APIProfilo,
	APIToken,
} from "./apiTypes";

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
	dashboard: ClearOperations<APIDashboard["data"]["dati"][number]> & {
		dataAggiornamento: string;
	};
	login: APILogin["data"][number];
	profile: APIProfilo["data"];
	token: Token;
};
export type WriteData = {
	dashboard: Dashboard;
	login: APILogin["data"][number];
	profile: APIProfilo["data"];
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
export type ClearOperations<T> = {
	[K in keyof T]: T[K] extends APIOperation<infer A, infer P>[]
		? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
			(A & (P extends false ? { pk: string } : {}))[]
		: T[K] extends object
			? ClearOperations<T[K]>
			: T[K];
};
export type Token = Exclude<APIToken, { error: string }> & {
	expireDate: Date;
};
export type Dashboard = ClearOperations<
	APIDashboard["data"]["dati"][number]
> & {
	dataAggiornamento: Date;
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
		profile: APIProfilo["data"];

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
		headers: Record<string, string>;

		/**
		 * Le funzioni per leggere e scrivere i dati
		 */
		dataProvider: {
			read?: <T extends keyof ReadData>(
				name: T,
			) => Promise<ReadData[T] | undefined>;
			write: <T extends keyof WriteData>(
				name: T,
				data: WriteData[T],
			) => Promise<void>;
			reset: () => Promise<void>;
		} | null;

		/**
		 * La versione di didUp da specificare nell'header.
		 * * Modificare questa opzione potrebbe creare problemi nell'utilizzo della libreria
		 */
		version: string;

		/**
		 * Non controllare il tipo dei dati ricevuti dall'API.
		 * * Nota che il controllo dei dati viene fatto in maniera asincrona e non blocca o rallenta il processo
		 */
		noTypeCheck: boolean;
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
	loginData: APILogin["data"][number];
	profile: APIProfilo;
};

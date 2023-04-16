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
export type BasicCredentials = {
	/**
	 * The school code
	 */
	schoolCode: string;
	/**
	 * The username
	 */
	username: string;
	/**
	 * The password
	 */
	password: string;
};
export type ClientOptions = Partial<
	BasicCredentials & {
		/**
		 * The token data
		 */
		token: Token;
		/**
		 * The login data
		 */
		loginData: Login;
		/**
		 * The profile data
		 */
		profile: Profilo;
		/**
		 * The dashboard data
		 */
		dashboard: Dashboard;
		/**
		 * Whether to log some useful data
		 */
		debug: boolean;
		/**
		 * Additional http headers for the requests
		 */
		headers: IncomingHttpHeaders;
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

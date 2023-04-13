import type { IncomingHttpHeaders } from "node:http";
import type { Dashboard, Login, Profilo, Token } from "..";

export type Json =
	| Json[]
	| boolean
	| number
	| string
	| {
			[key: string]: Json;
	  }
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
export type RequestOptions = Partial<{
	headers: IncomingHttpHeaders;
	debug: boolean;
}>;
export type Jsonify<T, N extends boolean = false> = T extends
	| boolean
	| number
	| string
	| null
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

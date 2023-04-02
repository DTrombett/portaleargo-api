import type { Dashboard, Login, Profile, Token } from ".";

export type Json =
	| Json[]
	| boolean
	| number
	| string
	| {
			[key: string]: Json;
	  }
	| null;
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
export type Credentials = Partial<BasicCredentials> & {
	/**
	 * The token data
	 */
	token?: Token;
	/**
	 * The login data
	 */
	loginData?: Login;
	/**
	 * The profile data
	 */
	profile?: Profile;
	/**
	 * The dashboard data
	 */
	dashboard?: Dashboard;
};

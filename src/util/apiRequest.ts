import type { IncomingHttpHeaders } from "node:http";
import { request } from "undici";
import type { HttpMethod, Json, Login, Token } from "../types";
import { formatDate } from "./formatDate";

/**
 * Perform an API request.
 * @param url - The url for the request
 * @param token - The token data
 * @param login - The login data
 * @param options - Other options
 * @returns The json response
 */
export const apiRequest = async <T extends Json, R extends boolean = false>(
	url: string,
	token: Token,
	login: Login,
	options?: Partial<{
		body: Json;
		method: HttpMethod;
		noWaitAfter: R;
		headers: IncomingHttpHeaders;
	}>
) => {
	const res = await request(url, {
		headers: {
			"accept": "application/json",
			"argo-client-version": "1.15.1",
			"authorization": `Bearer ${token.accessToken}`,
			"content-type": "application/json; charset=utf-8",
			"x-auth-token": login.token,
			"x-cod-min": login.schoolCode,
			"x-date-exp-auth": formatDate(token.expireDate),
			...options?.headers,
		},
		method: options?.method,
		body: options?.method === "POST" ? JSON.stringify(options.body) : undefined,
	});
	const result = {
		res,
	} as {
		res: typeof res;
		body: R extends true ? undefined : T;
	};

	if (options?.noWaitAfter !== true) result.body = await res.body.json();
	return result;
};

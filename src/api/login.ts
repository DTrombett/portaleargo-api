import { buildLogin } from "../builders";
import type { APILogin, RequestOptions, Token } from "../types";
import { apiRequest, randomString, writeToFile } from "../util";

/**
 * Login to the API.
 * @param token - The token data to use
 * @param options - Additional options for the request
 * @returns The login data
 */
export const login = async (token: Token, options?: RequestOptions) => {
	const { res, body } = await apiRequest<APILogin>("login", token, {
		method: "POST",
		body: {
			"lista-opzioni-notifiche": "{}",
			"lista-x-auth-token": "[]",
			"clientID": randomString(163),
		},
		...options,
	});

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred in the login. Status code: ${res.statusCode}`
		);
	const value = buildLogin(body);

	void writeToFile("login", value);
	return value;
};

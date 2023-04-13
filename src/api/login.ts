import type { APILogin, RequestOptions, Token } from "..";
import { Login, apiRequest, randomString, writeToFile } from "..";

/**
 * Login to the API.
 * @param token - The token data to use
 * @param options - Additional options for the request
 * @returns The login data
 */
export const login = async (token: Token, options?: RequestOptions) => {
	const { body } = await apiRequest<APILogin>("login", token, {
		method: "POST",
		body: {
			"lista-opzioni-notifiche": "{}",
			"lista-x-auth-token": "[]",
			"clientID": randomString(163),
		},
		debug: options?.debug,
		headers: options?.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	const value = new Login(body.data[0]);

	void writeToFile("login", value);
	return value;
};

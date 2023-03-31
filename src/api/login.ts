import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { request } from "undici";
import { buildLogin } from "../builders";
import type { APILogin, Token } from "../types";
import { AuthFolder, formatDate, randomString } from "../util";

/**
 * Login to the API.
 * @param token - The token data to use
 * @returns The response data
 */
export const login = async (token: Token) => {
	const res = await request(
		"https://www.portaleargo.it/appfamiglia/api/rest/login",
		{
			headers: {
				"authorization": `Bearer ${token.accessToken}`,
				"content-type": "application/json; charset=utf-8",
				"x-date-exp-auth": formatDate(token.expireDate),
			},
			method: "POST",
			body: JSON.stringify({
				"lista-opzioni-notifiche": "{}",
				"lista-x-auth-token": "[]",
				"clientID": randomString(163),
			}),
		}
	);
	const body: APILogin = await res.body.json();

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while requesting the login. Status code: ${res.statusCode}`
		);
	const value = buildLogin(body);

	writeFile(join(AuthFolder, "login.json"), JSON.stringify(value)).catch(
		console.error
	);
	return value;
};

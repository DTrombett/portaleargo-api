import { buildToken } from "../builders";
import type { APIToken, Login, RequestOptions, Token } from "../types";
import { apiRequest, clientId, formatDate, writeToFile } from "../util";

/**
 * Refresh the token.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 * @returns The token data
 */
export const refreshToken = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { res, body } = await apiRequest<APIToken>(
		"auth/refresh-token",
		token,
		{
			method: "POST",
			body: {
				"r-token": token.refreshToken,
				"client-id": clientId,
				"scopes": `[${token.scopes.join(", ")}]`,
				"old-bearer": token.accessToken,
				"primo-accesso": "false",
				"ripeti-login": "false",
				"exp-bearer": formatDate(token.expireDate),
				"ts-app": formatDate(new Date()),
				"proc": "initState_global_random_12345",
				"username": login.username,
			},
			login,
			...options,
		}
	);
	const value = buildToken(body, new Date(res.headers.date as string));

	void writeToFile("token", value);
	return value;
};

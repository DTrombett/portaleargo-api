import type { APIToken, Client } from "..";
import { Token, apiRequest, clientId, formatDate, writeToFile } from "..";

/**
 * Refresh the token.
 * @param client - The client
 * @returns The token data
 */
export const refreshToken = async (client: Client) => {
	const { res, body } = await apiRequest<APIToken>(
		"auth/refresh-token",
		client,
		{
			method: "POST",
			body: {
				"r-token": client.token?.refreshToken,
				"client-id": clientId,
				scopes: `[${client.token?.scopes.join(", ") ?? ""}]`,
				"old-bearer": client.token?.accessToken,
				"primo-accesso": "false",
				"ripeti-login": "false",
				"exp-bearer":
					client.token?.expireDate && formatDate(client.token.expireDate),
				"ts-app": formatDate(new Date()),
				proc: "initState_global_random_12345",
				username: client.loginData?.username,
			},
		}
	);
	const value = new Token(body, client, new Date(res.headers.date as string));

	void writeToFile("token", value);
	return value;
};

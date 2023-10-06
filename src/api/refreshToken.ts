import type { APIToken, Client } from "..";
import { Token, apiRequest, clientId, formatDate } from "..";

/**
 * Aggiorna il token.
 * @param client - Il client
 * @returns I dati
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
		},
	);
	const date = new Date(res.headers.date as string);
	if (!client.token?.patch(body, date))
		client.token = new Token(body, client, date);
	void client.dataProvider?.write("token", client.token);
	return client.token;
};

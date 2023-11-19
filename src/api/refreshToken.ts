import type { APIToken, Client } from "..";
import { apiRequest, clientId, formatDate } from "..";
import { validateToken } from "../schemas";

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
				"r-token": client.token?.refresh_token,
				"client-id": clientId,
				scopes: `[${client.token?.scope.split(" ").join(", ") ?? ""}]`,
				"old-bearer": client.token?.access_token,
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
	const expireDate = new Date(res.headers.date as string);

	expireDate.setSeconds(expireDate.getSeconds() + body.expires_in);
	client.token = Object.assign(client.token ?? {}, body, { expireDate });
	void client.dataProvider?.write("token", client.token);
	if (!client.noTypeCheck) validateToken(body);
	return client.token;
};

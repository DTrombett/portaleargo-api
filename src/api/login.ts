import type { APILogin, Client } from "..";
import { apiRequest, randomString } from "..";
import { validateLogin } from "../schemas";

/**
 * Effettua il login tramite l'API.
 * @param client - Il client
 * @returns I dati
 */
export const login = async (client: Client) => {
	const { body } = await apiRequest<APILogin>("login", client, {
		method: "POST",
		body: {
			"lista-opzioni-notifiche": "{}",
			"lista-x-auth-token": "[]",
			clientID: randomString(163),
		},
	});

	if (!body.success) throw new Error(body.msg!);
	client.loginData = Object.assign(client.loginData ?? {}, body.data[0]);
	void client.dataProvider?.write("login", client.loginData);
	validateLogin(body);
	return client.loginData;
};

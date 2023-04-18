import type { APILogin, Client } from "..";
import { Login, apiRequest, randomString, writeToFile } from "..";

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
	if (!client.loginData?.patch(body.data[0]))
		client.loginData = new Login(body.data[0], client);
	if (client.dataPath !== undefined)
		void writeToFile("login", client.loginData, client.dataPath);
	return client.loginData;
};

import type { APILogin, Client } from "..";
import { Login, apiRequest, randomString, writeToFile } from "..";

/**
 * Login to the API.
 * @param client - The client
 * @returns The login data
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
	const value = new Login(body.data[0], client);

	void writeToFile("login", value);
	return value;
};

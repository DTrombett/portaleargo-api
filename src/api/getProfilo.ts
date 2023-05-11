import type { APIProfilo, Client } from "..";
import { Profilo, apiRequest } from "..";

/**
 * Ottieni i dati riguardo il profilo dell'utente.
 * @param client - Il client
 * @returns I dati
 */
export const getProfilo = async (client: Client) => {
	const { body } = await apiRequest<APIProfilo>("profilo", client, {});

	if (!body.success) throw new Error(body.msg!);
	if (!client.profile?.patch(body.data))
		client.profile = new Profilo(body.data, client);
	void client.dataProvider?.write("profile", client.profile);
	return client.profile;
};

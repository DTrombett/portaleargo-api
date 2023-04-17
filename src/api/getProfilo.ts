import type { APIProfilo, Client } from "..";
import { Profilo, apiRequest, writeToFile } from "..";

/**
 * Ottieni i dati riguardo il profilo dell'utente.
 * @param client - Il client
 * @returns I dati
 */
export const getProfilo = async (client: Client) => {
	const { body } = await apiRequest<APIProfilo>("profilo", client, {});

	if (!body.success) throw new Error(body.msg!);
	const value =
		client.profile?.patch(body.data) ?? new Profilo(body.data, client);

	if (client.dataPath !== undefined)
		void writeToFile("profile", value, client.dataPath);
	return value;
};

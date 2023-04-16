import type { APIProfilo, Client } from "..";
import { Profilo, apiRequest, writeToFile } from "..";

/**
 * Ottieni i dati riguardo il profilo dell'utente.
 * @param client - The client
 */
export const getProfilo = async (client: Client) => {
	const { body } = await apiRequest<APIProfilo>("profilo", client, {});

	if (!body.success) throw new Error(body.msg!);
	const value = new Profilo(body.data, client);

	void writeToFile("profile", value);
	return value;
};

import type { APIProfilo, Client } from "..";
import { apiRequest } from "..";
import { validateProfilo } from "../schemas";

/**
 * Ottieni i dati riguardo il profilo dell'utente.
 * @param client - Il client
 * @returns I dati
 */
export const getProfilo = async (client: Client) => {
	const { body } = await apiRequest<APIProfilo>("profilo", client, {});

	if (!body.success) throw new Error(body.msg!);
	client.profile = Object.assign(client.profile ?? {}, body.data);
	void client.dataProvider?.write("profile", client.profile);
	if (!client.noTypeCheck) validateProfilo(body);
	return client.profile;
};

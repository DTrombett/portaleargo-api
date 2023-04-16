import type { APIDettagliProfilo, Client } from "..";
import { DettagliProfilo, apiRequest } from "..";

/**
 * Ottieni i dettagli del profilo dello studente.
 * @param client - The client
 */
export const getDettagliProfilo = async (client: Client) => {
	const { body } = await apiRequest<APIDettagliProfilo>(
		"dettaglioprofilo",
		client,
		{
			body: null,
			method: "POST",
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return new DettagliProfilo(body.data, client);
};

import type { APIDettagliProfilo, Client } from "..";
import { apiRequest } from "../util";
import { validateDettagliProfilo } from "../schemas";

/**
 * Ottieni i dettagli del profilo dello studente.
 * @param client - Il client
 * @returns I dati
 */
export const getDettagliProfilo = async <T extends APIDettagliProfilo["data"]>(
	client: Client,
	options?: {
		old?: T;
	},
) => {
	const { body } = await apiRequest<APIDettagliProfilo>(
		"dettaglioprofilo",
		client,
		{
			body: null,
			method: "POST",
		},
	);

	if (!body.success) throw new Error(body.msg!);
	if (!client.noTypeCheck) validateDettagliProfilo(body);
	return Object.assign(options?.old ?? {}, body.data);
};

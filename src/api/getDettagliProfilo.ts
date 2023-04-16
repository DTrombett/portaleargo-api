import type { APIDettagliProfilo, Client } from "..";
import { DettagliProfilo, apiRequest } from "..";

/**
 * Ottieni i dettagli del profilo dello studente.
 * @param client - The client
 */
export const getDettagliProfilo = async <T extends DettagliProfilo>(
	client: Client,
	options?: {
		old?: T;
	}
) => {
	const { body } = await apiRequest<APIDettagliProfilo>(
		"dettaglioprofilo",
		client,
		{
			body: null,
			method: "POST",
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return (options?.old?.patch(body.data) ??
		new DettagliProfilo(body.data, client)) as T;
};

import type { APIRicevimenti, Client } from "..";
import { Ricevimenti, apiRequest } from "..";

/**
 * Ottieni i dati riguardo i ricevimenti dello studente.
 * @param client - The client
 */
export const getRicevimenti = async (client: Client) => {
	const { body } = await apiRequest<APIRicevimenti>("ricevimento", client, {
		method: "POST",
		body: {},
	});

	if (!body.success) throw new Error(body.msg!);
	return new Ricevimenti(body.data, client);
};

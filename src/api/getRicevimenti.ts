import type { APIRicevimenti, Client } from "..";
import { Ricevimenti, apiRequest } from "..";

/**
 * Ottieni i dati riguardo i ricevimenti dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getRicevimenti = async <T extends Ricevimenti>(
	client: Client,
	options?: { old?: T }
) => {
	const { body } = await apiRequest<APIRicevimenti>("ricevimento", client, {
		method: "POST",
		body: {},
	});

	if (!body.success) throw new Error(body.msg!);
	return (
		options?.old?.patch(body.data) ?? (new Ricevimenti(body.data, client) as T)
	);
};

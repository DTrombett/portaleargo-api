import type { APIRicevimenti, Client } from "..";
import { apiRequest } from "..";
import { validateRicevimenti } from "../schemas";

/**
 * Ottieni i dati riguardo i ricevimenti dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getRicevimenti = async <T extends APIRicevimenti["data"]>(
	client: Client,
	options?: { old?: T },
) => {
	const { body } = await apiRequest<APIRicevimenti>("ricevimento", client, {
		method: "POST",
		body: {},
	});

	if (!body.success) throw new Error(body.msg!);
	if (!client.noTypeCheck) validateRicevimenti(body);
	return Object.assign(options?.old ?? {}, body.data);
};

import type { APIBacheca, Client } from "..";
import { apiRequest, handleOperation } from "..";

/**
 * Ottieni lo storico della bacheca.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getStoricoBacheca = async (
	client: Client,
	options: {
		profileId: string;
	},
) => {
	const { body } = await apiRequest<APIBacheca>("storicobacheca", client, {
		method: "POST",
		body: {
			pkScheda: options.profileId,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return handleOperation(body.data.bacheca);
};

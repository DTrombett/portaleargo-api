import type { APICorsiRecupero, Client } from "..";
import { apiRequest } from "../util";
import { validateCorsiRecupero } from "../schemas";

/**
 * Ottieni i dati dei corsi di recupero dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getCorsiRecupero = async <T extends APICorsiRecupero["data"]>(
	client: Client,
	options: {
		profileId: string;
		old?: T;
	},
) => {
	const { body } = await apiRequest<APICorsiRecupero>("corsirecupero", client, {
		method: "POST",
		body: {
			pkScheda: options.profileId,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	if (!client.noTypeCheck) validateCorsiRecupero(body);
	return Object.assign(options.old ?? {}, body.data);
};

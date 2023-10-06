import type { APICorsiRecupero, Client } from "..";
import { CorsiRecupero, apiRequest } from "..";

/**
 * Ottieni i dati dei corsi di recupero dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getCorsiRecupero = async <T extends CorsiRecupero>(
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
	return (options.old?.patch(body.data) ??
		new CorsiRecupero(body.data, client, options.profileId)) as T;
};

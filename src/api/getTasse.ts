import type { APITasse, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni i dati delle tasse dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getTasse = async (
	client: Client,
	options: {
		profileId: string;
	},
) => {
	const { body } = await apiRequest<APITasse>("listatassealunni", client, {
		method: "POST",
		body: {
			pkScheda: options.profileId,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	const { success, msg, data, ...rest } = body;

	return {
		...rest,
		tasse: data,
	};
};

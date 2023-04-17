import type { APITasse, Client } from "..";
import { Tassa, apiRequest } from "..";

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
	}
) => {
	const { body } = await apiRequest<APITasse>("listatassealunni", client, {
		method: "POST",
		body: {
			pkScheda: options.profileId,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return {
		pagOnline: body.isPagOnlineAttivo,
		tasse: body.data.map((a) => new Tassa(a, client)),
	};
};

import type { APIPCTO, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni i dati del PCTO dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getPCTOData = async (
	client: Client,
	options: {
		profileId: string;
	}
) => {
	const { body } = await apiRequest<APIPCTO>("pcto", client, {
		method: "POST",
		body: {
			pkScheda: options.profileId,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return body.data.pcto;
};

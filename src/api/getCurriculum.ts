import type { APICurriculum, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni il curriculum dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getCurriculum = async (
	client: Client,
	options: {
		profileId: string;
	},
) => {
	const { body } = await apiRequest<APICurriculum>("curriculumalunno", client, {
		method: "POST",
		body: {
			pkScheda: options.profileId,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return body.data.curriculum;
};

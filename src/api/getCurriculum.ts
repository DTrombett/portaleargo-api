import type { APICurriculum, Client } from "..";
import { apiRequest } from "../util";
import { validateCurriculum } from "../schemas";

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
	if (!client.noTypeCheck) validateCurriculum(body);
	return body.data.curriculum;
};

import type { APICurriculum, Client } from "..";
import { Curriculum, apiRequest } from "..";

/**
 * Ottieni il curriculum dello studente.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const getCurriculum = async (
	client: Client,
	options: {
		id: string;
	}
) => {
	const { body } = await apiRequest<APICurriculum>("curriculumalunno", client, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return body.data.curriculum.map((c) => new Curriculum(c, client));
};

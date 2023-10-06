import type { APIDownloadAllegato, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni il link per scaricare un allegato della bacheca alunno.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns Il link
 */
export const downloadAllegatoStudente = async (
	client: Client,
	options: {
		id: string;
		profileId: string;
	},
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobachecaalunno",
		client,
		{
			method: "POST",
			body: {
				uid: options.id,
				pkScheda: options.profileId,
			},
		},
	);

	if (!body.success) throw new Error(body.msg);
	return body.url;
};

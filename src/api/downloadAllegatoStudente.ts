import type { APIDownloadAllegato, Client } from "..";
import { apiRequest } from "..";
import { validateDownloadAllegato } from "../schemas";

/**
 * Ottieni il link per scaricare un allegato della bacheca alunno.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns Il link
 */
export const downloadAllegatoStudente = async (
	client: Client,
	options: {
		uid: string;
		profileId: string;
	},
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobachecaalunno",
		client,
		{
			method: "POST",
			body: {
				uid: options.uid,
				pkScheda: options.profileId,
			},
		},
	);

	if (!body.success) throw new Error(body.msg);
	if (!client.noTypeCheck) validateDownloadAllegato(body);
	return body.url;
};

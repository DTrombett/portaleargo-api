import type { APIDownloadAllegato, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni il link per scaricare un allegato della bacheca.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns Il link
 */
export const downloadAllegato = async (
	client: Client,
	options: {
		id: string;
	}
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobacheca",
		client,
		{
			method: "POST",
			body: {
				uid: options.id,
			},
		}
	);

	if (!body.success) throw new Error(body.msg);
	return body.url;
};

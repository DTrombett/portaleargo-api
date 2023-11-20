import type { APIDownloadAllegato, Client } from "..";
import { apiRequest } from "../util";
import { validateDownloadAllegato } from "../schemas";

/**
 * Ottieni il link per scaricare un allegato della bacheca.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns Il link
 */
export const downloadAllegato = async (
	client: Client,
	options: {
		uid: string;
	},
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobacheca",
		client,
		{
			method: "POST",
			body: {
				uid: options.uid,
			},
		},
	);

	if (!body.success) throw new Error(body.msg);
	if (!client.noTypeCheck) validateDownloadAllegato(body);
	return body.url;
};

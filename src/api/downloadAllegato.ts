import type { APIDownloadAllegato, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni il link per scaricare un allegato della bacheca.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const downloadAllegato = async (
	client: Client,
	options: {
		uid: string;
	}
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobacheca",
		client,
		{
			method: "POST",
			body: {
				uid: options.uid,
			},
		}
	);

	if (!body.success) throw new Error(body.msg);
	return body.url;
};

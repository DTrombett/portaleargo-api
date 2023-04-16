import type { APIDownloadAllegato, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni il link per scaricare un allegato della bacheca alunno.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const downloadAllegatoStudente = async (
	client: Client,
	options: {
		uid: string;
		id: string;
	}
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobachecaalunno",
		client,
		{
			method: "POST",
			body: {
				uid: options.uid,
				pkScheda: options.id,
			},
		}
	);

	if (!body.success) throw new Error(body.msg);
	return body.url;
};

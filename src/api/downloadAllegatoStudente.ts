import type { APIDownloadAllegato, Login, RequestOptions, Token } from "..";
import { apiRequest } from "../util";

/**
 * Ottieni il link per scaricare un allegato della bacheca alunno.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const downloadAllegatoStudente = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		uid: string;
		id: string;
	}
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobachecaalunno",
		token,
		{
			method: "POST",
			body: {
				uid: options.uid,
				pkScheda: options.id,
			},
			login,
			debug: options.debug,
			headers: options.headers,
		}
	);

	if (!body.success) throw new Error(body.msg);
	return body.url;
};

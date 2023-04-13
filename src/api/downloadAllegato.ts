import type { APIDownloadAllegato, Login, RequestOptions, Token } from "..";
import { apiRequest } from "..";

/**
 * Ottieni il link per scaricare un allegato della bacheca.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const downloadAllegato = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		uid: string;
	}
) => {
	const { body } = await apiRequest<APIDownloadAllegato>(
		"downloadallegatobacheca",
		token,
		{
			method: "POST",
			body: {
				uid: options.uid,
			},
			login,
			debug: options.debug,
			headers: options.headers,
		}
	);

	if (!body.success) throw new Error(body.msg);
	return body.url;
};

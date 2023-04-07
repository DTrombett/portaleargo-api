import type {
	APIDownloadAttachment,
	Login,
	RequestOptions,
	Token,
} from "../types";
import { apiRequest } from "../util";

/**
 * Get the link to download an attachment.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const downloadAttachment = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		uid: string;
	}
) => {
	const { body } = await apiRequest<APIDownloadAttachment>(
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

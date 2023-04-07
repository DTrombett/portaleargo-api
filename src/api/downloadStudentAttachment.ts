import type {
	APIDownloadAttachment,
	Login,
	RequestOptions,
	Token,
} from "../types";
import { apiRequest } from "../util";

/**
 * Get the link to download a student attachment.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const downloadStudentAttachment = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		uid: string;
		id: string;
	}
) => {
	const { body } = await apiRequest<APIDownloadAttachment>(
		"downloadallegatobachecaalunno",
		token,
		{
			method: "POST",
			body: {
				uid: options.uid,
				pk: options.id,
			},
			login,
			debug: options.debug,
			headers: options.headers,
		}
	);

	if (!body.success) throw new Error(body.msg);
	return body.url;
};

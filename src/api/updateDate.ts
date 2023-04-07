import type { APIResponse, Login, RequestOptions, Token } from "../types";
import { apiRequest, formatDate } from "../util";

/**
 * Update the last update date.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const updateDate = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { body } = await apiRequest<APIResponse>(
		"dashboard/aggiornadata",
		token,
		{
			method: "POST",
			body: {
				dataultimoaggiornamento: formatDate(new Date()),
			},
			login,
			debug: options?.debug,
			headers: options?.headers,
		}
	);

	if (!body.success) throw new Error(body.msg!);
};

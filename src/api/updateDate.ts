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
	const { res, body } = await apiRequest<APIResponse>(
		"dashboard/aggiornadata",
		token,
		{
			method: "POST",
			body: {
				dataultimoaggiornamento: formatDate(new Date()),
			},
			login,
			...options,
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while updating the date. Status code: ${res.statusCode}`
		);
};

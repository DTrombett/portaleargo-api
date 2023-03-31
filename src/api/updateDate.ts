import type { APIResponse, Login, Token } from "../types";
import { apiRequest, formatDate } from "../util";

/**
 * Update the last update date.
 * @param token - The token data
 * @param login - The login data
 */
export const updateDate = async (token: Token, login: Login) => {
	const { res, body } = await apiRequest<APIResponse>(
		"dashboard/aggiornadata",
		token,
		login,
		{
			method: "POST",
			body: {
				dataultimoaggiornamento: formatDate(new Date()),
			},
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while updating the date. Status code: ${res.statusCode}`
		);
};

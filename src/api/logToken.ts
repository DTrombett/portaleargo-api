import type { APIResponse, Login, Token } from "../types";
import { apiRequest, formatDate } from "../util";

/**
 * Log the token.
 * @param token - The token data
 * @param login - The login data
 * @param oldToken - The old token data
 */
export const logToken = async (token: Token, login: Login, oldToken: Token) => {
	const { res, body } = await apiRequest<APIResponse>(
		"logtoken",
		token,
		login,
		{
			method: "POST",
			body: {
				bearerOld: oldToken.accessToken,
				dateExpOld: formatDate(oldToken.expireDate),
				refreshOld: oldToken.refreshToken,
				bearerNew: token.accessToken,
				dateExpNew: formatDate(token.expireDate),
				refreshNew: token.refreshToken,
				isWhat: "false",
				isRefreshed: (token.accessToken === oldToken.accessToken).toString(),
				proc: "initState_global_random_12345",
			},
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while logging the token. Status code: ${res.statusCode}`
		);
};

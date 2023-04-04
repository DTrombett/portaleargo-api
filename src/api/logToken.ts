import type { APIResponse, Login, RequestOptions, Token } from "../types";
import { apiRequest, formatDate } from "../util";

/**
 * Log the token.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const logToken = async (
	token: Token,
	login: Login,
	options: RequestOptions & { oldToken: Token }
) => {
	const { res, body } = await apiRequest<APIResponse>(
		"logtoken",
		token,
		login,
		{
			method: "POST",
			body: {
				bearerOld: options.oldToken.accessToken,
				dateExpOld: formatDate(options.oldToken.expireDate),
				refreshOld: options.oldToken.refreshToken,
				bearerNew: token.accessToken,
				dateExpNew: formatDate(token.expireDate),
				refreshNew: token.refreshToken,
				isWhat: "false",
				isRefreshed: (
					token.accessToken === options.oldToken.accessToken
				).toString(),
				proc: "initState_global_random_12345",
			},
			...options,
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while logging the token. Status code: ${res.statusCode}`
		);
};

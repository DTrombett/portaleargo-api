import { buildWhat } from "../builders";
import type { APIWhat, Login, RequestOptions, Token } from "../types";
import { apiRequest, formatDate } from "../util";

/**
 * Get the what data.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const what = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		lastUpdate: Date | number | string;
	}
) => {
	const authToken = JSON.stringify([login.token]);
	const { res, body } = await apiRequest<APIWhat>(
		"dashboard/what",
		token,
		login,
		{
			method: "POST",
			body: {
				"dataultimoaggiornamento": formatDate(options.lastUpdate),
				"opzioni": JSON.stringify(login.options),
				"lista-x-auth-token": authToken,
				"lista-x-auth-token-account": authToken,
			},
			...options,
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while requesting the what data. Status code: ${res.statusCode}`
		);
	return buildWhat(body);
};

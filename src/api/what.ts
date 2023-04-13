import type { APIWhat, Login, RequestOptions, Token } from "..";
import { What } from "../structures";
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
	const { body } = await apiRequest<APIWhat>("dashboard/what", token, {
		method: "POST",
		body: {
			"dataultimoaggiornamento": formatDate(options.lastUpdate),
			"opzioni": JSON.stringify(login.options),
			"lista-x-auth-token": authToken,
			"lista-x-auth-token-account": authToken,
		},
		login,
		debug: options.debug,
		headers: options.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return new What(body.data.dati[0]);
};

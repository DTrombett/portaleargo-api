import { buildRicevimenti } from "../builders";
import type { APIRicevimenti, Login, RequestOptions, Token } from "../types";
import { apiRequest } from "../util";

/**
 * Get the `ricevimenti` for the student.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getRicevimenti = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { body } = await apiRequest<APIRicevimenti>("ricevimento", token, {
		method: "POST",
		body: {},
		login,
		debug: options?.debug,
		headers: options?.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return buildRicevimenti(body);
};

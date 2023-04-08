import { buildProfilo } from "../builders";
import type { APIProfilo, Login, RequestOptions, Token } from "../types";
import { apiRequest, writeToFile } from "../util";

/**
 * Ottieni i dati riguardo il profilo dell'utente.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getProfilo = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { body } = await apiRequest<APIProfilo>("profilo", token, {
		login,
		debug: options?.debug,
		headers: options?.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	const value = buildProfilo(body);

	void writeToFile("profile", value);
	return value;
};

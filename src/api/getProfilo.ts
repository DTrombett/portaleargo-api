import type { APIProfilo, Login, RequestOptions, Token } from "..";
import { Profilo, apiRequest, writeToFile } from "..";

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
	const value = new Profilo(body.data);

	void writeToFile("profile", value);
	return value;
};

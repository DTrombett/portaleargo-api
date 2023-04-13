import type { APIDettagliProfilo, Login, RequestOptions, Token } from "..";
import { DettagliProfilo } from "../structures";
import { apiRequest } from "../util";

/**
 * Ottieni i dettagli del profilo dello studente.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getDettagliProfilo = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { body } = await apiRequest<APIDettagliProfilo>(
		"dettaglioprofilo",
		token,
		{
			body: null,
			method: "POST",
			login,
			debug: options?.debug,
			headers: options?.headers,
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return new DettagliProfilo(body.data);
};

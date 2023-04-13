import type { APICorsiRecupero, Login, RequestOptions, Token } from "..";
import { CorsiRecupero, apiRequest } from "..";

/**
 * Ottieni i dati dei corsi di recupero dello studente.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getCorsiRecupero = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		id: string;
	}
) => {
	const { body } = await apiRequest<APICorsiRecupero>("corsirecupero", token, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
		login,
		debug: options.debug,
		headers: options.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return new CorsiRecupero(body.data);
};

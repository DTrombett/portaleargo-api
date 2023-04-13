import type { APITasse, Login, RequestOptions, Token } from "..";
import { Tasse, apiRequest } from "..";

/**
 * Ottieni le tasse dello studente.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getTasse = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		id: string;
	}
) => {
	const { body } = await apiRequest<APITasse>("listatassealunni", token, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
		login,
		debug: options.debug,
		headers: options.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return new Tasse(body);
};

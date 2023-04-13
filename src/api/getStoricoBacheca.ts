import type { APIBacheca, Login, RequestOptions, Token } from "..";
import { EventoBacheca, apiRequest, handleOperation } from "..";

/**
 * Ottieni lo storico della bacheca.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getStoricoBacheca = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		id: string;
	}
) => {
	const { body } = await apiRequest<APIBacheca>("storicobacheca", token, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
		login,
		debug: options.debug,
		headers: options.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return handleOperation(
		body.data.bacheca,
		undefined,
		(a) => new EventoBacheca(a)
	);
};

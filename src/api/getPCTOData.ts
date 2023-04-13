import type { APIPCTO, Login, RequestOptions, Token } from "..";
import { apiRequest } from "../util";

/**
 * Ottieni i dati del PCTO dello studente.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getPCTOData = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		id: string;
	}
) => {
	const { body } = await apiRequest<APIPCTO>("pcto", token, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
		login,
		debug: options.debug,
		headers: options.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return body.data.pcto;
};

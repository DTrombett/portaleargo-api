import { buildBachecaAlunno } from "../builders";
import type { APIBachecaAlunno, Login, RequestOptions, Token } from "../types";
import { apiRequest } from "../util";

/**
 * Ottieni lo storico della bacheca alunno.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getStoricoBachecaAlunno = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		id: string;
	}
) => {
	const { body } = await apiRequest<APIBachecaAlunno>(
		"storicobachecaalunno",
		token,
		{
			method: "POST",
			body: {
				pkScheda: options.id,
			},
			login,
			debug: options.debug,
			headers: options.headers,
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return buildBachecaAlunno(body);
};

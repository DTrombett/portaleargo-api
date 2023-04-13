import type { APIBachecaAlunno, Login, RequestOptions, Token } from "..";
import { EventoBachecaAlunno, apiRequest, handleOperation } from "..";

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
	return handleOperation(
		body.data.bachecaAlunno,
		undefined,
		(a) => new EventoBachecaAlunno(a)
	);
};

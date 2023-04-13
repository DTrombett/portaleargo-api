import type { APICurriculum, Login, RequestOptions, Token } from "..";
import { Curriculum, apiRequest } from "..";

/**
 * Ottieni il curriculum dello studente.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getCurriculum = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		id: string;
	}
) => {
	const { body } = await apiRequest<APICurriculum>("curriculumalunno", token, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
		login,
		debug: options.debug,
		headers: options.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return body.data.curriculum.map((c) => new Curriculum(c));
};

import type { APIVotiScrutinio, Login, RequestOptions, Token } from "..";
import { Scrutinio, apiRequest } from "..";

/**
 * Ottieni i voti dello scrutinio dello studente.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getVotiScrutinio = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { body } = await apiRequest<APIVotiScrutinio>("votiscrutinio", token, {
		method: "POST",
		body: {},
		login,
		debug: options?.debug,
		headers: options?.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return body.data.votiScrutinio[0].periodi.map((a) => new Scrutinio(a));
};

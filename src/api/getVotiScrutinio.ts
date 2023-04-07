import { buildVotiScrutinio } from "../builders";
import type { APIVotiScrutinio, Login, RequestOptions, Token } from "../types";
import { apiRequest } from "../util";

/**
 * Get the final grades for the student.
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
	return buildVotiScrutinio(body);
};

import { buildPCTO } from "../builders";
import type { APIPCTO, Login, RequestOptions, Token } from "../types";
import { apiRequest } from "../util";

/**
 * Get the pcto data for the student.
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
	return buildPCTO(body);
};

import { buildTaxes } from "../builders";
import type { APITaxes, Login, RequestOptions, Token } from "../types";
import { apiRequest } from "../util";

/**
 * Get the taxes for the student.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getTaxes = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		id: string;
	}
) => {
	const { body } = await apiRequest<APITaxes>("listatassealunni", token, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
		login,
		debug: options.debug,
		headers: options.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return buildTaxes(body);
};

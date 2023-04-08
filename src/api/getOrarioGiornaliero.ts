import { buildOrarioGiornaliero } from "../builders";
import type {
	APIOrarioGiornaliero,
	Login,
	RequestOptions,
	Token,
} from "../types";
import { apiRequest, formatDate } from "../util";

/**
 * Ottieni l'orario giornaliero.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getOrarioGiornaliero = async (
	token: Token,
	login: Login,
	options?: RequestOptions & {
		year?: number;
		month?: number;
		day?: number;
	}
) => {
	const now = new Date();
	const { body } = await apiRequest<APIOrarioGiornaliero>(
		"orario-giorno",
		token,
		{
			method: "POST",
			body: {
				datGiorno: formatDate(
					`${options?.year ?? now.getFullYear()}-${
						options?.month ?? now.getMonth() + 1
					}-${options?.day ?? now.getDate() + 1}`
				),
			},
			login,
			debug: options?.debug,
			headers: options?.headers,
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return buildOrarioGiornaliero(body);
};

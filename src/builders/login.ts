import type { APILogin, Login } from "../types";

/**
 * Build the login data.
 * @param body - The API response
 * @returns The new data
 */
export const buildLogin = (body: APILogin): Login => {
	const [data] = body.data;

	return {
		schoolCode: data.codMin,
		options: Object.fromEntries(data.opzioni.map((a) => [a.chiave, a.valore])),
		isFirstAccess: data.isPrimoAccesso,
		disabledProfile: data.profiloDisabilitato,
		isResetPassword: data.isResetPassword,
		isSpid: data.isSpid,
		token: data.token,
		username: data.username,
	};
};

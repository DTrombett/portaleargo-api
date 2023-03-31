import { buildProfile } from "../builders";
import type { APIProfile, Login, Token } from "../types";
import { apiRequest, writeToFile } from "../util";

/**
 * Fetch profile information for the authenticated user.
 * @param token - The token data
 * @param login - The login data
 * @returns The profile data
 */
export const profile = async (token: Token, login: Login) => {
	const { res, body } = await apiRequest<APIProfile>(
		"https://www.portaleargo.it/appfamiglia/api/rest/profilo",
		token,
		login
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while requesting the profile. Status code: ${res.statusCode}`
		);
	const value = buildProfile(body);

	void writeToFile("profile", value);
	return value;
};

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildProfile } from "../builders";
import type { APIProfile, Login, Token } from "../types";
import { apiRequest, AuthFolder } from "../util";

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

	writeFile(join(AuthFolder, "profile.json"), JSON.stringify(value)).catch(
		console.error
	);
	return value;
};

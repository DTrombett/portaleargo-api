import { buildProfileDetails } from "../builders";
import type { APIProfileDetails, Login, Token } from "../types";
import { apiRequest, writeToFile } from "../util";

/**
 * Fetch all the profile details for the authenticated user.
 * @param token - The token data
 * @param login - The login data
 * @returns The profile details for the user
 */
export const profileDetails = async (token: Token, login: Login) => {
	const { res, body } = await apiRequest<APIProfileDetails>(
		"https://www.portaleargo.it/appfamiglia/api/rest/dettaglioprofilo",
		token,
		login,
		{
			body: null,
			method: "POST",
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while requesting the profile details. Status code: ${res.statusCode}`
		);
	const value = buildProfileDetails(body);

	void writeToFile("profileDetails", value);
	return value;
};

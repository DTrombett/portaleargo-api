import { buildProfileDetails } from "../builders";
import type { APIProfileDetails, Login, RequestOptions, Token } from "../types";
import { apiRequest, writeToFile } from "../util";

/**
 * Fetch all the profile details for the authenticated user.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 * @returns The profile details for the user
 */
export const profileDetails = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { res, body } = await apiRequest<APIProfileDetails>(
		"dettaglioprofilo",
		token,
		{
			body: null,
			method: "POST",
		login,
			...options,
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

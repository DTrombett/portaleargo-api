import { buildProfileDetails } from "../builders";
import type { APIProfileDetails, Login, RequestOptions, Token } from "../types";
import { apiRequest } from "../util";

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
	const { body } = await apiRequest<APIProfileDetails>(
		"dettaglioprofilo",
		token,
		{
			body: null,
			method: "POST",
			login,
			debug: options?.debug,
			headers: options?.headers,
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return buildProfileDetails(body);
};

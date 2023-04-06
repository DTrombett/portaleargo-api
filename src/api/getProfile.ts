import { buildProfile } from "../builders";
import type { APIProfile, Login, RequestOptions, Token } from "../types";
import { apiRequest, writeToFile } from "../util";

/**
 * Fetch profile information for the authenticated user.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 * @returns The profile data
 */
export const getProfile = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { body } = await apiRequest<APIProfile>("profilo", token, {
		login,
		...options,
	});

	if (!body.success)
		throw new Error(
			body.msg!
		);
	const value = buildProfile(body);

	void writeToFile("profile", value);
	return value;
};

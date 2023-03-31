import { rm } from "node:fs/promises";
import type { APIResponse, Login, Token } from "../types";
import { AuthFolder, apiRequest } from "../util";

/**
 * Delete the profile.
 * @param token - The token data
 * @param login - The login data
 */
export const deleteProfile = async (token: Token, login: Login) => {
	const { res, body } = await apiRequest<APIResponse>(
		"rimuoviprofilo",
		token,
		login,
		{
			method: "POST",
			body: {},
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while deleting the profile. Status code: ${res.statusCode}`
		);
	await rm(AuthFolder, { recursive: true, force: true });
};

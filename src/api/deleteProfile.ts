import { rm } from "node:fs/promises";
import type { APIResponse, Login, RequestOptions, Token } from "../types";
import { AuthFolder, apiRequest } from "../util";

/**
 * Delete the profile.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const deleteProfile = async (
	token: Token,
	login: Login,
	options?: RequestOptions
) => {
	const { body } = await apiRequest<APIResponse>("rimuoviprofilo", token, {
		method: "POST",
		body: {},
		login,
		...options,
	});

	if (!body.success) throw new Error(body.msg!);
	await rm(AuthFolder, { recursive: true, force: true });
};

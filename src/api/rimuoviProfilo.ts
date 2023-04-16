import { rm } from "node:fs/promises";
import type { APIResponse, Client } from "..";
import { AuthFolder, apiRequest } from "..";

/**
 * Rimuovi il profilo.
 * @param client - The client
 */
export const rimuoviProfilo = async (client: Client) => {
	const { body } = await apiRequest<APIResponse>("rimuoviprofilo", client, {
		method: "POST",
		body: {},
	});

	if (!body.success) throw new Error(body.msg!);
	await rm(AuthFolder, { recursive: true, force: true });
};

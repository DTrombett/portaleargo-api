import type { APIResponse, Client } from "..";
import { apiRequest } from "..";

/**
 * Rimuovi il profilo.
 * @param client - Il client
 */
export const rimuoviProfilo = async (client: Client) => {
	const { body } = await apiRequest<APIResponse>("rimuoviprofilo", client, {
		method: "POST",
		body: {},
	});

	if (!body.success) throw new Error(body.msg!);
	await client.dataProvider?.reset();
};

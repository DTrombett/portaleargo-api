import type { APIVotiScrutinio, Client } from "..";
import { apiRequest } from "../util";
import { validateVotiScrutinio } from "../schemas";

/**
 * Ottieni i voti dello scrutinio dello studente.
 * @param client - Il client
 * @returns I dati
 */
export const getVotiScrutinio = async (client: Client) => {
	const { body } = await apiRequest<APIVotiScrutinio>("votiscrutinio", client, {
		method: "POST",
		body: {},
	});

	if (!body.success) throw new Error(body.msg!);
	if (!client.noTypeCheck) validateVotiScrutinio(body);
	return body.data.votiScrutinio[0].periodi;
};

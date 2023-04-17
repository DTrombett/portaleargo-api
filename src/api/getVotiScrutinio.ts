import type { APIVotiScrutinio, Client } from "..";
import { Scrutinio, apiRequest } from "..";

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
	return body.data.votiScrutinio[0].periodi.map(
		(a) => new Scrutinio(a, client)
	);
};

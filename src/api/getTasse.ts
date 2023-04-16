import type { APITasse, Client } from "..";
import { Tasse, apiRequest } from "..";

/**
 * Ottieni le tasse dello studente.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const getTasse = async (
	client: Client,
	options: {
		id: string;
	}
) => {
	const { body } = await apiRequest<APITasse>("listatassealunni", client, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return new Tasse(body, client);
};

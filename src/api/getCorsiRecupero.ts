import type { APICorsiRecupero, Client } from "..";
import { CorsiRecupero, apiRequest } from "..";

/**
 * Ottieni i dati dei corsi di recupero dello studente.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const getCorsiRecupero = async (
	client: Client,
	options: {
		id: string;
	}
) => {
	const { body } = await apiRequest<APICorsiRecupero>("corsirecupero", client, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return new CorsiRecupero(body.data, client);
};

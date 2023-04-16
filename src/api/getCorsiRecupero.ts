import type { APICorsiRecupero, Client } from "..";
import { CorsiRecupero, apiRequest } from "..";

/**
 * Ottieni i dati dei corsi di recupero dello studente.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const getCorsiRecupero = async <T extends CorsiRecupero>(
	client: Client,
	options: {
		id: string;
		old?: T;
	}
) => {
	const { body } = await apiRequest<APICorsiRecupero>("corsirecupero", client, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return (options.old?.patch(body.data) ??
		new CorsiRecupero(body.data, client, options.id)) as T;
};

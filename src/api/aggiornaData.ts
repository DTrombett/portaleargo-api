import type { APIResponse, Client } from "..";
import { apiRequest, formatDate } from "..";

/**
 * Aggiorna la data dell'ultimo aggiornamento.
 * @param client - The client
 */
export const aggiornaData = async (client: Client) => {
	const { body } = await apiRequest<APIResponse>(
		"dashboard/aggiornadata",
		client,
		{
			method: "POST",
			body: {
				dataultimoaggiornamento: formatDate(new Date()),
			},
		}
	);

	if (!body.success) throw new Error(body.msg!);
};

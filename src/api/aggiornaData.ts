import type { APIResponse, Client } from "..";
import { apiRequest, formatDate } from "../util";

/**
 * Aggiorna la data per la dashboard.
 * @param client - Il client
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
		},
	);

	if (!body.success) throw new Error(body.msg!);
};

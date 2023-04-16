import type { APIBachecaAlunno, Client } from "..";
import { EventoBachecaAlunno, apiRequest, handleOperation } from "..";

/**
 * Ottieni lo storico della bacheca alunno.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const getStoricoBachecaAlunno = async (
	client: Client,
	options: {
		id: string;
	}
) => {
	const { body } = await apiRequest<APIBachecaAlunno>(
		"storicobachecaalunno",
		client,
		{
			method: "POST",
			body: {
				pkScheda: options.id,
			},
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return handleOperation(
		body.data.bachecaAlunno,
		undefined,
		(a) => new EventoBachecaAlunno(a, client)
	);
};

import type { APIBachecaAlunno, Client } from "..";
import { EventoBachecaAlunno, apiRequest, handleOperation } from "..";

/**
 * Ottieni lo storico della bacheca alunno.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getStoricoBachecaAlunno = async (
	client: Client,
	options: {
		profileId: string;
	},
) => {
	const { body } = await apiRequest<APIBachecaAlunno>(
		"storicobachecaalunno",
		client,
		{
			method: "POST",
			body: {
				pkScheda: options.profileId,
			},
		},
	);

	if (!body.success) throw new Error(body.msg!);
	return handleOperation(
		body.data.bachecaAlunno,
		undefined,
		(a) => new EventoBachecaAlunno(a, client),
	);
};

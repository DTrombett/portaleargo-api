import type { APIBachecaAlunno, Client } from "..";
import { apiRequest, handleOperation } from "..";
import { validateBachecaAlunno } from "../schemas";

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
	if (!client.noTypeCheck) validateBachecaAlunno(body);
	return handleOperation(body.data.bachecaAlunno);
};

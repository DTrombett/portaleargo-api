import type { APIRicevutaTelematica, Client } from "..";
import { Ricevuta, apiRequest } from "..";

/**
 * Ottieni i dati di una ricevuta telematica.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getRicevutaTelematica = async (
	client: Client,
	options: {
		iuv: string;
	}
) => {
	const { body } = await apiRequest<APIRicevutaTelematica>(
		"ricevutatelematica",
		client,
		{
			method: "POST",
			body: {
				iuv: options.iuv,
			},
		}
	);

	if (!body.success) throw new Error(body.msg);
	return new Ricevuta(body, client);
};

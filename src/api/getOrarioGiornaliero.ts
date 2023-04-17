import type { APIOrarioGiornaliero, Client } from "..";
import { Orario, apiRequest, formatDate } from "..";

/**
 * Ottieni l'orario giornaliero.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getOrarioGiornaliero = async (
	client: Client,
	options?: {
		year?: number;
		month?: number;
		day?: number;
	}
) => {
	const now = new Date();
	const { body } = await apiRequest<APIOrarioGiornaliero>(
		"orario-giorno",
		client,
		{
			method: "POST",
			body: {
				datGiorno: formatDate(
					`${options?.year ?? now.getFullYear()}-${
						options?.month ?? now.getMonth() + 1
					}-${options?.day ?? now.getDate() + 1}`
				),
			},
		}
	);

	if (!body.success) throw new Error(body.msg!);
	return Object.values(body.data.dati)
		.flat()
		.map((d) => new Orario(d, client));
};

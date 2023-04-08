import type { APIVotiScrutinio, VotiScrutinio } from "../types";

/**
 * Elabora i dati dei voti dello scrutinio.
 * @param body - The API response
 * @returns The new data
 */
export const buildVotiScrutinio = (body: APIVotiScrutinio): VotiScrutinio => {
	const {
		data: {
			votiScrutinio: [data],
		},
	} = body;

	return {
		periodi: data.periodi.map((a) => ({
			descrizione: a.desDescrizione,
			materie: a.materie,
			scrutinioFinale: a.scrutinioFinale,
			suddivisione: a.suddivisione,
			voti: a.votiGiudizi,
		})),
	};
};

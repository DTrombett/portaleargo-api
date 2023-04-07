import type { APIVotiScrutinio, VotiScrutinio } from "../types";

/**
 * Build the voti scrutinio data.
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

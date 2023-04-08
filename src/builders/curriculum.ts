import type { APICurriculum, Curriculum } from "../types";

/**
 * Build the curriculum data.
 * @param body - The API response
 * @returns The new data
 */
export const buildCurriculum = (body: APICurriculum): Curriculum => {
	const {
		data: { curriculum },
	} = body;

	return curriculum.map((a) => ({
		anno: a.anno,
		classe: a.classe,
		credito: a.credito,
		CV: a.CVAbilitato,
		id: a.pkScheda,
		interruzioneFR: a.isInterruzioneFR,
		media: a.media,
		mostraCredito: a.mostraCredito,
		mostraInfo: a.mostraInfo,
		ordine: a.ordineScuola,
		superiore: a.isSuperiore,
		esito:
			typeof a.esito === "object"
				? {
						ammesso: a.esito.flgPositivo === "S",
						codEsito: a.esito.codEsito,
						codScuola: a.esito.esitoPK.codMin,
						colore: a.esito.numColore,
						descrizione: a.esito.descrizione,
						icona: a.esito.icona,
						particolarità: a.esito.particolarita,
				  }
				: null,
	}));
};

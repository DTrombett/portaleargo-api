import type { APIBacheca, Bacheca } from "../types";
import { handleOperation } from "../util";

/**
 * Elabora i dati della bacheca.
 * @param body - The API response
 * @returns The new data
 */
export const buildBacheca = (body: APIBacheca): Bacheca => {
	const {
		data: { bacheca },
	} = body;

	return handleOperation(bacheca, undefined, (a) => ({
		data: a.datEvento,
		dettagli: a.messaggio,
		richiestaPresaVisione: a.pvRichiesta,
		categoria: a.categoria,
		dataPresaVisione: a.dataConfermaPresaVisione,
		url: a.url,
		autore: a.autore,
		dataScadenza: a.dataScadenza,
		adRichiesta: a.adRichiesta,
		dataConfermaAdesione: a.dataConfermaAdesione,
		allegati: a.listaAllegati.map((b) => ({
			nome: b.nomeFile,
			percorso: b.path,
			descrizione: b.descrizioneFile,
			url: b.url,
			id: b.pk,
		})),
		dataScadenzaAdesione: a.dataScadAdesione,
	}));
};

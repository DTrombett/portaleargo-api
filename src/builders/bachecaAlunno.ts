import type { APIBachecaAlunno, BachecaAlunno } from "../types";
import { handleOperation } from "../util";

/**
 * Elabora i dati della bacheca alunno.
 * @param body - The API response
 * @returns The new data
 */
export const buildBachecaAlunno = (body: APIBachecaAlunno): BachecaAlunno => {
	const {
		data: { bachecaAlunno },
	} = body;

	return handleOperation(bachecaAlunno, undefined, (a) => ({
		nomeFile: a.nomeFile,
		data: a.datEvento,
		dettagli: a.messaggio,
		downloadGenitore: a.flgDownloadGenitore,
		presaVisione: a.isPresaVisione,
	}));
};

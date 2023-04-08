import type { APITasse, Tasse } from "../types";

const resolveNumber = (n: string) => Number(n.replace(",", "."));

/**
 * Elabora i dati delle tasse.
 * @param body - The API response
 * @returns The new data
 */
export const buildTasse = (body: APITasse): Tasse => ({
	pagOnline: body.isPagOnlineAttivo,
	tasse: body.data.map((a) => ({
		dataCreazione: new Date(a.dataCreazione!).getTime() || null,
		dataPagamento: new Date(a.dataPagamento!).getTime() || null,
		debitore: a.debitore,
		descrizione: a.descrizione,
		importoPagato:
			a.importoPagato == null ? null : resolveNumber(a.importoPagato),
		importoPrevisto: resolveNumber(a.importoPrevisto),
		importoTassa: resolveNumber(a.importoTassa),
		iuv: a.iuv,
		pagabileOltreScadenza: a.pagabileOltreScadenza,
		pagOnLine: a.isPagoOnLine,
		rata: a.rata,
		rtPresent: a.rtPresent,
		rptPresent: a.rptPresent,
		scadenza: new Date(a.scadenza).getTime(),
		singoliPagamenti:
			a.listaSingoliPagamenti?.map((p) => ({
				importoTassa: resolveNumber(p.importoTassa),
				descrizione: p.descrizione,
				importoPrevisto: resolveNumber(p.importoPrevisto),
			})) ?? [],
		stato: a.stato,
	})),
});

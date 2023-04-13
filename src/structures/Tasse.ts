import type { APITasse, Jsonify } from "..";
import { Base } from "..";

type Data = APITasse | Jsonify<Tasse>;

/**
 * Rappresenta i dati delle tasse dello studente
 */
export class Tasse extends Base<APITasse> {
	tasse!: {
		importoPrevisto: number;
		dataPagamento: number | null;
		singoliPagamenti: {
			importoTassa: number;
			descrizione: string;
			importoPrevisto: number;
		}[];
		dataCreazione: number | null;
		scadenza: number;
		rptPresent: boolean;
		rata: string;
		iuv: string | null;
		importoTassa: number;
		stato: string;
		descrizione: string;
		debitore: string;
		importoPagato: number | null;
		pagabileOltreScadenza: boolean;
		rtPresent: boolean;
		pagOnLine: boolean;
	}[];
	pagOnline!: boolean;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data) {
		super();
		this.patch(data);
	}

	private static resolveNumber(n: string) {
		return Number(n.replace(",", "."));
	}

	patch(data: Data) {
		if (this.isJson(data)) super.patch(data);
		else {
			this.pagOnline = data.isPagOnlineAttivo;
			this.tasse = data.data.map((a) => ({
				dataCreazione: new Date(a.dataCreazione!).getTime() || null,
				dataPagamento: new Date(a.dataPagamento!).getTime() || null,
				debitore: a.debitore,
				descrizione: a.descrizione,
				importoPagato:
					a.importoPagato == null ? null : Tasse.resolveNumber(a.importoPagato),
				importoPrevisto: Tasse.resolveNumber(a.importoPrevisto),
				importoTassa: Tasse.resolveNumber(a.importoTassa),
				iuv: a.iuv,
				pagabileOltreScadenza: a.pagabileOltreScadenza,
				pagOnLine: a.isPagoOnLine,
				rata: a.rata,
				rtPresent: a.rtPresent,
				rptPresent: a.rptPresent,
				scadenza: new Date(a.scadenza).getTime(),
				singoliPagamenti:
					a.listaSingoliPagamenti?.map((p) => ({
						importoTassa: Tasse.resolveNumber(p.importoTassa),
						descrizione: p.descrizione,
						importoPrevisto: Tasse.resolveNumber(p.importoPrevisto),
					})) ?? [],
				stato: a.stato,
			}));
		}
	}
}

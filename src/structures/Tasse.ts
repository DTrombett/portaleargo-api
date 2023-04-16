import type { APITasse, Client, Jsonify } from "..";
import { Base } from "..";

type Data = APITasse | Jsonify<Tasse>;

/**
 * Rappresenta i dati delle tasse dello studente
 */
export class Tasse extends Base<APITasse> {
	tasse!: {
		importoPrevisto: number;
		dataPagamento: Date | null;
		singoliPagamenti: {
			importoTassa: number;
			descrizione: string;
			importoPrevisto: number;
		}[];
		dataCreazione: Date | null;
		scadenza: Date;
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
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	private static resolveNumber(n: string) {
		return Number(n.replace(",", "."));
	}

	patch(data: Data) {
		if (this.isJson(data)) {
			this.handleJson(data);
			this.tasse = data.tasse.map((a) => ({
				...a,
				dataCreazione:
					a.dataCreazione == null ? null : new Date(a.dataCreazione),
				dataPagamento:
					a.dataPagamento == null ? null : new Date(a.dataPagamento),
				scadenza: new Date(a.scadenza),
			}));
		} else {
			this.pagOnline = data.isPagOnlineAttivo;
			this.tasse = data.data.map((a) => ({
				dataCreazione:
					a.dataCreazione == null ? null : new Date(a.dataCreazione),
				dataPagamento:
					a.dataPagamento == null ? null : new Date(a.dataPagamento),
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
				scadenza: new Date(a.scadenza),
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

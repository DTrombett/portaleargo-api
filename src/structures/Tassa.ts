import type { APITasse, Client, Jsonify } from "..";
import { Base } from "..";

type TassaData = APITasse["data"][number];

type Data = Jsonify<Tassa> | TassaData;

/**
 * Rappresenta i dati delle tasse dello studente
 */
export class Tassa extends Base<TassaData> {
	importoPrevisto!: number;
	dataPagamento?: Date;
	singoliPagamenti!: {
		importoTassa: number;
		descrizione: string;
		importoPrevisto: number;
	}[];
	dataCreazione?: Date;
	scadenza!: Date;
	rptPresent!: boolean;
	rata!: string;
	iuv?: string;
	importoTassa!: number;
	stato!: string;
	descrizione!: string;
	debitore!: string;
	importoPagato?: number;
	pagabileOltreScadenza!: boolean;
	rtPresent!: boolean;
	pagOnLine!: boolean;

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
			this.dataCreazione = data.dataCreazione && new Date(data.dataCreazione);
			this.dataPagamento = data.dataPagamento && new Date(data.dataPagamento);
			this.scadenza = new Date(data.scadenza);
		} else {
			if (data.dataCreazione != null)
				this.dataCreazione = new Date(data.dataCreazione);
			if (data.dataPagamento != null)
				this.dataPagamento = new Date(data.dataPagamento);
			this.debitore = data.debitore;
			this.descrizione = data.descrizione;
			if (data.importoPagato != null)
				this.importoPagato = Tassa.resolveNumber(data.importoPagato);
			this.importoPrevisto = Tassa.resolveNumber(data.importoPrevisto);
			this.importoTassa = Tassa.resolveNumber(data.importoTassa);
			if (data.iuv != null) this.iuv = data.iuv;
			this.pagabileOltreScadenza = data.pagabileOltreScadenza;
			this.pagOnLine = data.isPagoOnLine;
			this.rata = data.rata;
			this.rtPresent = data.rtPresent;
			this.rptPresent = data.rptPresent;
			this.scadenza = new Date(data.scadenza);
			this.singoliPagamenti =
				data.listaSingoliPagamenti?.map((p) => ({
					importoTassa: Tassa.resolveNumber(p.importoTassa),
					descrizione: p.descrizione,
					importoPrevisto: Tassa.resolveNumber(p.importoPrevisto),
				})) ?? [];
			this.stato = data.stato;
		}
		return this;
	}
}

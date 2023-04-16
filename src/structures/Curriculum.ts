import type { APICurriculum, Client, Jsonify } from "..";
import { Base, EsitoAnno } from "..";

type CurriculumData = APICurriculum["data"]["curriculum"][number];
type Data = CurriculumData | Jsonify<Curriculum>;

/**
 * Rappresenta il curriculum dello studente
 */
export class Curriculum extends Base<CurriculumData> {
	id!: string;
	classe!: string;
	anno!: number;
	esito?: EsitoAnno;
	credito!: number;
	mostraInfo!: boolean;
	mostraCredito!: boolean;
	superiore!: boolean;
	interruzioneFR!: boolean;
	media!: number;
	CV!: boolean;
	ordine!: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) {
			this.handleJson(data);
			if (data.esito) this.esito = new EsitoAnno(data.esito, this.client);
		} else {
			this.anno = data.anno;
			this.classe = data.classe;
			this.credito = data.credito;
			this.CV = data.CVAbilitato;
			this.id = data.pkScheda;
			this.interruzioneFR = data.isInterruzioneFR;
			this.media = data.media;
			this.mostraCredito = data.mostraCredito;
			this.mostraInfo = data.mostraInfo;
			this.ordine = data.ordineScuola;
			this.superiore = data.isSuperiore;
			if (typeof data.esito === "object")
				this.esito = new EsitoAnno(data.esito, this.client);
		}
		return this;
	}
}

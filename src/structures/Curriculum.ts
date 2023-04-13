import { Base } from ".";
import type { APICurriculum, Jsonify } from "..";

type CurriculumData = APICurriculum["data"]["curriculum"][number];
type Data = CurriculumData | Jsonify<Curriculum>;

/**
 * Rappresenta il curriculum dello studente
 */
export class Curriculum extends Base<CurriculumData> {
	id!: string;
	classe!: string;
	anno!: number;
	esito?: {
		codScuola: string;
		colore: number;
		ammesso: boolean;
		descrizione: string;
		icona: string;
		codEsito: string;
		particolarità: string;
	};
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
	constructor(data: Data) {
		super();
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) super.patch(data);
		else {
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
				this.esito = {
					ammesso: data.esito.flgPositivo === "S",
					codEsito: data.esito.codEsito,
					codScuola: data.esito.esitoPK.codMin,
					colore: data.esito.numColore,
					descrizione: data.esito.descrizione,
					icona: data.esito.icona,
					particolarità: data.esito.particolarita,
				};
		}
	}
}

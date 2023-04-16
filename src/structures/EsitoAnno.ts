import type { APICurriculum, Client, Jsonify } from "..";
import { Base } from "..";

type EsitoAnnoData = Exclude<
	APICurriculum["data"]["curriculum"][number]["esito"],
	string
>;
type Data = EsitoAnnoData | Jsonify<EsitoAnno>;

/**
 * Rappresenta l'esito di un anno scolastico
 */
export class EsitoAnno extends Base<EsitoAnnoData> {
	codScuola!: string;
	colore!: number;
	ammesso!: boolean;
	descrizione!: string;
	icona!: string;
	codEsito!: string;
	particolarità!: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.ammesso = data.flgPositivo === "S";
			this.codEsito = data.codEsito;
			this.codScuola = data.esitoPK.codMin;
			this.colore = data.numColore;
			this.descrizione = data.descrizione;
			this.icona = data.icona;
			this.particolarità = data.particolarita;
		}
		return this;
	}
}

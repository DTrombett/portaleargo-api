import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type PromemoriaData = Extract<
	APIDashboard["data"]["dati"][0]["promemoria"][number],
	{ operazione: "I" }
>;
type Data = Jsonify<Promemoria> | PromemoriaData;

/**
 * Rappresenta un promemoria
 */
export class Promemoria extends Base<PromemoriaData> {
	data!: string;
	dettagli!: string;
	idDocente!: string;
	visibile!: boolean;
	oraInizio!: string;
	id!: string;
	oraFine!: string;

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
			this.data = data.datEvento;
			this.dettagli = data.desAnnotazioni;
			this.oraFine = data.oraFine;
			this.idDocente = data.pkDocente;
			this.oraInizio = data.oraInizio;
			this.visibile = data.flgVisibileFamiglia === "S";
			this.id = data.pk;
		}
		return this;
	}
}

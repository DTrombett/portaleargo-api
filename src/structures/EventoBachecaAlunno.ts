import type { APIBachecaAlunno, Client, Jsonify } from "..";
import { Base } from "..";

type EventoBachecaAlunnoData = Extract<
	APIBachecaAlunno["data"]["bachecaAlunno"][number],
	{ operazione: "I" }
>;
type Data = EventoBachecaAlunnoData | Jsonify<EventoBachecaAlunno>;

/**
 * Rappresenta un evento della bacheca alunno
 */
export class EventoBachecaAlunno extends Base<EventoBachecaAlunnoData> {
	nomeFile!: string;
	data!: string;
	dettagli!: string;
	downloadGenitore!: string;
	presaVisione!: boolean;
	id!: string;

	/**
	 * @param data - I dati ricevuti tramite l'API
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.id = data.pk;
			this.nomeFile = data.nomeFile;
			this.data = data.datEvento;
			this.dettagli = data.messaggio;
			this.downloadGenitore = data.flgDownloadGenitore;
			this.presaVisione = data.isPresaVisione;
		}
		return this;
	}
}

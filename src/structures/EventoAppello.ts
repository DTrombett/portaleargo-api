import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type EventoAppelloData = Extract<
	APIDashboard["data"]["dati"][0]["appello"][number],
	{
		operazione: "I";
	}
>;
type Data = EventoAppelloData | Jsonify<EventoAppello>;

/**
 * Rappresenta i dati di un evento dell'appello
 */
export class EventoAppello extends Base<EventoAppelloData> {
	data!: string;
	descrizione!: string;
	daGiustificare!: boolean;
	giustificata!: boolean;
	codiceEvento!: string;
	dettagliGiustificazione!: string;
	id!: string;
	dataGiustificazione!: string;
	nota!: string;

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
			this.data = data.datEvento;
			this.descrizione = data.descrizione;
			this.daGiustificare = data.daGiustificare;
			this.giustificata = data.giustificata === "S";
			this.codiceEvento = data.codEvento;
			this.dettagliGiustificazione = data.commentoGiustificazione;
			this.dataGiustificazione = data.dataGiustificazione;
			this.nota = data.nota;
			this.id = data.pk;
		}
		return this;
	}
}

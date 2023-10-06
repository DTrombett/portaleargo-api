import type { APIBacheca, Client, Jsonify } from "..";
import { Allegato, Base } from "..";

type EventoBachecaData = Extract<
	APIBacheca["data"]["bacheca"][number],
	{ operazione: "I" }
>;
type Data = EventoBachecaData | Jsonify<EventoBacheca>;

/**
 * Rappresenta un evento della bacheca
 */
export class EventoBacheca extends Base<EventoBachecaData> {
	data!: string;
	dettagli!: string;
	richiestaPresaVisione!: boolean;
	categoria!: string;
	dataPresaVisione!: string;
	url?: string;
	autore!: string;
	dataScadenza?: string;
	adRichiesta!: boolean;
	dataConfermaAdesione!: string;
	id!: string;
	allegati: Allegato[] = [];
	dataScadenzaAdesione?: string;

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
			this.data = data.datEvento;
			this.dettagli = data.messaggio;
			this.richiestaPresaVisione = data.pvRichiesta;
			this.categoria = data.categoria;
			this.dataPresaVisione = data.dataConfermaPresaVisione;
			if (data.url != null) this.url = data.url;
			this.autore = data.autore;
			if (data.dataScadenza != null) this.dataScadenza = data.dataScadenza;
			this.adRichiesta = data.adRichiesta;
			this.dataConfermaAdesione = data.dataConfermaAdesione;
			this.allegati = data.listaAllegati.map(
				(a) => new Allegato(a, this.client),
			);
			if (data.dataScadAdesione != null)
				this.dataScadenzaAdesione = data.dataScadAdesione;
		}
		return this;
	}
}

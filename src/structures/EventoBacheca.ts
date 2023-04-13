import type { APIBacheca, Jsonify } from "..";
import { Base } from "./Base";

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
	allegati: {
		nome: string;
		percorso: string;
		descrizione: string | null;
		id: string;
		url: string;
	}[] = [];
	dataScadenzaAdesione?: string;

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
			this.allegati = data.listaAllegati.map((b) => ({
				nome: b.nomeFile,
				percorso: b.path,
				descrizione: b.descrizioneFile,
				url: b.url,
				id: b.pk,
			}));
			if (data.dataScadAdesione != null)
				this.dataScadenzaAdesione = data.dataScadAdesione;
		}
	}
}

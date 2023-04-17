import type { APIBacheca, Client, Jsonify } from "..";
import { Base } from "./Base";

type AllegatoData = Extract<
	APIBacheca["data"]["bacheca"][number],
	{ operazione: "I" }
>["listaAllegati"][number];
type Data = AllegatoData | Jsonify<Allegato>;

/**
 * Rappresenta i dati di un allegato
 */
export class Allegato extends Base<AllegatoData> {
	nome!: string;
	percorso!: string;
	descrizione?: string;
	id!: string;
	url!: string;

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
			this.nome = data.nomeFile;
			this.percorso = data.path;
			if (data.descrizioneFile != null) this.descrizione = data.descrizioneFile;
			this.url = data.url;
			this.id = data.pk;
		}
		return this;
	}

	/**
	 * Scarica questo allegato.
	 * @param file - Il percorso dove salvare il file
	 */
	download(file: string) {
		return this.client.downloadAllegato(this.id, file);
	}

	/**
	 * Ottieni il link per scaricare questo allegato.
	 * @returns L'url
	 */
	getLink() {
		return this.client.getLinkAllegato(this.id);
	}
}

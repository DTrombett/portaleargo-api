import type { APIRicevutaTelematica, Client, Jsonify } from "..";
import { Base } from "..";

type RicevutaData = APIRicevutaTelematica;
type Data = Jsonify<Ricevuta> | RicevutaData;

/**
 * Rappresenta i dati di una ricevuta
 */
export class Ricevuta extends Base<RicevutaData> {
	nomeFile!: string;
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
			this.nomeFile = data.fileName;
			this.url = data.url;
		}
		return this;
	}
}

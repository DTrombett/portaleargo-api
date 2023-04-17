import type { APIDettagliProfilo, Client, Jsonify } from "..";
import { Alunno, Base, Genitore } from "..";

type DettagliProfiloData = APIDettagliProfilo["data"];
type Data = DettagliProfiloData | Jsonify<DettagliProfilo>;

/**
 * Rappresenta i dettagli del profilo dello studente
 */
export class DettagliProfilo extends Base<DettagliProfiloData> {
	flgUtente!: string;
	genitore!: Genitore;
	alunno!: Alunno;

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
			this.flgUtente = data.utente.flgUtente;
			this.genitore = new Genitore(data.genitore, this.client);
			this.alunno = new Alunno(data.alunno, this.client);
		}
		return this;
	}

	/**
	 * Aggiorna questi dati.
	 * @returns I dati aggiornati
	 */
	refresh() {
		return this.client.getDettagliProfilo(this);
	}
}

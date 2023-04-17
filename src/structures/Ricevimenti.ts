import type { APIRicevimenti, Client, Jsonify } from "..";
import { Base, Disponibilità, Prenotazione } from "..";

type RicevimentiData = APIRicevimenti["data"];
type Data = Jsonify<Ricevimenti> | RicevimentiData;

/**
 * Rappresenta i dati dei ricevimenti
 */
export class Ricevimenti extends Base<RicevimentiData> {
	disponibilità: Disponibilità[] = [];
	genitoreAlunno: {
		id: string;
		telefono: string;
	}[] = [];
	tipoAccesso!: string;
	prenotazioni: Prenotazione[] = [];

	/**
	 * @param data - I dati ricevuti tramite l'API
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) {
			this.handleJson(data);
			this.disponibilità = data.disponibilità.map(
				(a) => new Disponibilità(a, this.client)
			);
			this.prenotazioni = data.prenotazioni.map(
				(a) => new Prenotazione(a, this.client)
			);
		} else {
			this.tipoAccesso = data.tipoAccesso;
			this.genitoreAlunno = data.genitoreOAlunno.map((a) => ({
				id: a.pk,
				telefono: a.telefono,
			}));
			this.prenotazioni = data.prenotazioni.map(
				(a) => new Prenotazione(a, this.client)
			);
			for (const k in data.disponibilita)
				if (Object.hasOwn(data.disponibilita, k))
					for (const a of data.disponibilita[k])
						this.disponibilità.push(new Disponibilità(a, this.client, k));
		}
		return this;
	}

	/**
	 * Aggiorna questi dati.
	 * @returns I dati aggiornati
	 */
	refresh() {
		return this.client.getRicevimenti(this);
	}
}

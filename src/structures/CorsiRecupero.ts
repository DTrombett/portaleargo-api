import type { APICorsiRecupero, Client, Jsonify } from "..";
import { Base } from "..";

type CorsiRecuperoData = APICorsiRecupero["data"];
type Data = CorsiRecuperoData | Jsonify<CorsiRecupero>;

/**
 * Rappresenta i dati dei corsi recupero dello studente
 */
export class CorsiRecupero extends Base<CorsiRecuperoData> {
	corsiRecupero: any[] = [];
	periodi: any[] = [];
	id: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client, id: string) {
		super(client);
		this.id = id;
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.corsiRecupero = data.corsiRecupero;
			this.periodi = data.periodi;
		}
		return this;
	}

	/**
	 * Aggiorna questi dati.
	 * @returns The updated data
	 */
	refresh() {
		return this.client.getCorsiRecupero(this.id, this);
	}
}

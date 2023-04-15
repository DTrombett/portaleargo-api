import { Base } from ".";
import type { APICorsiRecupero, Jsonify } from "..";

type CorsiRecuperoData = APICorsiRecupero["data"];
type Data = CorsiRecuperoData | Jsonify<CorsiRecupero>;

/**
 * Rappresenta i dati dei corsi recupero dello studente
 */
export class CorsiRecupero extends Base<CorsiRecuperoData> {
	corsiRecupero: any[] = [];
	periodi: any[] = [];

	/**
	 * @param data - The API data
	 */
	constructor(data: Data) {
		super();
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.corsiRecupero = data.corsiRecupero;
			this.periodi = data.periodi;
		}
	}
}

import type { APIVotiScrutinio, Client, Jsonify } from "..";
import { Base } from "..";

type ScrutinioData =
	APIVotiScrutinio["data"]["votiScrutinio"][0]["periodi"][number];
type Data = Jsonify<Scrutinio> | ScrutinioData;

/**
 * Rappresenta uno scrutinio
 */
export class Scrutinio extends Base<ScrutinioData> {
	descrizione!: string;
	materie!: any[];
	suddivisione!: string;
	voti!: boolean;
	scrutinioFinale!: boolean;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.descrizione = data.desDescrizione;
			this.materie = data.materie;
			this.scrutinioFinale = data.scrutinioFinale;
			this.suddivisione = data.suddivisione;
			this.voti = data.votiGiudizi;
		}
		return this;
	}
}

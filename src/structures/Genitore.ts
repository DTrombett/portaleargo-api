import type { APIDettagliProfilo, Client, Jsonify } from "..";
import { Base } from "..";

type GenitoreData = APIDettagliProfilo["data"]["genitore"];
type Data = GenitoreData | Jsonify<Genitore>;

/**
 * Rappresenta i dati di un genitore
 */
export class Genitore extends Base<GenitoreData> {
	sesso!: string;
	cognome!: string;
	email!: string;
	cellulare?: string;
	telefono!: string;
	nome!: string;
	dataNascita!: string;

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
			this.sesso = data.flgSesso;
			this.dataNascita = data.datNascita;
			this.email = data.desEMail;
			if (data.desCellulare != null) this.cellulare = data.desCellulare;
			this.nome = data.desNome;
			this.cognome = data.desCognome;
			this.telefono = data.desTelefono;
		}
		return this;
	}
}

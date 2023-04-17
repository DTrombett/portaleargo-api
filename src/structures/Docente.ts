import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type DocenteData =
	APIDashboard["data"]["dati"][0]["listaDocentiClasse"][number];
type Data = DocenteData | Jsonify<Docente>;

/**
 * Rappresenta i dati di un docente
 */
export class Docente extends Base<DocenteData> {
	cognome!: string;
	materie!: string[];
	nome!: string;
	id!: string;
	email!: string;

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
			this.cognome = data.desCognome;
			this.materie = data.materie;
			this.nome = data.desNome;
			this.email = data.desEmail;
			this.id = data.pk;
		}
		return this;
	}
}

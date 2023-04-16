import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type FuoriClasseData = Extract<
	APIDashboard["data"]["dati"][0]["fuoriClasse"][number],
	{
		operazione: "I";
	}
>;
type Data = FuoriClasseData | Jsonify<FuoriClasse>;

/**
 * Rappresenta i dati di un evento fuori classe dello studente
 */
export class FuoriClasse extends Base<FuoriClasseData> {
	data!: string;
	descrizione!: string;
	docente!: string;
	id!: string;
	note!: string;
	frequenzaOnline!: boolean;

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
			this.data = data.datEvento;
			this.descrizione = data.descrizione;
			this.docente = data.docente;
			this.note = data.nota;
			this.frequenzaOnline = data.frequenzaOnLine;
			this.id = data.pk;
		}
		return this;
	}
}

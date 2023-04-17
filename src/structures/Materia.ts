import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type MateriaData = APIDashboard["data"]["dati"][0]["listaMaterie"][number];
type Data = Jsonify<Materia> | MateriaData;

/**
 * Rappresenta i dati di una materia
 */
export class Materia extends Base<MateriaData> {
	nomeBreve!: string;
	scrutinio!: boolean;
	codice!: string;
	faMedia!: false;
	nome!: string;
	id!: string;

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
			this.codice = data.codTipo;
			this.faMedia = data.faMedia;
			this.nome = data.materia;
			this.scrutinio = data.scrut;
			this.nomeBreve = data.abbreviazione;
			this.id = data.pk;
		}
		return this;
	}
}

import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type MediaMateriaData = APIDashboard["data"]["dati"][0]["mediaMaterie"][string];
type Data = Jsonify<MediaMateria> | MediaMateriaData;

/**
 * Rappresenta la media scolastica di una materia
 */
export class MediaMateria extends Base<MediaMateriaData> {
	sommaVotiOrali!: number;
	votiOrali!: number;
	votiScritti!: number;
	sommaVotiScritti!: number;
	idMateria: string;

	/**
	 * @param data - I dati ricevuti tramite l'API
	 */
	constructor(data: Jsonify<MediaMateria>, client: Client);
	constructor(data: MediaMateriaData, client: Client, idMateria: string);
	constructor(data: Data, client: Client, idMateria?: string) {
		super(client);
		this.idMateria = idMateria!;
		this.patch(data);
	}

	get mediaOrale() {
		return this.sommaVotiOrali / this.votiOrali;
	}

	get mediaScritto() {
		return this.sommaVotiScritti / this.votiScritti;
	}

	get sommaVoti() {
		return this.sommaVotiScritti + this.sommaVotiOrali;
	}

	get voti() {
		return this.votiOrali + this.votiScritti;
	}

	get media() {
		return this.sommaVoti / this.voti;
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.sommaVotiOrali = data.sommaValutazioniOrale;
			this.votiOrali = data.numValutazioniOrale;
			this.votiScritti = data.sommaValutazioniScritto;
			this.sommaVotiScritti = data.sommaValutazioniScritto;
		}
		return this;
	}
}

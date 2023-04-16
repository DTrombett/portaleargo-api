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
	 * @param data - The API data
	 */
	constructor(data: Jsonify<MediaMateria>, client: Client);
	constructor(data: MediaMateriaData, client: Client, idMateria: string);
	constructor(data: Data, client: Client, idMateria?: string) {
		super(client);
		this.idMateria = idMateria!;
		this.patch(data);
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

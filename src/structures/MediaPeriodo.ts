import type { APIDashboard, Client, Jsonify } from "..";
import { Base, MediaMateria } from "..";

type MediaPeriodoData =
	APIDashboard["data"]["dati"][0]["mediaPerPeriodo"][string];
type Data = Jsonify<MediaPeriodo> | MediaPeriodoData;

/**
 * Rappresenta la media scolastica di un periodo
 */
export class MediaPeriodo extends Base<MediaPeriodoData> {
	media!: number;
	materie: MediaMateria[] = [];
	mediaMensile!: Record<`${number}`, number>;

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
			this.media = data.mediaGenerale;
			this.mediaMensile = data.mediaMese;
			for (const k in data.listaMaterie)
				if (Object.hasOwn(data.listaMaterie, k))
					this.materie.push(
						new MediaMateria(data.listaMaterie[k], this.client, k),
					);
		}
		return this;
	}
}

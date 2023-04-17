import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type PeriodoData = APIDashboard["data"]["dati"][0]["listaPeriodi"][number];
type Data = Jsonify<Periodo> | PeriodoData;

/**
 * Rappresenta i dati di un periodo scolastico
 */
export class Periodo extends Base<PeriodoData> {
	id!: string;
	dataInizio!: string;
	descrizione!: string;
	votoUnico!: boolean;
	mediaScrutinio!: number;
	haMediaScrutinio!: boolean;
	dataFine!: string;
	codicePeriodo!: string;
	scrutinioFinale!: boolean;

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
			this.descrizione = data.descrizione;
			this.dataFine = data.datFine;
			this.mediaScrutinio = data.mediaScrutinio;
			this.haMediaScrutinio = data.isMediaScrutinio;
			this.scrutinioFinale = data.isScrutinioFinale;
			this.codicePeriodo = data.codPeriodo;
			this.votoUnico = data.votoUnico;
			this.dataInizio = data.datInizio;
			this.id = data.pkPeriodo;
		}
		return this;
	}
}

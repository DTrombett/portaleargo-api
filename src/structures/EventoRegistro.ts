import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type EventoRegistroData = Extract<
	APIDashboard["data"]["dati"][0]["registro"][number],
	{
		operazione: "I";
	}
>;
type Data = EventoRegistroData | Jsonify<EventoRegistro>;

/**
 * Rappresenta i dati di un evento nel registro
 */
export class EventoRegistro extends Base<EventoRegistroData> {
	data!: string;
	url!: string;
	idDocente!: string;
	compiti!: {
		dettagli: string;
		scadenza: string;
	}[];
	id!: string;
	idMateria!: string;
	attività!: string;
	ora!: number;

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
			this.data = data.datEvento;
			this.url = data.desUrl;
			this.idDocente = data.pkDocente;
			this.compiti = data.compiti.map((b) => ({
				dettagli: b.compito,
				scadenza: b.dataConsegna,
			}));
			this.idMateria = data.pkMateria;
			this.attività = data.attivita;
			this.ora = data.ora;
			this.id = data.pk;
		}
		return this;
	}
}

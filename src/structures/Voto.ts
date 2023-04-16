import type { APIDashboard, Client, Jsonify } from "..";
import { Base, DettagliMateria } from "..";

type VotoData = Extract<
	APIDashboard["data"]["dati"][0]["voti"][number],
	{ operazione: "I" }
>;
type Data = Jsonify<Voto> | VotoData;

/**
 * Rappresenta i dati di un voto
 */
export class Voto extends Base<VotoData> {
	data!: string;
	idPeriodo!: string;
	valore!: number;
	voto!: string;
	pratico!: boolean;
	idMateria!: string;
	tipoValutazione!: null;
	prg!: number;
	descrizioneProva!: string;
	faMenoMedia!: string;
	idDocente!: string;
	descrizione!: string;
	tipo!: string;
	conteggioMedia!: number;
	id!: string;
	dettagliMateria!: DettagliMateria;
	commento!: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) {
			this.handleJson(data);
			this.dettagliMateria = new DettagliMateria(
				data.dettagliMateria,
				this.client
			);
		} else {
			this.data = data.datEvento;
			this.idPeriodo = data.pkPeriodo;
			this.voto = data.codCodice;
			this.valore = data.valore;
			this.pratico = data.codVotoPratico === "S";
			this.idMateria = data.pkMateria;
			this.tipoValutazione = data.tipoValutazione;
			this.prg = data.prgVoto;
			this.descrizioneProva = data.descrizioneProva;
			this.faMenoMedia = data.faMenoMedia;
			this.idDocente = data.pkDocente;
			this.descrizione = data.descrizioneVoto;
			this.tipo = data.codTipo;
			this.conteggioMedia = data.numMedia;
			this.dettagliMateria = new DettagliMateria(
				data.materiaLight,
				this.client
			);
			this.commento = data.desCommento;
			this.id = data.pk;
		}
		return this;
	}
}

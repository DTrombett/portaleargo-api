import type { APIDashboard, Client, Jsonify } from "..";
import { Base } from "..";

type DettagliMateriaData = Extract<
	APIDashboard["data"]["dati"][0]["voti"][number],
	{ operazione: "I" }
>["materiaLight"];
type Data = DettagliMateriaData | Jsonify<DettagliMateria>;

/**
 * Rappresenta i dettagli di una materia
 */
export class DettagliMateria extends Base<DettagliMateriaData> {
	scuola!: {
		prg: number;
		anno: number;
		prgMateria: number;
	};
	codice!: string;
	nome!: string;
	nomeBreve!: string;
	codiceSezione!: string;
	codiceTipo!: string;
	faMedia!: boolean;
	codiceAggregato!: string;
	lezioniIndividuali!: null;
	codiceInvalsi!: null;
	codiceMinisteriale!: null;
	icona!: string;
	descrizione!: string | null;
	haInsufficienze!: boolean;
	selezionata!: boolean;
	prg!: number;
	categoria!: string;
	tipo!: string;
	id!: string;

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
			this.scuola = {
				prg: data.scuMateriaPK.prgScuola,
				prgMateria: data.scuMateriaPK.prgMateria,
				anno: data.scuMateriaPK.numAnno,
			};
			this.codice = data.codMateria;
			this.nome = data.desDescrizione;
			this.nomeBreve = data.desDescrAbbrev;
			this.codiceSezione = data.codSuddivisione;
			this.codiceTipo = data.codTipo;
			this.faMedia = data.flgConcorreMedia === "S";
			this.codiceAggregato = data.codAggrDisciplina;
			this.lezioniIndividuali = data.flgLezioniIndividuali;
			this.codiceInvalsi = data.codAggrInvalsi;
			this.codiceMinisteriale = data.codMinisteriale;
			this.icona = data.icona;
			this.descrizione = data.descrizione;
			this.haInsufficienze = data.conInsufficienze;
			this.selezionata = data.selezionata;
			this.prg = data.prgMateria;
			this.categoria = data.tipo;
			this.tipo = data.articolata;
			this.id = data.idmateria;
		}
		return this;
	}
}

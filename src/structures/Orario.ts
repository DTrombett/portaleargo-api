import type { APIOrarioGiornaliero, Jsonify } from "..";
import { Base } from "..";

type OrarioData = APIOrarioGiornaliero["data"]["dati"][`${number}`][number];
type Data = Jsonify<Orario> | OrarioData;

/**
 * Rappresenta l'orario dello studente
 */
export class Orario extends Base<OrarioData> {
	numOra!: number;
	mostra!: boolean;
	cognome!: string;
	nome!: string;
	docente!: string;
	materia!: string;
	id?: string;
	idAnagrafe?: string;
	denominazioneOra!: string;
	email!: string;
	sezione!: string;
	ora!: null;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data) {
		super();
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.numOra = data.numOra;
			this.mostra = data.mostra;
			this.cognome = data.desCognome;
			this.nome = data.desNome;
			this.docente = data.docente;
			this.materia = data.materia;
			if (data.pk != null) this.id = data.pk;
			if (data.scuAnagrafePK != null) this.idAnagrafe = data.scuAnagrafePK;
			this.denominazioneOra = data.desDenominazione;
			this.email = data.desEmail;
			this.sezione = data.desSezione;
			this.ora = data.ora;
		}
	}
}

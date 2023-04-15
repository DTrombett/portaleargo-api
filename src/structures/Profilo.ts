import type { APIProfilo, Jsonify } from "..";
import { Base } from "..";

type ProfiloData = APIProfilo["data"];
type Data = Jsonify<Profilo> | ProfiloData;

/**
 * Rappresenta il profilo dello studente
 */
export class Profilo extends Base<ProfiloData> {
	ultimoCambioPassword!: null;
	anno!: {
		dataInizio: string;
		dataFine: string;
	};
	genitore!: {
		email: string;
		nomeCompleto: string;
		id: string;
	};
	alunno!: {
		ultimoAnno: boolean;
		cognome: string;
		nome: string;
		id: string;
		maggiorenne: boolean;
		email: string | null;
	};
	classe!: {
		id: string;
		classe: number;
		sezione: string;
	};
	corso!: {
		descrizione: string;
		id: string;
	};
	plesso!: {
		descrizione: string;
		id: string;
	};
	scuola!: {
		ordine: string;
		descrizione: string;
		id: string;
	};
	id!: string;
	profiloStorico!: boolean;

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
			this.ultimoCambioPassword = data.ultimoCambioPwd;
			this.anno = {
				dataInizio: data.anno.dataInizio,
				dataFine: data.anno.dataFine,
			};
			this.genitore = {
				email: data.genitore.desEMail,
				nomeCompleto: data.genitore.nominativo,
				id: data.genitore.pk,
			};
			this.alunno = {
				ultimoAnno: data.alunno.isUltimaClasse,
				cognome: data.alunno.cognome,
				nome: data.alunno.nome,
				id: data.alunno.pk,
				maggiorenne: data.alunno.maggiorenne,
				email: data.alunno.desEmail,
			};
			this.classe = {
				id: data.scheda.classe.pk,
				classe: Number(data.scheda.classe.desDenominazione),
				sezione: data.scheda.classe.desSezione,
			};
			this.corso = {
				descrizione: data.scheda.corso.descrizione,
				id: data.scheda.corso.pk,
			};
			this.plesso = {
				descrizione: data.scheda.sede.descrizione,
				id: data.scheda.sede.pk,
			};
			this.scuola = {
				ordine: data.scheda.scuola.desOrdine,
				descrizione: data.scheda.scuola.descrizione,
				id: data.scheda.scuola.pk,
			};
			this.id = data.scheda.pk;
			this.profiloStorico = data.profiloStorico;
		}
	}
}

import type { APIWhat, Jsonify } from "..";
import { Base } from "..";

type WhatData = APIWhat["data"]["dati"][0];
type Data = Jsonify<What> | WhatData;

/**
 * The what data
 */
export class What extends Base<WhatData> {
	aggiornato!: boolean;
	differenzaSchede!: boolean;
	forzaLogin!: boolean;
	idAggiornamentoScheda!: boolean;
	profiloModificato!: boolean;
	profilo!: {
		anno: {
			dataInizio: string;
			dataFine: string;
		};
		alunno: {
			ultimoAnno: boolean;
			cognome: string;
			nome: string;
			id: string;
			maggiorenne: boolean;
			email: string | null;
		};
		classe: {
			id: string;
			classe: number;
			sezione: string;
		};
		corso: {
			descrizione: string;
			id: string;
		};
		plesso: {
			descrizione: string;
			id: string;
		};
		scuola: {
			ordine: string;
			descrizione: string;
			id: string;
		};
		id: string;
		profiloStorico: boolean;
	};

	/**
	 * @param data - The API data
	 */
	constructor(data: Data) {
		super();
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) super.patch(data);
		else {
			this.aggiornato = data.mostraPallino;
			this.differenzaSchede = data.differenzaSchede;
			this.forzaLogin = data.forceLogin;
			this.idAggiornamentoScheda = data.scheda.aggiornaSchedaPK;
			this.profiloModificato = data.isModificato;
			this.profilo = {
				anno: {
					dataInizio: data.scheda.dataInizio,
					dataFine: data.scheda.dataFine,
				},
				alunno: {
					ultimoAnno: data.alunno.isUltimaClasse,
					cognome: data.alunno.cognome,
					nome: data.alunno.nome,
					id: data.alunno.pk,
					maggiorenne: data.alunno.maggiorenne,
					email: data.alunno.desEmail,
				},
				classe: {
					id: data.scheda.classe.pk,
					classe: Number(data.scheda.classe.desDenominazione),
					sezione: data.scheda.classe.desSezione,
				},
				corso: {
					descrizione: data.scheda.corso.descrizione,
					id: data.scheda.corso.pk,
				},
				plesso: {
					descrizione: data.scheda.sede.descrizione,
					id: data.scheda.sede.pk,
				},
				scuola: {
					ordine: data.scheda.scuola.desOrdine,
					descrizione: data.scheda.scuola.descrizione,
					id: data.scheda.scuola.pk,
				},
				id: data.scheda.pk,
				profiloStorico: data.profiloStorico,
			};
		}
	}
}

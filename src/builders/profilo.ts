import type { APIProfilo, Profilo } from "../types";

/**
 * Elabora i dati del profilo.
 * @param body - The API response
 * @returns The new data
 */
export const buildProfilo = (body: APIProfilo): Profilo => {
	const { data } = body;

	return {
		ultimoCambioPassword: data.ultimoCambioPwd,
		anno: {
			dataInizio: data.anno.dataInizio,
			dataFine: data.anno.dataFine,
		},
		genitore: {
			email: data.genitore.desEMail,
			nomeCompleto: data.genitore.nominativo,
			id: data.genitore.pk,
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
};

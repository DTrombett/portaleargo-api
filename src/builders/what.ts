import type { APIWhat, What } from "../types";

/**
 * Build the what data.
 * @param body - The API response
 * @returns The new data
 */
export const buildWhat = (body: APIWhat): What => {
	const {
		data: {
			dati: [data],
		},
	} = body;

	return {
		aggiornato: data.mostraPallino,
		differenzaSchede: data.differenzaSchede,
		forzaLogin: data.forceLogin,
		idAggiornamentoScheda: data.scheda.aggiornaSchedaPK,
		profiloModificato: data.isModificato,
		profilo: {
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
		},
	};
};

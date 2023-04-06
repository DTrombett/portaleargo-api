import type { APIDashboard, Dashboard } from "../types";
import { arrayToObject, handleOperation } from "../util";

/**
 * Build the dashboard data.
 * @param body - The API response
 * @returns The new data
 */
export const buildDashboard = (body: APIDashboard, old?: Dashboard) => {
	const [data] = body.data.dati;
	const dashboard: Dashboard = {
		dataAggiornamento: Date.now(),
		fuoriClasse: old?.fuoriClasse ?? {},
		msg: data.msg,
		opzioni: Object.fromEntries(data.opzioni.map((d) => [d.chiave, d.valore])),
		mediaGenerale: data.mediaGenerale,
		mensa: data.mensa,
		mediaMensile: data.mediaPerMese,
		materie: arrayToObject(data.listaMaterie, (d) => ({
			codice: d.codTipo,
			faMedia: d.faMedia,
			nome: d.materia,
			scrutinio: d.scrut,
			nomeBreve: d.abbreviazione,
		})),
		rimuoviDatiLocali: data.rimuoviDatiLocali,
		periodi: arrayToObject(
			data.listaPeriodi,
			(d) => ({
				descrizione: d.descrizione,
				dataFine: d.datFine,
				mediaScrutinio: d.mediaScrutinio,
				haMediaScrutinio: d.isMediaScrutinio,
				scrutinioFinale: d.isScrutinioFinale,
				codicePeriodo: d.codPeriodo,
				votoUnico: d.votoUnico,
				dataInizio: d.datInizio,
			}),
			"pkPeriodo"
		),
		promemoria: old?.promemoria ?? {},
		bacheca: old?.bacheca ?? {},
		fileCondivisi: data.fileCondivisi,
		voti: old?.voti ?? {},
		nuoviDati: data.ricaricaDati,
		docenti: arrayToObject(data.listaDocentiClasse, (a) => ({
			cognome: a.desCognome,
			materie: a.materie,
			nome: a.desNome,
			email: a.desEmail,
		})),
		bachecaAlunno: old?.bachecaAlunno ?? {},
		profiloDisabilitato: data.profiloDisabilitato,
		mediaPeriodo: {},
		mediaMaterie: {},
		autoCertificazione: data.autocertificazione,
		registro: old?.registro ?? {},
		schede: data.schede,
		prenotazioniAlunni: data.prenotazioniAlunni,
		note: data.noteDisciplinari,
		id: data.pk,
		classiExtra: data.classiExtra,
		appello: old?.appello ?? {},
	};

	for (const key in data.mediaMaterie)
		if (Object.hasOwn(data.mediaMaterie, key))
			dashboard.mediaMaterie[key] = {
				sommaVotiOrali: data.mediaMaterie[key].sommaValutazioniOrale,
				votiOrali: data.mediaMaterie[key].numValutazioniOrale,
				conteggioMedia: data.mediaMaterie[key].numValori,
				votiScritti: data.mediaMaterie[key].numValutazioniScritto,
				sommaVotiScritti: data.mediaMaterie[key].sommaValutazioniScritto,
			};
	for (const key in data.mediaPerPeriodo)
		if (Object.hasOwn(data.mediaPerPeriodo, key)) {
			const { listaMaterie } = data.mediaPerPeriodo[key];

			dashboard.mediaPeriodo[key] = {
				media: data.mediaPerPeriodo[key].mediaGenerale,
				mediaMensile: data.mediaPerPeriodo[key].mediaMese,
				materie: {},
			};
			for (const k in listaMaterie)
				if (Object.hasOwn(listaMaterie, k))
					dashboard.mediaPeriodo[key].materie[k] = {
						sommaVotiOrali: listaMaterie[k].sommaValutazioniOrale,
						votiOrali: listaMaterie[k].numValutazioniOrale,
						conteggioMedia: listaMaterie[k].numValori,
						votiScritti: listaMaterie[k].numValutazioniScritto,
						sommaVotiScritti: listaMaterie[k].sommaValutazioniScritto,
					};
		}
	handleOperation(data.appello, dashboard.appello, (a) => ({
		data: a.datEvento,
		descrizione: a.descrizione,
		daGiustificare: a.daGiustificare,
		giustificata: a.giustificata === "S",
		codiceEvento: a.codEvento,
		dettagliGiustificazione: a.commentoGiustificazione,
		dataGiustificazione: a.dataGiustificazione,
		nota: a.nota,
	}));
	handleOperation(data.fuoriClasse, dashboard.fuoriClasse, (a) => ({
		data: a.datEvento,
		descrizione: a.descrizione,
		docente: a.docente,
		note: a.nota,
		frequenzaOnline: a.frequenzaOnLine,
	}));
	handleOperation(data.promemoria, dashboard.promemoria, (a) => ({
		data: a.datEvento,
		dettagli: a.desAnnotazioni,
		oraFine: a.oraFine,
		idDocente: a.pkDocente,
		oraInizio: a.oraInizio,
		visibile: a.flgVisibileFamiglia === "S",
	}));
	handleOperation(data.registro, dashboard.registro, (a) => ({
		data: a.datEvento,
		url: a.desUrl,
		idDocente: a.pkDocente,
		compiti: a.compiti.map((b) => ({
			dettagli: b.compito,
			scadenza: b.dataConsegna,
		})),
		idMateria: a.pkMateria,
		attività: a.attivita,
		ora: a.ora,
	}));
	handleOperation(data.bachecaAlunno, dashboard.bachecaAlunno, (a) => ({
		nomeFile: a.nomeFile,
		data: a.datEvento,
		dettagli: a.messaggio,
		downloadGenitore: a.flgDownloadGenitore,
		presaVisione: a.isPresaVisione,
	}));
	handleOperation(data.voti, dashboard.voti, (a) => ({
		data: a.datEvento,
		idPeriodo: a.pkPeriodo,
		voto: a.codCodice,
		valore: a.valore,
		pratico: a.codVotoPratico === "S",
		idMateria: a.pkMateria,
		tipoValutazione: a.tipoValutazione,
		prg: a.prgVoto,
		descrizioneProva: a.descrizioneProva,
		faMenoMedia: a.faMenoMedia,
		idDocente: a.pkDocente,
		descrizione: a.descrizioneVoto,
		tipo: a.codTipo,
		conteggioMedia: a.numMedia,
		dettagliMateria: {
			scuola: {
				prg: a.materiaLight.scuMateriaPK.prgScuola,
				prgMateria: a.materiaLight.scuMateriaPK.prgMateria,
				anno: a.materiaLight.scuMateriaPK.numAnno,
			},
			codice: a.materiaLight.codMateria,
			nome: a.materiaLight.desDescrizione,
			nomeBreve: a.materiaLight.desDescrAbbrev,
			codiceSezione: a.materiaLight.codSuddivisione,
			codiceTipo: a.materiaLight.codTipo,
			faMedia: a.materiaLight.flgConcorreMedia === "S",
			codiceAggregato: a.materiaLight.codAggrDisciplina,
			lezioniIndividuali: a.materiaLight.flgLezioniIndividuali,
			codiceInvalsi: a.materiaLight.codAggrInvalsi,
			codiceMinisteriale: a.materiaLight.codMinisteriale,
			icona: a.materiaLight.icona,
			descrizione: a.materiaLight.descrizione,
			haInsufficienze: a.materiaLight.conInsufficienze,
			selezionata: a.materiaLight.selezionata,
			prg: a.materiaLight.prgMateria,
			categoria: a.materiaLight.tipo,
			tipo: a.materiaLight.articolata,
			idMateria: a.materiaLight.idmateria,
		},
		commento: a.desCommento,
	}));
	handleOperation(data.bacheca, dashboard.bacheca, (a) => ({
		data: a.datEvento,
		dettagli: a.messaggio,
		richiestaPresaVisione: a.pvRichiesta,
		categoria: a.categoria,
		dataPresaVisione: a.dataConfermaPresaVisione,
		url: a.url,
		autore: a.autore,
		dataScadenza: a.dataScadenza,
		adRichiesta: a.adRichiesta,
		dataConfermaAdesione: a.dataConfermaAdesione,
		allegati: arrayToObject(a.listaAllegati, (b) => ({
			nome: b.nomeFile,
			percorso: b.path,
			descrizione: b.descrizioneFile,
			url: b.url,
		})),
		dataScadenzaAdesione: a.dataScadAdesione,
	}));
	return dashboard;
};

import type { APIDashboard, Dashboard } from "../types";
import { handleOperation } from "../util";

/**
 * Build the dashboard data.
 * @param body - The API response
 * @returns The new data
 */
export const buildDashboard = (body: APIDashboard, old?: Dashboard) => {
	const [data] = body.data.dati;
	const dashboard: Dashboard = {
		dataAggiornamento: Date.now(),
		fuoriClasse: handleOperation(data.fuoriClasse, old?.fuoriClasse, (a) => ({
			data: a.datEvento,
			descrizione: a.descrizione,
			docente: a.docente,
			note: a.nota,
			frequenzaOnline: a.frequenzaOnLine,
		})),
		msg: data.msg,
		opzioni: Object.fromEntries(data.opzioni.map((d) => [d.chiave, d.valore])),
		mediaGenerale: data.mediaGenerale,
		mensa: data.mensa,
		mediaMensile: Object.values(data.mediaPerMese),
		materie: data.listaMaterie.map((a) => ({
			codice: a.codTipo,
			faMedia: a.faMedia,
			nome: a.materia,
			scrutinio: a.scrut,
			nomeBreve: a.abbreviazione,
			id: a.pk,
		})),
		rimuoviDatiLocali: data.rimuoviDatiLocali,
		periodi: data.listaPeriodi.map((a) => ({
			descrizione: a.descrizione,
			dataFine: a.datFine,
			mediaScrutinio: a.mediaScrutinio,
			haMediaScrutinio: a.isMediaScrutinio,
			scrutinioFinale: a.isScrutinioFinale,
			codicePeriodo: a.codPeriodo,
			votoUnico: a.votoUnico,
			dataInizio: a.datInizio,
			id: a.pkPeriodo,
		})),
		promemoria: handleOperation(data.promemoria, old?.promemoria, (a) => ({
			data: a.datEvento,
			dettagli: a.desAnnotazioni,
			oraFine: a.oraFine,
			idDocente: a.pkDocente,
			oraInizio: a.oraInizio,
			visibile: a.flgVisibileFamiglia === "S",
		})),
		bacheca: handleOperation(data.bacheca, old?.bacheca, (a) => ({
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
			allegati: a.listaAllegati.map((b) => ({
				nome: b.nomeFile,
				percorso: b.path,
				descrizione: b.descrizioneFile,
				url: b.url,
				id: b.pk,
			})),
			dataScadenzaAdesione: a.dataScadAdesione,
		})),
		fileCondivisi: data.fileCondivisi,
		voti: handleOperation(data.voti, old?.voti, (a) => ({
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
		})),
		nuoviDati: data.ricaricaDati,
		docenti: data.listaDocentiClasse.map((a) => ({
			cognome: a.desCognome,
			materie: a.materie,
			nome: a.desNome,
			email: a.desEmail,
			id: a.pk,
		})),
		bachecaAlunno: handleOperation(
			data.bachecaAlunno,
			old?.bachecaAlunno,
			(a) => ({
				nomeFile: a.nomeFile,
				data: a.datEvento,
				dettagli: a.messaggio,
				downloadGenitore: a.flgDownloadGenitore,
				presaVisione: a.isPresaVisione,
			})
		),
		profiloDisabilitato: data.profiloDisabilitato,
		mediaPeriodo: {},
		mediaMaterie: [],
		autoCertificazione: data.autocertificazione,
		registro: handleOperation(data.registro, old?.registro, (a) => ({
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
		})),
		schede: data.schede,
		prenotazioniAlunni: data.prenotazioniAlunni,
		note: data.noteDisciplinari,
		classiExtra: data.classiExtra,
		appello: handleOperation(data.appello, old?.appello, (a) => ({
			data: a.datEvento,
			descrizione: a.descrizione,
			daGiustificare: a.daGiustificare,
			giustificata: a.giustificata === "S",
			codiceEvento: a.codEvento,
			dettagliGiustificazione: a.commentoGiustificazione,
			dataGiustificazione: a.dataGiustificazione,
			nota: a.nota,
		})),
	};

	for (const idMateria in data.mediaMaterie)
		if (Object.hasOwn(data.mediaMaterie, idMateria))
			dashboard.mediaMaterie.push({
				sommaVotiOrali: data.mediaMaterie[idMateria].sommaValutazioniOrale,
				votiOrali: data.mediaMaterie[idMateria].numValutazioniOrale,
				conteggioMedia: data.mediaMaterie[idMateria].numValori,
				votiScritti: data.mediaMaterie[idMateria].numValutazioniScritto,
				sommaVotiScritti: data.mediaMaterie[idMateria].sommaValutazioniScritto,
				idMateria,
			});
	for (const key in data.mediaPerPeriodo)
		if (Object.hasOwn(data.mediaPerPeriodo, key)) {
			const { listaMaterie } = data.mediaPerPeriodo[key];

			dashboard.mediaPeriodo[key] = {
				media: data.mediaPerPeriodo[key].mediaGenerale,
				mediaMensile: data.mediaPerPeriodo[key].mediaMese,
				materie: [],
			};
			for (const idMateria in listaMaterie)
				if (Object.hasOwn(listaMaterie, idMateria))
					dashboard.mediaPeriodo[key].materie.push({
						sommaVotiOrali: listaMaterie[idMateria].sommaValutazioniOrale,
						votiOrali: listaMaterie[idMateria].numValutazioniOrale,
						conteggioMedia: listaMaterie[idMateria].numValori,
						votiScritti: listaMaterie[idMateria].numValutazioniScritto,
						sommaVotiScritti: listaMaterie[idMateria].sommaValutazioniScritto,
						idMateria,
					});
		}
	return dashboard;
};

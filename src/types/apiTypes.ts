import type { Json } from ".";

export type APIResponse<T = Json> = {
	success: boolean;
	msg?: string | null;
	data: T;
};
export type APIOperation<T> = {
	pk: string;
} & (
	| {
			operazione: "D";
	  }
	| (T & {
			operazione: "I";
	  })
);
export type APIToken = {
	access_token: string;
	expires_in: number;
	id_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
};
export type APILogin = APIResponse<
	[
		{
			codMin: string;
			opzioni: {
				valore: boolean;
				chiave: string;
			}[];
			isPrimoAccesso: boolean;
			profiloDisabilitato: boolean;
			isResetPassword: boolean;
			isSpid: boolean;
			token: string;
			username: string;
		}
	]
>;
export type APIProfilo = APIResponse<{
	resetPassword: boolean;
	ultimoCambioPwd: null;
	anno: {
		dataInizio: string;
		anno: string;
		dataFine: string;
	};
	genitore: {
		desEMail: string;
		nominativo: string;
		pk: string;
	};
	profiloDisabilitato: boolean;
	isSpid: boolean;
	alunno: {
		isUltimaClasse: boolean;
		nominativo: string;
		cognome: string;
		nome: string;
		pk: string;
		maggiorenne: boolean;
		desEmail: string | null;
	};
	scheda: {
		classe: {
			pk: string;
			desDenominazione: string;
			desSezione: string;
		};
		corso: {
			descrizione: string;
			pk: string;
		};
		sede: {
			descrizione: string;
			pk: string;
		};
		scuola: {
			desOrdine: string;
			descrizione: string;
			pk: string;
		};
		pk: string;
	};
	primoAccesso: boolean;
	profiloStorico: boolean;
}>;
export type APIDashboard = APIResponse<{
	dati: [
		{
			fuoriClasse: APIOperation<{
				datEvento: string;
				descrizione: string;
				data: string;
				docente: string;
				nota: string;
				frequenzaOnLine: boolean;
			}>[];
			msg: string;
			opzioni: {
				valore: boolean;
				chiave: string;
			}[];
			mediaGenerale: number;
			mensa: any;
			mediaPerMese: Record<`${number}`, number>;
			listaMaterie: {
				abbreviazione: string;
				scrut: boolean;
				codTipo: string;
				faMedia: false;
				materia: string;
				pk: string;
			}[];
			rimuoviDatiLocali: boolean;
			listaPeriodi: {
				pkPeriodo: string;
				dataInizio: string;
				descrizione: string;
				datInizio: string;
				votoUnico: boolean;
				mediaScrutinio: number;
				isMediaScrutinio: boolean;
				dataFine: string;
				datFine: string;
				codPeriodo: string;
				isScrutinioFinale: boolean;
			}[];
			promemoria: APIOperation<{
				datEvento: string;
				desAnnotazioni: string;
				pkDocente: string;
				flgVisibileFamiglia: string;
				datGiorno: string;
				docente: string;
				oraInizio: string;
				oraFine: string;
			}>[];
			bacheca: APIOperation<{
				datEvento: string;
				messaggio: string;
				data: string;
				pvRichiesta: boolean;
				categoria: string;
				dataConfermaPresaVisione: string;
				url: string | null;
				autore: string;
				dataScadenza: string | null;
				adRichiesta: boolean;
				isPresaVisione: boolean;
				dataConfermaAdesione: string;
				listaAllegati: {
					nomeFile: string;
					path: string;
					descrizioneFile: string | null;
					pk: string;
					url: string;
				}[];
				dataScadAdesione: string | null;
				isPresaAdesioneConfermata: boolean;
			}>[];
			fileCondivisi: {
				fileAlunniScollegati: [];
				listaFile: [];
			};
			voti: APIOperation<{
				datEvento: string;
				pkPeriodo: string;
				codCodice: string;
				valore: number;
				codVotoPratico: string;
				docente: string;
				pkMateria: string;
				tipoValutazione: null;
				prgVoto: number;
				descrizioneProva: string;
				faMenoMedia: string;
				pkDocente: string;
				descrizioneVoto: string;
				codTipo: string;
				datGiorno: string;
				mese: number;
				numMedia: number;
				desMateria: string;
				materiaLight: {
					scuMateriaPK: {
						codMin: string;
						prgScuola: number;
						numAnno: number;
						prgMateria: number;
					};
					codMateria: string;
					desDescrizione: string;
					desDescrAbbrev: string;
					codSuddivisione: string;
					codTipo: string;
					flgConcorreMedia: string;
					codAggrDisciplina: string;
					flgLezioniIndividuali: null;
					codAggrInvalsi: null;
					codMinisteriale: null;
					icona: string;
					descrizione: string | null;
					conInsufficienze: boolean;
					selezionata: boolean;
					prgMateria: number;
					tipo: string;
					articolata: string;
					lezioniIndividuali: boolean;
					idmateria: string;
					codEDescrizioneMateria: string;
					tipoOnGrid: string;
				};
				desCommento: string;
			}>[];
			ricaricaDati: boolean;
			listaDocentiClasse: {
				desCognome: "DI LUCA";
				materie: string[];
				desNome: string;
				pk: string;
				desEmail: string;
			}[];
			bachecaAlunno: APIOperation<{
				nomeFile: string;
				datEvento: string;
				messaggio: string;
				data: string;
				flgDownloadGenitore: string;
				isPresaVisione: boolean;
			}>[];
			profiloDisabilitato: boolean;
			mediaPerPeriodo: Record<
				string,
				{
					mediaGenerale: number;
					listaMaterie: Record<
						string,
						{
							sommaValutazioniOrale: number;
							numValutazioniOrale: number;
							mediaMateria: number;
							mediaScritta: number;
							sumValori: number;
							numValori: number;
							numVoti: number;
							numValutazioniScritto: number;
							sommaValutazioniScritto: number;
							mediaOrale: number;
						}
					>;
					mediaMese: Record<`${number}`, number>;
				}
			>;
			mediaMaterie: Record<
				string,
				{
					sommaValutazioniOrale: number;
					numValutazioniOrale: number;
					mediaMateria: number;
					mediaScritta: number;
					sumValori: number;
					numValori: number;
					numVoti: number;
					numValutazioniScritto: number;
					sommaValutazioniScritto: number;
					mediaOrale: number;
				}
			>;
			autocertificazione: any;
			registro: APIOperation<{
				datEvento: string;
				desUrl: string;
				pkDocente: string;
				compiti: {
					compito: string;
					dataConsegna: string;
				}[];
				datGiorno: string;
				docente: string;
				materia: string;
				pkMateria: string;
				attivita: string;
				ora: number;
			}>[];
			schede: any[];
			prenotazioniAlunni: any[];
			noteDisciplinari: any[];
			pk: string;
			appello: APIOperation<{
				datEvento: string;
				descrizione: string;
				daGiustificare: boolean;
				giustificata: string;
				data: string;
				codEvento: string;
				docente: string;
				commentoGiustificazione: string;
				dataGiustificazione: string;
				nota: string;
			}>[];
			classiExtra: boolean;
		}
	];
}>;
export type APIDettagliProfilo = APIResponse<{
	utente: {
		flgUtente: string;
	};
	genitore: {
		flgSesso: string;
		desCognome: string;
		desEMail: string;
		desCellulare: string | null;
		desTelefono: string;
		desNome: string;
		datNascita: string;
	};
	alunno: {
		cognome: string;
		desCellulare: string | null;
		desCf: string;
		datNascita: string;
		desCap: string;
		desComuneResidenza: string;
		nome: string;
		desComuneNascita: string;
		desCapResidenza: string;
		cittadinanza: string;
		desIndirizzoRecapito: string;
		desEMail: string | null;
		nominativo: string;
		desVia: string;
		desTelefono: string;
		sesso: string;
		desComuneRecapito: string;
	};
}>;
export type APIWhat = APIResponse<{
	dati: [
		{
			forceLogin: boolean;
			isModificato: boolean;
			pk: string;
			alunno: {
				isUltimaClasse: boolean;
				nominativo: string;
				cognome: string;
				nome: string;
				pk: string;
				maggiorenne: boolean;
				desEmail: string | null;
			};
			mostraPallino: boolean;
			scheda: {
				aggiornaSchedaPK: boolean;
				classe: {
					pk: string;
					desDenominazione: string;
					desSezione: string;
				};
				dataInizio: string;
				anno: number;
				corso: {
					descrizione: string;
					pk: string;
				};
				sede: {
					descrizione: string;
					pk: string;
				};
				scuola: {
					desOrdine: string;
					descrizione: string;
					pk: string;
				};
				dataFine: string;
				pk: string;
			};
			differenzaSchede: boolean;
			profiloStorico: boolean;
		}
	];
}>;
export type APIOrarioGiornaliero = APIResponse<{
	dati: Record<
		`${number}`,
		{
			numOra: number;
			mostra: boolean;
			desCognome: string;
			desNome: string;
			docente: string;
			materia: string;
			pk?: string;
			scuAnagrafePK?: string;
			desDenominazione: string;
			desEmail: string;
			desSezione: string;
			ora: null;
		}[]
	>;
}>;
export type APIDownloadAllegato =
	| {
			success: false;
			msg: string;
	  }
	| {
			success: true;
			url: string;
	  };
export type APIVotiScrutinio = APIResponse<{
	votiScrutinio: [
		{
			periodi: {
				desDescrizione: string;
				materie: any[];
				suddivisione: string;
				votiGiudizi: boolean;
				scrutinioFinale: boolean;
			}[];
			pk: string;
		}
	];
}>;
export type APIRicevimenti = APIResponse<{
	disponibilita: Record<
		string,
		{
			desNota: string;
			numMax: number;
			docente: {
				desCognome: string;
				desNome: string;
				pk: string;
				desEmail: string | null;
			};
			numPrenotazioniAnnullate: null;
			flgAttivo: string;
			oraFine: string;
			indisponibilita: null;
			datInizioPrenotazione: string;
			desUrl: string;
			unaTantum: string;
			oraInizioPrenotazione: string;
			datScadenza: string;
			desLuogoRicevimento: string;
			oraInizio: string;
			pk: string;
			flgMostraEmail: string;
			desEMailDocente: string;
			numPrenotazioni: number;
		}[]
	>;
	genitoreOAlunno: {
		desEMail: string;
		nominativo: string;
		pk: string;
		telefono: string;
	}[];
	tipoAccesso: string;
	prenotazioni: {
		operazione: string;
		datEvento: string;
		prenotazione: {
			prgScuola: number;
			datPrenotazione: string;
			numPrenotazione: number;
			prgAlunno: number;
			genitore: string;
			numMax: number;
			orarioPrenotazione: string;
			prgGenitore: number;
			flgAnnullato: null;
			flgAnnullatoDa: null;
			desTelefonoGenitore: string;
			flgTipo: null;
			datAnnullamento: null;
			desUrl: string | null;
			pk: string;
			genitorePK: string;
			desEMailGenitore: string;
			numPrenotazioni: number;
		};
		disponibilita: {
			ora_Fine: string;
			desNota: string;
			datDisponibilita: string;
			desUrl: string;
			numMax: number;
			ora_Inizio: string;
			flgAttivo: string;
			desLuogoRicevimento: string;
			pk: string;
		};
		docente: {
			desCognome: string;
			desNome: string;
			pk: string;
			desEmail: string | null;
		};
	}[];
}>;
export type APITasse = APIResponse<
	{
		importoPrevisto: string;
		dataPagamento: string | null;
		listaSingoliPagamenti:
			| {
					importoTassa: string;
					descrizione: string;
					importoPrevisto: string;
			  }[]
			| null;
		dataCreazione: string | null;
		scadenza: string;
		rptPresent: boolean;
		rata: string;
		iuv: string | null;
		importoTassa: string;
		stato: string;
		descrizione: string;
		debitore: string;
		importoPagato: string | null;
		pagabileOltreScadenza: boolean;
		rtPresent: boolean;
		isPagoOnLine: boolean;
		status: string;
	}[]
> & {
	isPagOnlineAttivo: boolean;
};
export type APIPCTO = APIResponse<{
	pcto: {
		percorsi: any[];
		pk: string;
	}[];
}>;
export type APICorsiRecupero = APIResponse<{
	corsiRecupero: any[];
	periodi: any[];
}>;
export type APICurriculum = APIResponse<{
	curriculum: {
		pkScheda: string;
		classe: string;
		anno: number;
		esito:
			| ""
			| {
					esitoPK: {
						codMin: string;
						codEsito: string;
					};
					desDescrizione: string;
					numColore: number;
					flgPositivo: string;
					flgTipoParticolare: null;
					tipoEsito: string;
					descrizione: string;
					icona: string;
					codEsito: string;
					particolarita: string;
					positivo: string;
					tipoEsitoParticolare: string;
			  };
		credito: number;
		mostraInfo: boolean;
		mostraCredito: boolean;
		isSuperiore: boolean;
		isInterruzioneFR: boolean;
		media: number;
		CVAbilitato: boolean;
		ordineScuola: string;
	}[];
}>;
export type APIBacheca = APIResponse<
	Pick<APIDashboard["data"]["dati"][number], "bacheca">
>;
export type APIBachecaAlunno = APIResponse<
	Pick<APIDashboard["data"]["dati"][number], "bachecaAlunno">
>;

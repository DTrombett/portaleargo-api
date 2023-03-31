export type APIResponse<T = any> = {
	success: boolean;
	msg: string | null;
	data: T;
};
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
export type APIProfile = APIResponse<{
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
		desEmail: null;
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
	dati: {
		fuoriClasse: {
			operazione: string;
			datEvento: string;
			descrizione: string;
			data: string;
			docente: string;
			pk: string;
			nota: string;
			frequenzaOnLine: boolean;
		}[];
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
		promemoria: {
			operazione: string;
			datEvento: string;
			desAnnotazioni: string;
			pkDocente: string;
			flgVisibileFamiglia: string;
			datGiorno: string;
			docente: string;
			oraInizio: string;
			pk: string;
			oraFine: string;
		}[];
		bacheca: {
			datEvento: string;
			messaggio: string;
			data: string;
			pvRichiesta: boolean;
			categoria: string;
			dataConfermaPresaVisione: string;
			url: null;
			autore: string;
			dataScadenza: null;
			operazione: string;
			adRichiesta: boolean;
			isPresaVisione: boolean;
			dataConfermaAdesione: string;
			pk: string;
			listaAllegati: {
				nomeFile: string;
				path: string;
				descrizioneFile: null;
				pk: string;
				url: string;
			}[];
			dataScadAdesione: null;
			isPresaAdesioneConfermata: boolean;
		}[];
		fileCondivisi: {
			fileAlunniScollegati: [];
			listaFile: [];
		};
		voti: {
			datEvento: string;
			pkPeriodo: string;
			codCodice: string;
			valore: number;
			codVotoPratico: string;
			docente: string;
			pkMateria: string;
			tipoValutazione: null;
			prgVoto: number;
			operazione: string;
			descrizioneProva: string;
			faMenoMedia: string;
			pkDocente: string;
			descrizioneVoto: string;
			codTipo: string;
			datGiorno: string;
			mese: number;
			numMedia: number;
			pk: string;
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
				descrizione: null;
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
		}[];
		ricaricaDati: boolean;
		listaDocentiClasse: {
			desCognome: "DI LUCA";
			materie: string[];
			desNome: string;
			pk: string;
			desEmail: string;
		}[];
		bachecaAlunno: {
			operazione: string;
			nomeFile: string;
			datEvento: string;
			messaggio: string;
			data: string;
			flgDownloadGenitore: string;
			isPresaVisione: boolean;
			pk: string;
		}[];
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
		registro: {
			operazione: string;
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
			pk: string;
			pkMateria: string;
			attivita: string;
			ora: number;
		}[];
		schede: any[];
		prenotazioniAlunni: any[];
		noteDisciplinari: any[];
		pk: string;
		appello: {
			operazione: string;
			datEvento: string;
			descrizione: string;
			daGiustificare: boolean;
			giustificata: string;
			data: string;
			codEvento: string;
			docente: string;
			commentoGiustificazione: string;
			pk: string;
			dataGiustificazione: string;
			nota: string;
		}[];
		classiExtra: boolean;
	}[];
}>;
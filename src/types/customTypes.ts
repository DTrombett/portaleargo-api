export type Token = {
	accessToken: string;
	expireDate: number;
	idToken: string;
	refreshToken: string;
	scopes: string[];
	tokenType: string;
};
export type Login = {
	schoolCode: string;
	options: Record<string, boolean>;
	firstAccess: boolean;
	disabledProfile: boolean;
	resetPassword: boolean;
	spid: boolean;
	token: string;
	username: string;
};
export type Profilo = {
	ultimoCambioPassword: null;
	anno: {
		dataInizio: string;
		dataFine: string;
	};
	genitore: {
		email: string;
		nomeCompleto: string;
		id: string;
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
export type Dashboard = {
	dataAggiornamento: number;
	fuoriClasse: {
		data: string;
		descrizione: string;
		docente: string;
		id: string;
		note: string;
		frequenzaOnline: boolean;
	}[];
	msg: string;
	opzioni: Record<string, boolean>;
	mediaGenerale: number;
	mensa: any;
	mediaMensile: number[];
	materie: {
		nomeBreve: string;
		scrutinio: boolean;
		codice: string;
		faMedia: false;
		nome: string;
		id: string;
	}[];
	rimuoviDatiLocali: boolean;
	periodi: {
		id: string;
		dataInizio: string;
		descrizione: string;
		votoUnico: boolean;
		mediaScrutinio: number;
		haMediaScrutinio: boolean;
		dataFine: string;
		codicePeriodo: string;
		scrutinioFinale: boolean;
	}[];
	promemoria: {
		data: string;
		dettagli: string;
		idDocente: string;
		visibile: boolean;
		oraInizio: string;
		id: string;
		oraFine: string;
	}[];
	bacheca: {
		data: string;
		dettagli: string;
		richiestaPresaVisione: boolean;
		categoria: string;
		dataPresaVisione: string;
		url: string | null;
		autore: string;
		dataScadenza: string | null;
		adRichiesta: boolean;
		dataConfermaAdesione: string;
		id: string;
		allegati: {
			nome: string;
			percorso: string;
			descrizione: string | null;
			id: string;
			url: string;
		}[];
		dataScadenzaAdesione: string | null;
	}[];
	fileCondivisi: { fileAlunniScollegati: any[]; listaFile: any[] };
	voti: {
		data: string;
		idPeriodo: string;
		valore: number;
		voto: string;
		pratico: boolean;
		idMateria: string;
		tipoValutazione: null;
		prg: number;
		descrizioneProva: string;
		faMenoMedia: string;
		idDocente: string;
		descrizione: string;
		tipo: string;
		conteggioMedia: number;
		id: string;
		dettagliMateria: {
			scuola: {
				prg: number;
				anno: number;
				prgMateria: number;
			};
			codice: string;
			nome: string;
			nomeBreve: string;
			codiceSezione: string;
			codiceTipo: string;
			faMedia: boolean;
			codiceAggregato: string;
			lezioniIndividuali: null;
			codiceInvalsi: null;
			codiceMinisteriale: null;
			icona: string;
			descrizione: string | null;
			haInsufficienze: boolean;
			selezionata: boolean;
			prg: number;
			categoria: string;
			tipo: string;
			idMateria: string;
		};
		commento: string;
	}[];
	nuoviDati: boolean;
	docenti: {
		cognome: string;
		materie: string[];
		nome: string;
		id: string;
		email: string;
	}[];
	bachecaAlunno: {
		nomeFile: string;
		data: string;
		dettagli: string;
		downloadGenitore: string;
		presaVisione: boolean;
		id: string;
	}[];
	profiloDisabilitato: boolean;
	mediaPeriodo: Record<
		string,
		{
			media: number;
			materie: {
				sommaVotiOrali: number;
				votiOrali: number;
				conteggioMedia: number;
				votiScritti: number;
				sommaVotiScritti: number;
				idMateria: string;
			}[];
			mediaMensile: Record<`${number}`, number>;
		}
	>;
	mediaMaterie: {
		sommaVotiOrali: number;
		votiOrali: number;
		conteggioMedia: number;
		votiScritti: number;
		sommaVotiScritti: number;
		idMateria: string;
	}[];
	autoCertificazione: any;
	registro: {
		data: string;
		url: string;
		idDocente: string;
		compiti: {
			dettagli: string;
			scadenza: string;
		}[];
		id: string;
		idMateria: string;
		attività: string;
		ora: number;
	}[];
	schede: any[];
	prenotazioniAlunni: any[];
	note: any[];
	appello: {
		data: string;
		descrizione: string;
		daGiustificare: boolean;
		giustificata: boolean;
		codiceEvento: string;
		dettagliGiustificazione: string;
		id: string;
		dataGiustificazione: string;
		nota: string;
	}[];
	classiExtra: boolean;
};
export type DettagliProfilo = {
	flgUtente: string;
	genitore: {
		sesso: string;
		cognome: string;
		email: string;
		cellulare: string | null;
		telefono: string;
		nome: string;
		dataNascita: string;
	};
	alunno: {
		cognome: string;
		cellulare: string | null;
		codiceFiscale: string;
		dataNascita: string;
		cap: string;
		comuneResidenza: string;
		nome: string;
		comuneNascita: string;
		capResidenza: string;
		cittadinanza: string;
		indirizzo: string;
		email: string | null;
		via: string;
		telefono: string;
		sesso: string;
		comune: string;
	};
};
export type What = {
	idAggiornamentoScheda: boolean;
	forzaLogin: boolean;
	profiloModificato: boolean;
	aggiornato: boolean;
	differenzaSchede: boolean;
	profilo: {
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
};
export type OrarioGiornaliero = {
	numOra: number;
	mostra: boolean;
	cognome: string;
	nome: string;
	docente: string;
	materia: string;
	id?: string;
	idAnagrafe?: string;
	denominazioneOra: string;
	email: string;
	sezione: string;
	ora: null;
}[][];
export type VotiScrutinio = {
	periodi: {
		descrizione: string;
		materie: any[];
		suddivisione: string;
		voti: boolean;
		scrutinioFinale: boolean;
	}[];
};
export type Ricevimenti = {
	disponibilità: {
		nota: string;
		max: number;
		idDocente: string;
		prenotazioniAnnullate: null;
		attivo: boolean;
		oraFine: string;
		indisponibilità: null;
		dataInizioPrenotazione: string;
		url: string;
		unaTantum: string;
		oraInizioPrenotazione: string;
		scadenza: string;
		luogo: string;
		oraInizio: string;
		id: string;
		mostraEmail: boolean;
		prenotazioni: number;
		data: string;
	}[];
	genitoreAlunno: {
		id: string;
		telefono: string;
	}[];
	tipoAccesso: string;
	prenotazioni: {
		data: string;
		prenotazione: {
			prgScuola: number;
			dataPrenotazione: string;
			prenotazione: number;
			prgAlunno: number;
			maxPrenotazioni: number;
			orarioPrenotazione: string;
			prgGenitore: number;
			annullato: null;
			annullatoDa: null;
			tipo: null;
			dataAnnullamento: null;
			url: string | null;
			id: string;
			idGenitore: string;
			prenotazioni: number;
		};
		disponibilita: {
			oraFine: string;
			nota: string;
			dataDisponibilità: string;
			url: string;
			max: number;
			oraInizio: string;
			attivo: boolean;
			luogo: string;
			id: string;
		};
		idDocente: string;
	}[];
};
export type Tasse = {
	tasse: {
		importoPrevisto: number;
		dataPagamento: number | null;
		singoliPagamenti: {
			importoTassa: number;
			descrizione: string;
			importoPrevisto: number;
		}[];
		dataCreazione: number | null;
		scadenza: number;
		rptPresent: boolean;
		rata: string;
		iuv: string | null;
		importoTassa: number;
		stato: string;
		descrizione: string;
		debitore: string;
		importoPagato: number | null;
		pagabileOltreScadenza: boolean;
		rtPresent: boolean;
		pagOnLine: boolean;
	}[];
	pagOnline: boolean;
};
export type PCTO = any[];
export type CorsiRecupero = {
	corsiRecupero: any[];
	periodi: any[];
};
export type Curriculum = {
	id: string;
	classe: string;
	anno: number;
	esito: {
		codScuola: string;
		colore: number;
		ammesso: boolean;
		descrizione: string;
		icona: string;
		codEsito: string;
		particolarità: string;
	} | null;
	credito: number;
	mostraInfo: boolean;
	mostraCredito: boolean;
	superiore: boolean;
	interruzioneFR: boolean;
	media: number;
	CV: boolean;
	ordine: string;
}[];
export type Bacheca = Dashboard["bacheca"];
export type BachecaAlunno = Dashboard["bachecaAlunno"];

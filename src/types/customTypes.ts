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
export type Profile = {
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
	fuoriClasse: Record<
		string,
		{
			data: string;
			descrizione: string;
			docente: string;
			id: string;
			note: string;
			frequenzaOnline: boolean;
		}
	>;
	msg: string;
	opzioni: Record<string, boolean>;
	mediaGenerale: number;
	mensa: any;
	mediaMensile: Record<`${number}`, number>;
	materie: Record<
		string,
		{
			nomeBreve: string;
			scrutinio: boolean;
			codice: string;
			faMedia: false;
			nome: string;
			id: string;
		}
	>;
	rimuoviDatiLocali: boolean;
	periodi: Record<
		string,
		{
			id: string;
			dataInizio: string;
			descrizione: string;
			votoUnico: boolean;
			mediaScrutinio: number;
			haMediaScrutinio: boolean;
			dataFine: string;
			codicePeriodo: string;
			scrutinioFinale: boolean;
		}
	>;
	promemoria: Record<
		string,
		{
			data: string;
			dettagli: string;
			idDocente: string;
			visibile: boolean;
			oraInizio: string;
			id: string;
			oraFine: string;
		}
	>;
	bacheca: Record<
		string,
		{
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
			allegati: Record<
				string,
				{
					nome: string;
					percorso: string;
					descrizione: string | null;
					id: string;
					url: string;
				}
			>;
			dataScadenzaAdesione: string | null;
		}
	>;
	fileCondivisi: { fileAlunniScollegati: any[]; listaFile: any[] };
	voti: Record<
		string,
		{
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
		}
	>;
	nuoviDati: boolean;
	docenti: Record<
		string,
		{
			cognome: string;
			materie: string[];
			nome: string;
			id: string;
			email: string;
		}
	>;
	bachecaAlunno: Record<
		string,
		{
			nomeFile: string;
			data: string;
			dettagli: string;
			downloadGenitore: string;
			presaVisione: boolean;
			id: string;
		}
	>;
	profiloDisabilitato: boolean;
	mediaPeriodo: Record<
		string,
		{
			media: number;
			materie: Record<
				string,
				{
					sommaVotiOrali: number;
					votiOrali: number;
					conteggioMedia: number;
					votiScritti: number;
					sommaVotiScritti: number;
				}
			>;
			mediaMensile: Record<`${number}`, number>;
		}
	>;
	mediaMateria: Record<
		string,
		{
			sommaVotiOrali: number;
			votiOrali: number;
			conteggioMedia: number;
			votiScritti: number;
			sommaVotiScritti: number;
		}
	>;
	autoCertificazione: any;
	registro: Record<
		string,
		{
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
		}
	>;
	schede: any[];
	prenotazioniAlunni: any[];
	note: any[];
	id: string;
	appello: Record<
		string,
		{
			data: string;
			descrizione: string;
			daGiustificare: boolean;
			giustificata: boolean;
			codiceEvento: string;
			dettagliGiustificazione: string;
			id: string;
			dataGiustificazione: string;
			nota: string;
		}
	>;
	classiExtra: boolean;
};
export type ProfileDetails = {
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
export type DailyTimetable = {
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

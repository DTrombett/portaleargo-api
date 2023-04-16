import type { APIDashboard, Client, Jsonify } from "..";
import { Base, EventoBacheca, EventoBachecaAlunno, handleOperation } from "..";

type DashboardData = APIDashboard["data"]["dati"][0];
type Data = DashboardData | Jsonify<Dashboard>;

/**
 * Rappresenta la dashboard dello studente
 */
export class Dashboard extends Base<DashboardData> {
	dataAggiornamento!: Date;
	fuoriClasse: {
		data: string;
		descrizione: string;
		docente: string;
		id: string;
		note: string;
		frequenzaOnline: boolean;
	}[] = [];
	msg!: string;
	opzioni!: Record<string, boolean>;
	mediaGenerale!: number;
	mensa!: any;
	mediaMensile: number[] = [];
	materie: {
		nomeBreve: string;
		scrutinio: boolean;
		codice: string;
		faMedia: false;
		nome: string;
		id: string;
	}[] = [];
	rimuoviDatiLocali!: boolean;
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
	}[] = [];
	promemoria: {
		data: string;
		dettagli: string;
		idDocente: string;
		visibile: boolean;
		oraInizio: string;
		id: string;
		oraFine: string;
	}[] = [];
	bacheca: EventoBacheca[] = [];
	fileCondivisi!: { fileAlunniScollegati: any[]; listaFile: any[] };
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
	}[] = [];
	nuoviDati!: boolean;
	docenti: {
		cognome: string;
		materie: string[];
		nome: string;
		id: string;
		email: string;
	}[] = [];
	bachecaAlunno: EventoBachecaAlunno[] = [];
	profiloDisabilitato!: boolean;
	mediaPeriodo!: Record<
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
	}[] = [];
	autoCertificazione!: any;
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
	}[] = [];
	schede: any[] = [];
	prenotazioniAlunni: any[] = [];
	note: any[] = [];
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
	}[] = [];
	classiExtra!: boolean;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) {
			this.handleJson(data);
			this.dataAggiornamento = new Date(data.dataAggiornamento);
			this.bacheca = data.bacheca.map((b) => new EventoBacheca(b, this.client));
			this.bachecaAlunno = data.bachecaAlunno.map(
				(b) => new EventoBachecaAlunno(b, this.client)
			);
		} else {
			this.dataAggiornamento = new Date();
			this.fuoriClasse = handleOperation(
				data.fuoriClasse,
				this.fuoriClasse,
				(a) => ({
					data: a.datEvento,
					descrizione: a.descrizione,
					docente: a.docente,
					note: a.nota,
					frequenzaOnline: a.frequenzaOnLine,
					id: a.pk,
				})
			);
			this.msg = data.msg;
			this.opzioni = Object.fromEntries(
				data.opzioni.map((d) => [d.chiave, d.valore])
			);
			this.mediaGenerale = data.mediaGenerale;
			this.mensa = data.mensa;
			this.mediaMensile = Object.values(data.mediaPerMese);
			this.materie = data.listaMaterie.map((a) => ({
				codice: a.codTipo,
				faMedia: a.faMedia,
				nome: a.materia,
				scrutinio: a.scrut,
				nomeBreve: a.abbreviazione,
				id: a.pk,
			}));
			this.rimuoviDatiLocali = data.rimuoviDatiLocali;
			this.periodi = data.listaPeriodi.map((a) => ({
				descrizione: a.descrizione,
				dataFine: a.datFine,
				mediaScrutinio: a.mediaScrutinio,
				haMediaScrutinio: a.isMediaScrutinio,
				scrutinioFinale: a.isScrutinioFinale,
				codicePeriodo: a.codPeriodo,
				votoUnico: a.votoUnico,
				dataInizio: a.datInizio,
				id: a.pkPeriodo,
			}));
			this.promemoria = handleOperation(
				data.promemoria,
				this.promemoria,
				(a) => ({
					data: a.datEvento,
					dettagli: a.desAnnotazioni,
					oraFine: a.oraFine,
					idDocente: a.pkDocente,
					oraInizio: a.oraInizio,
					visibile: a.flgVisibileFamiglia === "S",
					id: a.pk,
				})
			);
			this.bacheca = handleOperation(
				data.bacheca,
				this.bacheca,
				(a) => new EventoBacheca(a, this.client)
			);
			this.fileCondivisi = data.fileCondivisi;
			this.voti = handleOperation(data.voti, this.voti, (a) => ({
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
				id: a.pk,
			}));
			this.nuoviDati = data.ricaricaDati;
			this.docenti = data.listaDocentiClasse.map((a) => ({
				cognome: a.desCognome,
				materie: a.materie,
				nome: a.desNome,
				email: a.desEmail,
				id: a.pk,
			}));
			this.bachecaAlunno = handleOperation(
				data.bachecaAlunno,
				this.bachecaAlunno,
				(a) => new EventoBachecaAlunno(a, this.client)
			);
			this.profiloDisabilitato = data.profiloDisabilitato;
			this.mediaPeriodo = {};
			this.mediaMaterie = [];
			this.autoCertificazione = data.autocertificazione;
			this.registro = handleOperation(data.registro, this.registro, (a) => ({
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
				id: a.pk,
			}));
			this.schede = data.schede;
			this.prenotazioniAlunni = data.prenotazioniAlunni;
			this.note = data.noteDisciplinari;
			this.classiExtra = data.classiExtra;
			this.appello = handleOperation(data.appello, this.appello, (a) => ({
				data: a.datEvento,
				descrizione: a.descrizione,
				daGiustificare: a.daGiustificare,
				giustificata: a.giustificata === "S",
				codiceEvento: a.codEvento,
				dettagliGiustificazione: a.commentoGiustificazione,
				dataGiustificazione: a.dataGiustificazione,
				nota: a.nota,
				id: a.pk,
			}));
		}
	}
}

import type { APIDashboard, Client, Jsonify } from "..";
import {
	Base,
	Docente,
	EventoAppello,
	EventoBacheca,
	EventoBachecaAlunno,
	EventoRegistro,
	FuoriClasse,
	Materia,
	MediaMateria,
	MediaPeriodo,
	Periodo,
	Promemoria,
	Voto,
	handleOperation,
} from "..";

type DashboardData = APIDashboard["data"]["dati"][0];
type Data = DashboardData | Jsonify<Dashboard>;

/**
 * Rappresenta la dashboard dello studente
 */
export class Dashboard extends Base<DashboardData> {
	dataAggiornamento!: Date;
	fuoriClasse: FuoriClasse[] = [];
	msg!: string;
	opzioni!: Record<string, boolean>;
	mediaGenerale!: number;
	mensa!: any;
	mediaMensile: number[] = [];
	materie: Materia[] = [];
	rimuoviDatiLocali!: boolean;
	periodi: Periodo[] = [];
	promemoria: Promemoria[] = [];
	bacheca: EventoBacheca[] = [];
	fileCondivisi!: { fileAlunniScollegati: any[]; listaFile: any[] };
	voti: Voto[] = [];
	nuoviDati!: boolean;
	docenti: Docente[] = [];
	bachecaAlunno: EventoBachecaAlunno[] = [];
	profiloDisabilitato!: boolean;
	mediaPeriodo: Record<string, MediaPeriodo> = {};
	mediaMaterie: MediaMateria[] = [];
	autoCertificazione!: any;
	registro: EventoRegistro[] = [];
	schede: any[] = [];
	prenotazioniAlunni: any[] = [];
	note: any[] = [];
	appello: EventoAppello[] = [];
	classiExtra!: boolean;

	/**
	 * @param data - I dati ricevuti tramite l'API
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
			this.fuoriClasse = data.fuoriClasse.map(
				(a) => new FuoriClasse(a, this.client)
			);
			this.materie = data.materie.map((a) => new Materia(a, this.client));
			this.periodi = data.periodi.map((a) => new Periodo(a, this.client));
			this.promemoria = data.promemoria.map(
				(a) => new Promemoria(a, this.client)
			);
			this.voti = data.voti.map((a) => new Voto(a, this.client));
			this.docenti = data.docenti.map((a) => new Docente(a, this.client));
			this.mediaPeriodo = {};
			for (const k in data.mediaPeriodo)
				if (Object.hasOwn(data.mediaPeriodo, k))
					this.mediaPeriodo[k] = new MediaPeriodo(
						data.mediaPeriodo[k],
						this.client
					);
			this.mediaMaterie = data.mediaMaterie.map(
				(a) => new MediaMateria(a, this.client)
			);
			this.registro = data.registro.map(
				(a) => new EventoRegistro(a, this.client)
			);
			this.appello = data.appello.map((a) => new EventoAppello(a, this.client));
		} else {
			this.dataAggiornamento = new Date();
			this.fuoriClasse = handleOperation(
				data.fuoriClasse,
				this.fuoriClasse,
				(a) => new FuoriClasse(a, this.client)
			);
			this.msg = data.msg;
			this.opzioni = Object.fromEntries(
				data.opzioni.map((d) => [d.chiave, d.valore])
			);
			this.mediaGenerale = data.mediaGenerale;
			this.mensa = data.mensa;
			this.mediaMensile = Object.values(data.mediaPerMese);
			this.materie = data.listaMaterie.map((a) => new Materia(a, this.client));
			this.rimuoviDatiLocali = data.rimuoviDatiLocali;
			this.periodi = data.listaPeriodi.map((a) => new Periodo(a, this.client));
			this.promemoria = handleOperation(
				data.promemoria,
				this.promemoria,
				(a) => new Promemoria(a, this.client)
			);
			this.bacheca = handleOperation(
				data.bacheca,
				this.bacheca,
				(a) => new EventoBacheca(a, this.client)
			);
			this.fileCondivisi = data.fileCondivisi;
			this.voti = handleOperation(
				data.voti,
				this.voti,
				(a) => new Voto(a, this.client)
			);
			this.nuoviDati = data.ricaricaDati;
			this.docenti = data.listaDocentiClasse.map(
				(a) => new Docente(a, this.client)
			);
			this.bachecaAlunno = handleOperation(
				data.bachecaAlunno,
				this.bachecaAlunno,
				(a) => new EventoBachecaAlunno(a, this.client)
			);
			this.profiloDisabilitato = data.profiloDisabilitato;
			this.autoCertificazione = data.autocertificazione;
			this.registro = handleOperation(
				data.registro,
				this.registro,
				(a) => new EventoRegistro(a, this.client)
			);
			this.schede = data.schede;
			this.prenotazioniAlunni = data.prenotazioniAlunni;
			this.note = data.noteDisciplinari;
			this.classiExtra = data.classiExtra;
			this.appello = handleOperation(
				data.appello,
				this.appello,
				(a) => new EventoAppello(a, this.client)
			);
			for (const k in data.mediaPerPeriodo)
				if (Object.hasOwn(data.mediaPerPeriodo, k))
					this.mediaPeriodo[k] = new MediaPeriodo(
						data.mediaPerPeriodo[k],
						this.client
					);
			for (const k in data.mediaMaterie)
				if (Object.hasOwn(data.mediaMaterie, k))
					this.mediaMaterie.push(
						new MediaMateria(data.mediaMaterie[k], this.client, k)
					);
		}
		return this;
	}

	/**
	 * Aggiorna questi dati.
	 * @returns I dati aggiornati
	 */
	refresh() {
		return this.client.login() as Promise<this>;
	}
}

import type { APIRicevimenti, Client, Jsonify } from "..";
import { Base } from "..";

type PrenotazioneData = APIRicevimenti["data"]["prenotazioni"][number];
type Data = Jsonify<Prenotazione> | PrenotazioneData;

/**
 * Rappresenta una prenotazione ad un ricevimento
 */
export class Prenotazione extends Base<PrenotazioneData> {
	data!: string;
	prenotazione!: {
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
	disponibilita!: {
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
	idDocente!: string;

	/**
	 * @param data - I dati ricevuti tramite l'API
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.data = data.datEvento;
			this.idDocente = data.docente.pk;
			this.disponibilita = {
				attivo: data.disponibilita.flgAttivo === "S",
				dataDisponibilità: data.disponibilita.datDisponibilita,
				id: data.disponibilita.pk,
				luogo: data.disponibilita.desLuogoRicevimento,
				max: data.disponibilita.numMax,
				nota: data.disponibilita.desNota,
				oraFine: data.disponibilita.ora_Fine,
				oraInizio: data.disponibilita.ora_Inizio,
				url: data.disponibilita.desUrl,
			};
			this.prenotazione = {
				annullato: data.prenotazione.flgAnnullato,
				annullatoDa: data.prenotazione.flgAnnullatoDa,
				dataAnnullamento: data.prenotazione.datAnnullamento,
				dataPrenotazione: data.prenotazione.datPrenotazione,
				id: data.prenotazione.pk,
				idGenitore: data.prenotazione.genitorePK,
				maxPrenotazioni: data.prenotazione.numMax,
				orarioPrenotazione: data.prenotazione.orarioPrenotazione,
				prenotazione: data.prenotazione.numPrenotazione,
				prenotazioni: data.prenotazione.numPrenotazioni,
				prgAlunno: data.prenotazione.prgAlunno,
				prgGenitore: data.prenotazione.prgGenitore,
				prgScuola: data.prenotazione.prgScuola,
				tipo: data.prenotazione.flgTipo,
				url: data.prenotazione.desUrl,
			};
		}
		return this;
	}
}

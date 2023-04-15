import type { APIRicevimenti, Jsonify } from "..";
import { Base } from "..";

type RicevimentiData = APIRicevimenti["data"];
type Data = Jsonify<Ricevimenti> | RicevimentiData;

/**
 * Rappresenta i dati dei ricevimenti
 */
export class Ricevimenti extends Base<RicevimentiData> {
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
	}[] = [];
	genitoreAlunno: {
		id: string;
		telefono: string;
	}[] = [];
	tipoAccesso!: string;
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
	}[] = [];

	/**
	 * @param data - The API data
	 */
	constructor(data: Data) {
		super();
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.tipoAccesso = data.tipoAccesso;
			this.genitoreAlunno = data.genitoreOAlunno.map((a) => ({
				id: a.pk,
				telefono: a.telefono,
			}));
			this.prenotazioni = data.prenotazioni.map((a) => ({
				data: a.datEvento,
				idDocente: a.docente.pk,
				disponibilita: {
					attivo: a.disponibilita.flgAttivo === "S",
					dataDisponibilità: a.disponibilita.datDisponibilita,
					id: a.disponibilita.pk,
					luogo: a.disponibilita.desLuogoRicevimento,
					max: a.disponibilita.numMax,
					nota: a.disponibilita.desNota,
					oraFine: a.disponibilita.ora_Fine,
					oraInizio: a.disponibilita.ora_Inizio,
					url: a.disponibilita.desUrl,
				},
				prenotazione: {
					annullato: a.prenotazione.flgAnnullato,
					annullatoDa: a.prenotazione.flgAnnullatoDa,
					dataAnnullamento: a.prenotazione.datAnnullamento,
					dataPrenotazione: a.prenotazione.datPrenotazione,
					id: a.prenotazione.pk,
					idGenitore: a.prenotazione.genitorePK,
					maxPrenotazioni: a.prenotazione.numMax,
					orarioPrenotazione: a.prenotazione.orarioPrenotazione,
					prenotazione: a.prenotazione.numPrenotazione,
					prenotazioni: a.prenotazione.numPrenotazioni,
					prgAlunno: a.prenotazione.prgAlunno,
					prgGenitore: a.prenotazione.prgGenitore,
					prgScuola: a.prenotazione.prgScuola,
					tipo: a.prenotazione.flgTipo,
					url: a.prenotazione.desUrl,
				},
			}));

			for (const key in data.disponibilita)
				if (Object.hasOwn(data.disponibilita, key))
					for (const el of data.disponibilita[key])
						this.disponibilità.push({
							attivo: el.flgAttivo === "S",
							data: key,
							id: el.pk,
							idDocente: el.docente.pk,
							indisponibilità: el.indisponibilita,
							dataInizioPrenotazione: el.datInizioPrenotazione,
							luogo: el.desLuogoRicevimento,
							max: el.numMax,
							mostraEmail: el.flgMostraEmail === "S",
							nota: el.desNota,
							oraFine: el.oraFine,
							oraInizio: el.oraInizio,
							oraInizioPrenotazione: el.oraInizioPrenotazione,
							prenotazioni: el.numPrenotazioni,
							prenotazioniAnnullate: el.numPrenotazioniAnnullate,
							scadenza: el.datScadenza,
							unaTantum: el.unaTantum,
							url: el.desUrl,
						});
		}
	}
}

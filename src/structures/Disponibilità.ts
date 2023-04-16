import type { APIRicevimenti, Client, Jsonify } from "..";
import { Base } from "..";

type DisponibilitàData =
	APIRicevimenti["data"]["disponibilita"][string][number];
type Data = DisponibilitàData | Jsonify<Disponibilità>;

/**
 * Rappresenta la disponibilità dei ricevimenti di un professore
 */
export class Disponibilità extends Base<DisponibilitàData> {
	nota!: string;
	max!: number;
	idDocente!: string;
	prenotazioniAnnullate!: null;
	attivo!: boolean;
	oraFine!: string;
	indisponibilità!: null;
	dataInizioPrenotazione!: string;
	url!: string;
	unaTantum!: string;
	oraInizioPrenotazione!: string;
	scadenza!: string;
	luogo!: string;
	oraInizio!: string;
	id!: string;
	mostraEmail!: boolean;
	prenotazioni!: number;
	data!: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: DisponibilitàData, client: Client, date: string);
	constructor(data: Jsonify<Disponibilità>, client: Client);
	constructor(data: Data, client: Client, date?: string) {
		super(client);
		this.data = date!;
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.attivo = data.flgAttivo === "S";
			this.id = data.pk;
			this.idDocente = data.docente.pk;
			this.indisponibilità = data.indisponibilita;
			this.dataInizioPrenotazione = data.datInizioPrenotazione;
			this.luogo = data.desLuogoRicevimento;
			this.max = data.numMax;
			this.mostraEmail = data.flgMostraEmail === "S";
			this.nota = data.desNota;
			this.oraFine = data.oraFine;
			this.oraInizio = data.oraInizio;
			this.oraInizioPrenotazione = data.oraInizioPrenotazione;
			this.prenotazioni = data.numPrenotazioni;
			this.prenotazioniAnnullate = data.numPrenotazioniAnnullate;
			this.scadenza = data.datScadenza;
			this.unaTantum = data.unaTantum;
			this.url = data.desUrl;
		}
		return this;
	}
}

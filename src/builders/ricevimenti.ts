import type { APIRicevimenti, Ricevimenti } from "../types";

/**
 * Build the ricevimenti data.
 * @param body - The API response
 * @returns The new data
 */
export const buildRicevimenti = (body: APIRicevimenti) => {
	const { data } = body;
	const ricevimenti: Ricevimenti = {
		disponibilità: [],
		tipoAccesso: data.tipoAccesso,
		genitoreAlunno: data.genitoreOAlunno.map((a) => ({
			id: a.pk,
			telefono: a.telefono,
		})),
		prenotazioni: data.prenotazioni.map((a) => ({
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
		})),
	};

	for (const key in data.disponibilita)
		if (Object.hasOwn(data.disponibilita, key))
			for (const el of data.disponibilita[key])
				ricevimenti.disponibilità.push({
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
	return ricevimenti;
};

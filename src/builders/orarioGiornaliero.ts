import type { APIOrarioGiornaliero, OrarioGiornaliero } from "../types";

/**
 * Elabora i dati dell'orario giornaliero.
 * @param body - The API response
 * @returns The new data
 */
export const buildOrarioGiornaliero = (
	body: APIOrarioGiornaliero
): OrarioGiornaliero => {
	const {
		data: { dati },
	} = body;

	return Object.values(dati).map((a) =>
		a.map((b) => ({
			numOra: b.numOra,
			mostra: b.mostra,
			cognome: b.desCognome,
			nome: b.desNome,
			docente: b.docente,
			materia: b.materia,
			id: b.pk,
			idAnagrafe: b.scuAnagrafePK,
			denominazioneOra: b.desDenominazione,
			email: b.desEmail,
			sezione: b.desSezione,
			ora: b.ora,
		}))
	);
};

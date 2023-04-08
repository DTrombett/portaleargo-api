import type { APIDettagliProfilo, DettagliProfilo } from "../types";

/**
 * Elabora i dati dei dettagli del profilo.
 * @param body - The API response
 * @returns The new data
 */
export const buildDettagliProfilo = (
	body: APIDettagliProfilo
): DettagliProfilo => {
	const { data } = body;

	return {
		flgUtente: data.utente.flgUtente,
		genitore: {
			sesso: data.genitore.flgSesso,
			dataNascita: data.genitore.datNascita,
			email: data.genitore.desEMail,
			cellulare: data.genitore.desCellulare,
			nome: data.genitore.desNome,
			cognome: data.genitore.desCognome,
			telefono: data.genitore.desTelefono,
		},
		alunno: {
			indirizzo: data.alunno.desIndirizzoRecapito,
			dataNascita: data.alunno.datNascita,
			comuneNascita: data.alunno.desComuneNascita,
			cap: data.alunno.desCap,
			comune: data.alunno.desComuneRecapito,
			email: data.alunno.desEMail,
			sesso: data.alunno.sesso,
			cellulare: data.alunno.desCellulare,
			nome: data.alunno.nome,
			cittadinanza: data.alunno.cittadinanza,
			capResidenza: data.alunno.desCapResidenza,
			comuneResidenza: data.alunno.desComuneResidenza,
			via: data.alunno.desVia,
			cognome: data.alunno.cognome,
			codiceFiscale: data.alunno.desCf,
			telefono: data.alunno.desTelefono,
		},
	};
};

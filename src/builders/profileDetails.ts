import type { APIProfileDetails, ProfileDetails } from "../types";

/**
 * Build the profile details data.
 * @param body - The API response
 * @returns The new data
 */
export const buildProfileDetails = (
	body: APIProfileDetails
): ProfileDetails => {
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

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
		user: {
			flag: data.utente.flgUtente,
		},
		parent: {
			gender: data.genitore.flgSesso,
			birth: new Date(data.genitore.datNascita).getTime(),
			email: data.genitore.desEMail,
			mobile: data.genitore.desCellulare,
			name: data.genitore.desNome,
			surname: data.genitore.desCognome,
			telephone: data.genitore.desTelefono,
		},
		student: {
			address: data.alunno.desIndirizzoRecapito,
			birth: new Date(data.alunno.datNascita).getTime(),
			birthCity: data.alunno.desComuneNascita,
			cap: data.alunno.desCap,
			city: data.alunno.desComuneRecapito,
			email: data.alunno.desEMail,
			fullName: data.alunno.nominativo,
			gender: data.alunno.sesso,
			mobile: data.alunno.desCellulare,
			name: data.alunno.nome,
			nationality: data.alunno.cittadinanza,
			residenceCap: data.alunno.desCapResidenza,
			residenceCity: data.alunno.desComuneResidenza,
			street: data.alunno.desVia,
			surname: data.alunno.cognome,
			taxCode: data.alunno.desCf,
			telephone: data.alunno.desTelefono,
		},
	};
};

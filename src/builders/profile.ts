import type { APIProfile, Profile } from "../types";

/**
 * Build the profile data.
 * @param body - The API response
 * @returns The new data
 */
export const buildProfile = (body: APIProfile): Profile => {
	const { data } = body;

	return {
		resetPassword: data.resetPassword,
		lastPwdChange: data.ultimoCambioPwd,
		year: {
			startDate: new Date(data.anno.dataInizio).getTime(),
			year: data.anno.anno,
			endDate: new Date(data.anno.dataFine).getTime(),
		},
		parent: {
			email: data.genitore.desEMail,
			fullName: data.genitore.nominativo,
			id: data.genitore.pk,
		},
		disabledProfile: data.profiloDisabilitato,
		isSpid: data.isSpid,
		student: {
			isLastYear: data.alunno.isUltimaClasse,
			fullName: data.alunno.nominativo,
			surname: data.alunno.cognome,
			name: data.alunno.nome,
			id: data.alunno.pk,
			adult: data.alunno.maggiorenne,
			email: data.alunno.desEmail,
		},
		card: {
			class: {
				id: data.scheda.classe.pk,
				grade: Number(data.scheda.classe.desDenominazione),
				section: data.scheda.classe.desSezione,
			},
			course: {
				description: data.scheda.corso.descrizione,
				id: data.scheda.corso.pk,
			},
			site: {
				description: data.scheda.sede.descrizione,
				id: data.scheda.sede.pk,
			},
			school: {
				order: data.scheda.scuola.desOrdine,
				description: data.scheda.scuola.descrizione,
				id: data.scheda.scuola.pk,
			},
			id: data.scheda.pk,
		},
		firstAccess: data.primoAccesso,
		historicalProfile: data.profiloStorico,
	};
};

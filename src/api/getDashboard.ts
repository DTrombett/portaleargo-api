import type { APIDashboard, Client } from "..";
import { apiRequest, formatDate, handleOperation } from "../util";
import { validateDashboard } from "../schemas";

/**
 * Ottieni la dashboard dello studente.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const getDashboard = async (
	client: Client,
	options: {
		lastUpdate: Date | number | string;
	},
) => {
	const {
		body,
		res: { headers },
	} = await apiRequest<APIDashboard>("dashboard/dashboard", client, {
		body: {
			dataultimoaggiornamento: formatDate(options.lastUpdate),
			opzioni:
				client.loginData &&
				JSON.stringify(
					Object.fromEntries(
						client.loginData.opzioni.map((a) => [a.chiave, a.valore]),
					),
				),
		},
		method: "POST",
	});

	if (!body.success) throw new Error(body.msg!);
	const [data] = body.data.dati;

	client.dashboard = Object.assign(client.dashboard ?? {}, {
		...data,
		fuoriClasse: handleOperation(
			data.fuoriClasse,
			client.dashboard?.fuoriClasse,
		),
		promemoria: handleOperation(data.promemoria, client.dashboard?.promemoria),
		bacheca: handleOperation(data.bacheca, client.dashboard?.bacheca),
		voti: handleOperation(data.voti, client.dashboard?.voti),
		bachecaAlunno: handleOperation(
			data.bachecaAlunno,
			client.dashboard?.bachecaAlunno,
		),
		registro: handleOperation(data.registro, client.dashboard?.registro),
		appello: handleOperation(data.appello, client.dashboard?.appello),
		prenotazioniAlunni: handleOperation(
			data.prenotazioniAlunni,
			client.dashboard?.prenotazioniAlunni,
			(a) => a.prenotazione.pk,
		),
		dataAggiornamento: new Date(headers.get("date")!),
	});
	void client.dataProvider?.write("dashboard", client.dashboard);
	if (!client.noTypeCheck) validateDashboard(body);
	return client.dashboard;
};

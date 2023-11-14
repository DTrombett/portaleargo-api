import type { APIDashboard, Client } from "..";
import { apiRequest, formatDate, handleOperation } from "..";

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
	const [newData] = body.data.dati;

	client.dashboard = Object.assign(client.dashboard ?? {}, {
		...newData,
		fuoriClasse: handleOperation(
			newData.fuoriClasse,
			client.dashboard?.fuoriClasse,
		),
		promemoria: handleOperation(
			newData.promemoria,
			client.dashboard?.promemoria,
		),
		bacheca: handleOperation(newData.bacheca, client.dashboard?.bacheca),
		voti: handleOperation(newData.voti, client.dashboard?.voti),
		bachecaAlunno: handleOperation(
			newData.bachecaAlunno,
			client.dashboard?.bachecaAlunno,
		),
		registro: handleOperation(newData.registro, client.dashboard?.registro),
		appello: handleOperation(newData.appello, client.dashboard?.appello),
		dataAggiornamento: new Date(headers.date as string),
	});
	void client.dataProvider?.write("dashboard", client.dashboard);
	return client.dashboard;
};

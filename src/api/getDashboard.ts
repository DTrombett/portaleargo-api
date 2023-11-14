import type { APIDashboard, Client } from "..";
import { Dashboard, apiRequest, formatDate } from "..";

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
	const { body } = await apiRequest<APIDashboard>(
		"dashboard/dashboard",
		client,
		{
			body: {
				dataultimoaggiornamento: formatDate(options.lastUpdate),
				opzioni: JSON.stringify(client.loginData?.opzioni),
			},
			method: "POST",
		},
	);

	if (!body.success) throw new Error(body.msg!);
	if (!client.dashboard?.patch(body.data.dati[0]))
		client.dashboard = new Dashboard(body.data.dati[0], client);
	void client.dataProvider?.write("dashboard", client.dashboard);
	return client.dashboard;
};

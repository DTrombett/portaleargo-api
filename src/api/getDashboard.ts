import type { APIDashboard, Client } from "..";
import { Dashboard, apiRequest, formatDate, writeToFile } from "..";

/**
 * Fetch all the data for the authenticated user.
 * @param client - The client
 * @param options - Additional options for the request
 * @returns All the data for the user
 */
export const getDashboard = async (
	client: Client,
	options: {
		lastUpdate: Date | number | string;
	}
) => {
	const { body } = await apiRequest<APIDashboard>(
		"dashboard/dashboard",
		client,
		{
			body: {
				dataultimoaggiornamento: formatDate(options.lastUpdate),
				opzioni: JSON.stringify(client.loginData?.options),
			},
			method: "POST",
		}
	);

	if (!body.success) throw new Error(body.msg!);
	const value =
		client.dashboard?.patch(body.data.dati[0]) ??
		new Dashboard(body.data.dati[0], client);

	void writeToFile("dashboard", value);
	return value;
};

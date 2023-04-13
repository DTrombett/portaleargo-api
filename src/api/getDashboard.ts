import type { APIDashboard, Login, RequestOptions, Token } from "..";
import { Dashboard } from "..";
import { apiRequest, formatDate, writeToFile } from "../util";

/**
 * Fetch all the data for the authenticated user.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 * @returns All the data for the user
 */
export const getDashboard = async (
	token: Token,
	login: Login,
	options: RequestOptions & {
		lastUpdate: Date | number | string;
		oldDashboard?: Dashboard;
	}
) => {
	const { body } = await apiRequest<APIDashboard>(
		"dashboard/dashboard",
		token,
		{
			body: {
				dataultimoaggiornamento: formatDate(options.lastUpdate),
				opzioni: JSON.stringify(login.options),
			},
			method: "POST",
			login,
			debug: options.debug,
			headers: options.headers,
		}
	);

	if (!body.success) throw new Error(body.msg!);
	const value =
		options.oldDashboard?.patch(body.data.dati[0]) ??
		new Dashboard(body.data.dati[0]);

	void writeToFile("dashboard", value);
	return value;
};

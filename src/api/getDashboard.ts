import { buildDashboard } from "../builders";
import type { APIDashboard, Dashboard, Login, Token } from "../types";
import { apiRequest, formatDate, writeToFile } from "../util";

/**
 * Fetch all the data for the authenticated user.
 * @param token - The token data
 * @param login - The login data
 * @returns All the data for the user
 */
export const getDashboard = async (
	token: Token,
	login: Login,
	lastUpdate: Date | number | string,
	oldDashboard?: Dashboard
) => {
	const { res, body } = await apiRequest<APIDashboard>(
		"dashboard/dashboard",
		token,
		login,
		{
			body: {
				dataultimoaggiornamento: formatDate(lastUpdate),
				opzioni: JSON.stringify(login.options),
			},
			method: "POST",
		}
	);

	if (!body.success)
		throw new Error(
			body.msg ??
				`An error occurred while requesting the profile. Status code: ${res.statusCode}`
		);
	const value = buildDashboard(body, oldDashboard);

	void writeToFile("dashboard", value);
	return value;
};

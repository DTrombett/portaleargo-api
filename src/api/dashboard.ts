import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildDashboard } from "../builders";
import type { APIDashboard, Login, Token } from "../types";
import { AuthFolder, apiRequest, formatDate } from "../util";

/**
 * Fetch all the data for the authenticated user.
 * @param token - The token data
 * @param login - The login data
 * @returns All the data for the user
 */
export const dashboard = async (
	token: Token,
	login: Login,
	lastUpdate: Date | number | string
) => {
	const { res, body } = await apiRequest<APIDashboard>(
		"https://www.portaleargo.it/appfamiglia/api/rest/dashboard/dashboard",
		token,
		login,
		{
			body: {
				// TODO: change this using profile.year.startDate
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
	const value = buildDashboard(body);

	writeFile(join(AuthFolder, "dashboard.json"), JSON.stringify(value)).catch(
		console.error
	);
	return value;
};
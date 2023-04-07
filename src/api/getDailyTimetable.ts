import { buildDailyTimetable } from "../builders";
import type { APIDailyTimetable, Login, RequestOptions, Token } from "../types";
import { apiRequest, formatDate } from "../util";

/**
 * Get the daily timetable data.
 * @param token - The token data
 * @param login - The login data
 * @param options - Additional options for the request
 */
export const getDailyTimetable = async (
	token: Token,
	login: Login,
	options?: RequestOptions & {
		year?: number;
		month?: number;
		day?: number;
	}
) => {
	const now = new Date();
	const { body } = await apiRequest<APIDailyTimetable>("orario-giorno", token, {
		method: "POST",
		body: {
			datGiorno: formatDate(
				`${options?.year ?? now.getFullYear()}-${
					options?.month ?? now.getMonth() + 1
				}-${options?.day ?? now.getDate() + 1}`
			),
		},
		login,
		debug: options?.debug,
		headers: options?.headers,
	});

	if (!body.success) throw new Error(body.msg!);
	return buildDailyTimetable(body);
};

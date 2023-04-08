import type { APICorsiRecupero, CorsiRecupero } from "../types";

/**
 * Build the corsi recupero data.
 * @param body - The API response
 * @returns The new data
 */
export const buildCorsiRecupero = (body: APICorsiRecupero): CorsiRecupero => {
	const { data } = body;

	return {
		corsiRecupero: data.corsiRecupero,
		periodi: data.periodi,
	};
};

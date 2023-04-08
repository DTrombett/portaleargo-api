import type { APIPCTO, PCTO } from "../types";

/**
 * Build the PCTO data.
 * @param body - The API response
 * @returns The new data
 */
export const buildPCTO = (body: APIPCTO): PCTO => {
	const {
		data: { pcto },
	} = body;

	return pcto.map((a) => ({
		percorsi: a.percorsi,
	}));
};

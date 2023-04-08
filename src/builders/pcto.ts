import type { APIPCTO, PCTO } from "../types";

/**
 * Elabora i dati del PCTO.
 * @param body - The API response
 * @returns The new data
 */
export const buildPCTO = (body: APIPCTO): PCTO => {
	const {
		data: { pcto },
	} = body;

	return pcto.flatMap((a) => a.percorsi as unknown[]);
};

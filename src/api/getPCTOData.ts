import type { APIPCTO, Client } from "..";
import { apiRequest } from "..";

/**
 * Ottieni i dati del PCTO dello studente.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const getPCTOData = async (
	client: Client,
	options: {
		id: string;
	}
) => {
	const { body } = await apiRequest<APIPCTO>("pcto", client, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return body.data.pcto;
};

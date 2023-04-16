import type { APIBacheca, Client } from "..";
import { EventoBacheca, apiRequest, handleOperation } from "..";

/**
 * Ottieni lo storico della bacheca.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const getStoricoBacheca = async (
	client: Client,
	options: {
		id: string;
	}
) => {
	const { body } = await apiRequest<APIBacheca>("storicobacheca", client, {
		method: "POST",
		body: {
			pkScheda: options.id,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return handleOperation(
		body.data.bacheca,
		undefined,
		(a) => new EventoBacheca(a, client)
	);
};

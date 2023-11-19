import type { APIWhat, Client } from "..";
import { apiRequest, formatDate } from "..";
import { validateWhat } from "../schemas";

/**
 * Richiedi i dati generali.
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 * @returns I dati
 */
export const what = async (
	client: Client,
	options: {
		lastUpdate: Date | number | string;
		old?: APIWhat["data"]["dati"][number];
	},
) => {
	const authToken = JSON.stringify([client.loginData?.token]);
	const { body } = await apiRequest<APIWhat>("dashboard/what", client, {
		method: "POST",
		body: {
			dataultimoaggiornamento: formatDate(options.lastUpdate),
			opzioni:
				client.loginData &&
				JSON.stringify(
					Object.fromEntries(
						client.loginData.opzioni.map((a) => [a.chiave, a.valore]),
					),
				),
			"lista-x-auth-token": authToken,
			"lista-x-auth-token-account": authToken,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	if (!client.noTypeCheck) validateWhat(body);
	return Object.assign(options.old ?? {}, body.data.dati[0]);
};

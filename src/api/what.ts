import type { APIWhat, Client } from "..";
import { What, apiRequest, formatDate } from "..";

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
		old?: What;
	},
) => {
	const authToken = JSON.stringify([client.loginData?.token]);
	const { body } = await apiRequest<APIWhat>("dashboard/what", client, {
		method: "POST",
		body: {
			dataultimoaggiornamento: formatDate(options.lastUpdate),
			opzioni: JSON.stringify(client.loginData?.opzioni),
			"lista-x-auth-token": authToken,
			"lista-x-auth-token-account": authToken,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return (
		options.old?.patch(body.data.dati[0]) ?? new What(body.data.dati[0], client)
	);
};

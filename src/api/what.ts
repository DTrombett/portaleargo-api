import type { APIWhat, Client } from "..";
import { What, apiRequest, formatDate } from "..";

/**
 * Get the what data.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const what = async (
	client: Client,
	options: {
		lastUpdate: Date | number | string;
	}
) => {
	const authToken = JSON.stringify([client.loginData?.token]);
	const { body } = await apiRequest<APIWhat>("dashboard/what", client, {
		method: "POST",
		body: {
			dataultimoaggiornamento: formatDate(options.lastUpdate),
			opzioni: JSON.stringify(client.loginData?.options),
			"lista-x-auth-token": authToken,
			"lista-x-auth-token-account": authToken,
		},
	});

	if (!body.success) throw new Error(body.msg!);
	return new What(body.data.dati[0], client);
};

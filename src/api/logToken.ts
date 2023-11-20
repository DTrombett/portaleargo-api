import type { APIResponse, Client, Token } from "..";
import { apiRequest, formatDate } from "../util";

/**
 * Registra il token
 * @param client - Il client
 * @param options - Altre opzioni della richiesta
 */
export const logToken = async (
	client: Client,
	options: { oldToken: Token; isWhat?: boolean },
) => {
	const { body } = await apiRequest<APIResponse>("logtoken", client, {
		method: "POST",
		body: {
			bearerOld: options.oldToken.access_token,
			dateExpOld: formatDate(options.oldToken.expireDate),
			refreshOld: options.oldToken.refresh_token,
			bearerNew: client.token?.access_token,
			dateExpNew:
				client.token?.expireDate && formatDate(client.token.expireDate),
			refreshNew: client.token?.refresh_token,
			isWhat: (options.isWhat ?? false).toString(),
			isRefreshed: (
				client.token?.access_token === options.oldToken.access_token
			).toString(),
			proc: "initState_global_random_12345",
		},
	});

	if (!body.success) throw new Error(body.msg!);
};

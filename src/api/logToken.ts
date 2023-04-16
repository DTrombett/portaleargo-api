import type { APIResponse, Client, Token } from "..";
import { apiRequest, formatDate } from "..";

/**
 * Log the token.
 * @param client - The client
 * @param options - Additional options for the request
 */
export const logToken = async (
	client: Client,
	options: { oldToken: Token; isWhat?: boolean }
) => {
	const { body } = await apiRequest<APIResponse>("logtoken", client, {
		method: "POST",
		body: {
			bearerOld: options.oldToken.accessToken,
			dateExpOld: formatDate(options.oldToken.expireDate),
			refreshOld: options.oldToken.refreshToken,
			bearerNew: client.token?.accessToken,
			dateExpNew:
				client.token?.expireDate && formatDate(client.token.expireDate),
			refreshNew: client.token?.refreshToken,
			isWhat: (options.isWhat ?? false).toString(),
			isRefreshed: (
				client.token?.accessToken === options.oldToken.accessToken
			).toString(),
			proc: "initState_global_random_12345",
		},
	});

	if (!body.success) throw new Error(body.msg!);
};

import type { Client, HttpMethod, Json } from "..";
import { formatDate } from ".";

/**
 * Effettua una richiesta API.
 * @param path - Il percorso della richiesta
 * @param client - Il client
 * @param options - Altre opzioni
 * @returns La risposta
 */
export const apiRequest = async <T extends Json, R extends boolean = false>(
	path: string,
	client: Client,
	options: Partial<{
		body: Json;
		method: HttpMethod;
		noWaitAfter: R;
	}> = {},
) => {
	options.method ??= "GET";
	const headers: Record<string, string> = {
		accept: "application/json",
		"argo-client-version": client.version,
		authorization: `Bearer ${client.token?.access_token ?? ""}`,
		"content-type": "application/json; charset=utf-8",
		...client.headers,
	};

	if (client.loginData) {
		headers["x-auth-token"] = client.loginData.token;
		headers["x-cod-min"] = client.loginData.codMin;
	}
	if (client.token)
		headers["x-date-exp-auth"] = formatDate(client.token.expireDate);
	const res = await fetch(
		`https://www.portaleargo.it/appfamiglia/api/rest/${path}`,
		{
			headers,
			method: options.method,
			body:
				options.method === "POST" ? JSON.stringify(options.body) : undefined,
		},
	);
	if (client.debug) console.log(`${options.method} /${path} ${res.status}`);
	const result = {
		res,
	} as {
		res: typeof res;
		body: R extends true ? undefined : T;
	};

	if (options.noWaitAfter !== true) {
		const text = await res.text();

		try {
			result.body = JSON.parse(text);
		} catch (err) {
			throw new TypeError(
				`${options.method} /${path} failed with status code ${res.status}`,
				{
					cause: text,
				},
			);
		}
	}
	return result;
};

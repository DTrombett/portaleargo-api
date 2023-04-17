import { request } from "undici";
import type { Client, HttpMethod, Json } from "..";
import { formatDate } from "..";

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
	options?: Partial<{
		body: Json;
		method: HttpMethod;
		noWaitAfter: R;
	}>
) => {
	const res = await request(
		`https://www.portaleargo.it/appfamiglia/api/rest/${path}`,
		{
			headers: {
				accept: "application/json",
				"argo-client-version": "1.15.1",
				authorization: `Bearer ${client.token?.accessToken ?? ""}`,
				"content-type": "application/json; charset=utf-8",
				"x-auth-token": client.loginData?.token,
				"x-cod-min": client.loginData?.schoolCode,
				"x-date-exp-auth":
					client.token?.expireDate && formatDate(client.token.expireDate),
				...client.headers,
			},
			method: options?.method,
			body:
				options?.method === "POST" ? JSON.stringify(options.body) : undefined,
		}
	);
	if (client.debug)
		console.log(`${options?.method ?? "GET"} /${path} ${res.statusCode}`);
	const result = {
		res,
	} as {
		res: typeof res;
		body: R extends true ? undefined : T;
	};

	if (options?.noWaitAfter !== true) result.body = await res.body.json();
	return result;
};

import { URLSearchParams } from "node:url";
import { request } from "undici";
import type { Client } from "..";
import { Token, clientId } from "..";

/**
 * Ottieni il token tramite l'API.
 * @param code - Il codice da usare
 * @param codeVerifier - Il code verifier
 * @param client - Il client
 * @returns I dati
 */
export const getToken = async (
	client: Client,
	options: {
		code: string;
		codeVerifier: string;
	}
) => {
	const res = await request("https://auth.portaleargo.it/oauth2/token", {
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			code: options.code,
			grant_type: "authorization_code",
			redirect_uri: "it.argosoft.didup.famiglia.new://login-callback",
			code_verifier: options.codeVerifier,
			client_id: clientId,
		}).toString(),
		method: "POST",
	});
	const data = await res.body.json();
	const date = new Date(res.headers.date as string);

	if (!client.token?.patch(data, date))
		client.token = new Token(data, client, date);
	void client.dataProvider?.write("token", client.token);
	return client.token;
};

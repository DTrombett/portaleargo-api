import type { APIToken, Client } from "..";
import { clientId } from "../util";
import { validateToken } from "../schemas";

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
	},
) => {
	const res = await fetch("https://auth.portaleargo.it/oauth2/token", {
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
	const data: APIToken = await res.json();
	const expireDate = new Date(res.headers.get("date")!);

	expireDate.setSeconds(expireDate.getSeconds() + data.expires_in);
	client.token = Object.assign(client.token ?? {}, data, { expireDate });
	void client.dataProvider?.write("token", client.token);
	if (!client.noTypeCheck) validateToken(data);
	return client.token;
};

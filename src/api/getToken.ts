import { URLSearchParams } from "node:url";
import { request } from "undici";
import type { Client } from "..";
import { Token, clientId, writeToFile } from "..";

/**
 * Get the token from the API.
 * @param code - The code to use
 * @param codeVerifier - The code verifier to use
 * @param client - The client
 * @returns The data for the login
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
	const value =
		client.token?.patch(data, date) ?? new Token(data, client, date);

	void writeToFile("token", value);
	return value;
};

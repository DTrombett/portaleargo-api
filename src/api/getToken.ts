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
	code: string,
	codeVerifier: string,
	client: Client
) => {
	const res = await request("https://auth.portaleargo.it/oauth2/token", {
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			code,
			grant_type: "authorization_code",
			redirect_uri: "it.argosoft.didup.famiglia.new://login-callback",
			code_verifier: codeVerifier,
			client_id: clientId,
		}).toString(),
		method: "POST",
	});
	const value = new Token(
		await res.body.json(),
		client,
		new Date(res.headers.date as string)
	);

	void writeToFile("token", value);
	return value;
};

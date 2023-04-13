import { URLSearchParams } from "node:url";
import { request } from "undici";
import { Token } from "../structures";
import type { APIToken } from "../types";
import { clientId, writeToFile } from "../util";

/**
 * Get the token from the API.
 * @param code - The code to use
 * @param codeVerifier - The code verifier to use
 * @returns The data for the login
 */
export const getToken = async (code: string, codeVerifier: string) => {
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
		(await res.body.json()) as APIToken,
		new Date(res.headers.date as string)
	);

	void writeToFile("token", value);
	return value;
};

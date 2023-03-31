import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { URLSearchParams } from "node:url";
import { request } from "undici";
import { buildToken } from "../builders";
import { AuthFolder, clientId } from "../util";

/**
 * Get the token from the API.
 * @param code - The code to use
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
	const value = buildToken(
		await res.body.json(),
		new Date(res.headers.date as string)
	);

	writeFile(join(AuthFolder, "token.json"), JSON.stringify(value)).catch(
		console.error
	);
	return value;
};

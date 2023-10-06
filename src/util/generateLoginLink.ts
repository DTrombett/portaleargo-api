import type { LoginLink } from "..";
import { clientId, encryptCodeVerifier, randomString } from "..";

/**
 * Genera un link per il login tramite browser.
 * @param param0 - Le opzioni per generare il link
 * @returns L'url generato con gli altri dati utilizzati
 */
export const generateLoginLink = ({
	redirectUri = "it.argosoft.didup.famiglia.new://login-callback",
	scopes = ["openid", "offline", "profile", "user.roles", "argo"],
	codeVerifier = randomString(43),
	challenge = encryptCodeVerifier(codeVerifier),
	id = clientId,
	state = randomString(22),
	nonce = randomString(22),
}: {
	redirectUri?: string;
	scopes?: string[];
	codeVerifier?: string;
	challenge?: string;
	id?: string;
	state?: string;
	nonce?: string;
} = {}): LoginLink => ({
	url: `https://auth.portaleargo.it/oauth2/auth?redirect_uri=${encodeURIComponent(
		redirectUri,
	)}&client_id=${id}&response_type=code&prompt=login&state=${state}&nonce=${nonce}&scope=${encodeURIComponent(
		scopes.join(" "),
	)}&code_challenge=${challenge}&code_challenge_method=S256`,
	redirectUri,
	scopes,
	codeVerifier,
	challenge,
	clientId: id,
	state,
	nonce,
});

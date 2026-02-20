import { CookieAgent } from "http-cookie-agent/undici";
import { ok } from "node:assert";
import { URL, URLSearchParams } from "node:url";
import { interceptors, request } from "undici";
import type { Credentials } from "../types";
import { clientId } from "./Constants";
import { jar } from "./cookies";
import { generateLoginLink } from "./generateLoginLink";

export const getCode = async (credentials: Credentials) => {
	const link = await generateLoginLink();

	const dispatcher = new CookieAgent({
		allowH2: true,
		autoSelectFamily: true,
		autoSelectFamilyAttemptTimeout: 1,
		cookies: { jar },
	}).compose(
		interceptors.retry(),
		interceptors.redirect({ maxRedirections: 0 }),
	);

	// STEP 1 ─ redirect a login
	const response = await request(link.url, { dispatcher });
	const loginUrl = response.headers.location;
	ok(typeof loginUrl === "string", "Invalid login url");

	const loginChallenge = new URL(loginUrl).searchParams.get("login_challenge");
	ok(loginChallenge, "Invalid login challenge");

	// STEP 2 ─ login POST
	const loginResponse = await request(
		"https://www.portaleargo.it/auth/sso/login",
		{
			dispatcher,
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				challenge: loginChallenge,
				client_id: clientId,
				famiglia_customer_code: credentials.schoolCode,
				login: "true",
				password: credentials.password,
				username: credentials.username,
			}).toString(),
		},
	);

	const authUrl = loginResponse.headers.location;
	ok(typeof authUrl === "string", "Invalid login redirect");

	const code_challenge = new URL(authUrl).searchParams.get("code_challenge");
	ok(typeof code_challenge === "string", "Invalid code challenge");

	// STEP 3 ─ GET consent page
	const consentPageResponse = await request(authUrl, { dispatcher });
	const consentUrl = consentPageResponse.headers.location;
	ok(typeof consentUrl === "string", "Invalid consent redirect");

	const consentChallenge = new URL(consentUrl).searchParams.get(
		"consent_challenge",
	);
	ok(consentChallenge, "Invalid consent challenge");

	// STEP 4 ─ POST consent (fast-path)
	const params = new URLSearchParams();
	params.append("challenge", consentChallenge);
	params.append("grant_scope", "openid");
	params.append("grant_scope", "offline");
	params.append("grant_scope", "profile");
	params.append("grant_scope", "user.roles");
	params.append("grant_scope", "argo");
	params.append("consent", "Accetta");

	const consentResponse = await request(
		"https://www.portaleargo.it/auth/sso/consent",
		{
			dispatcher,
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body: params.toString(),
		},
	);

	// STEP 5 ─ follow redirect with consent_verifier
	const authAfterConsentUrl = consentResponse.headers.location;
	ok(
		typeof authAfterConsentUrl === "string",
		"Invalid auth redirect after consent",
	);

	const finalResponse = await request(authAfterConsentUrl, { dispatcher });

	const finalRedirect = finalResponse.headers.location;
	ok(typeof finalRedirect === "string", "Invalid final redirect");

	// STEP 6 ─ extract code
	const code = new URL(finalRedirect).searchParams.get("code");
	ok(code, "Invalid login code");

	return { ...link, code };
};

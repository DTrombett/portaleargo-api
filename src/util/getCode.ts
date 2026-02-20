import { CookieAgent } from "http-cookie-agent/undici";
import { ok } from "node:assert/strict";
import { URL, URLSearchParams } from "node:url";
import { CookieJar } from "tough-cookie";
import { Dispatcher, interceptors, request } from "undici";
import type { Credentials } from "../types";
import { clientId } from "./Constants";
import { generateLoginLink } from "./generateLoginLink";

/**
 * Ottieni il codice per il login.
 * @param credentials - Le credenziali per l'accesso
 * @returns I dati del codice da usare
 */
export const getCode = async (credentials: Credentials) => {
	const link = await generateLoginLink();
	const dispatcher = new CookieAgent({
		allowH2: true,
		autoSelectFamily: true,
		cookies: { jar: new CookieJar() },
	}).compose(
		interceptors.retry(),
		interceptors.redirect({ maxRedirections: 3 }),
	);
	let res: Dispatcher.ResponseData;

	res = await request(link.url, { dispatcher });
	// strictEqual(res.statusCode, 200, "Failed to request login url");
	const url = res.headers.location;
	ok(typeof url === "string", await res.body.text());
	const challenge = new URL(url).searchParams.get("login_challenge");
	ok(challenge, "Invalid login challenge");
	res = await request("https://www.portaleargo.it/auth/sso/login", {
		dispatcher,
		body: new URLSearchParams({
			challenge,
			client_id: clientId,
			famiglia_customer_code: credentials.schoolCode,
			login: "true",
			password: credentials.password,
			username: credentials.username,
		}).toString(),
		headers: { "content-type": "application/x-www-form-urlencoded" },
		method: "POST",
	});
	const { location } = res.headers;
	ok(typeof location === "string", "Invalid login redirect");
	const code = new URL(location).searchParams.get("code");
	ok(code, "Invalid login code");
	return { ...link, code };
};

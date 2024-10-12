import type undici from "undici";
import { clientId, generateLoginLink } from ".";
import type { Credentials } from "..";

/**
 * Ottieni il codice per il login.
 * @param credentials - Le credenziali per l'accesso
 * @returns I dati del codice da usare
 */
export const getCode = async (credentials: Credentials) => {
	const { request } = require("undici") as typeof undici;
	const link = await generateLoginLink();
	const res = await request(link.url);
	const cookies: string[] = [];
	const url = res.headers.location;
	let cookieHeaders = res.headers["set-cookie"];

	if (typeof url !== "string")
		throw new TypeError(
			`Auth request returned an invalid redirect url with status code ${res.statusCode}`,
			{ cause: await res.body.text().catch((err: unknown) => err) },
		);
	if (typeof cookieHeaders === "string") cookieHeaders = [cookieHeaders];
	for (const c of cookieHeaders ?? []) {
		const [cookie] = c.split(";");

		if (cookie != null) cookies.push(cookie);
	}
	const challenge = new URL(url).searchParams.get("login_challenge")!;
	const res1 = await request("https://www.portaleargo.it/auth/sso/login", {
		body: `challenge=${challenge}&client_id=${clientId}&prefill=false&famiglia_customer_code=${encodeURIComponent(
			credentials.schoolCode,
		)}&username=${encodeURIComponent(
			credentials.username,
		)}&password=${encodeURIComponent(credentials.password)}&login=true`,
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		method: "POST",
	});
	const url1 = res1.headers.location;

	if (typeof url1 !== "string")
		throw new TypeError(
			`Login request returned an invalid redirect url with status code ${res1.statusCode}`,
			{ cause: await res1.body.text().catch((err: unknown) => err) },
		);
	const res2 = await request(url1, {
		headers: {
			cookie: cookies.join("; "),
		},
	});
	const url2 = res2.headers.location;

	if (typeof url2 !== "string")
		throw new TypeError(
			`First redirect returned an invalid redirect url with status code ${res2.statusCode}`,
			{ cause: await res2.body.text().catch((err: unknown) => err) },
		);
	cookieHeaders = res2.headers["set-cookie"];
	if (typeof cookieHeaders === "string") cookieHeaders = [cookieHeaders];
	for (const c of cookieHeaders ?? []) {
		const [cookie] = c.split(";");

		if (cookie != null) cookies.push(cookie);
	}
	const res3 = await request(url2);
	const url3 = res3.headers.location;

	if (typeof url3 !== "string")
		throw new TypeError(
			`Third redirect returned an invalid redirect url with status code ${res3.statusCode}`,
			{ cause: await res3.body.text().catch((err: unknown) => err) },
		);
	const res4 = await request(url3, {
		headers: {
			cookie: cookies.join("; "),
		},
	});
	const url4 = res4.headers.location;

	if (typeof url4 !== "string")
		throw new TypeError(
			`Last redirect returned an invalid redirect url with status code ${res4.statusCode}`,
			{ cause: await res4.body.text().catch((err: unknown) => err) },
		);
	const code = new URL(url4).searchParams.get("code");

	if (code == null)
		throw new TypeError(`Invalid code returned by API: ${url4}`);
	return { ...link, code };
};

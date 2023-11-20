import { request } from "undici";
import { clientId, generateLoginLink } from ".";
import type { Credentials } from "..";

const baseHeaders = {
	accept:
		"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
	"accept-encoding": "gzip, deflate, br",
	"sec-fetch-dest": "document",
	"sec-fetch-mode": "navigate",
	"sec-fetch-user": "?1",
	"upgrade-insecure-requests": "1",
	"user-agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.29 Safari/537.36",
} as const;

/**
 * Ottieni il codice per il login.
 * @param credentials - Le credenziali per l'accesso
 * @returns I dati del codice da usare
 */
export const getCode = async (credentials: Credentials) => {
	const link = generateLoginLink();
	const res = await request(link.url, {
		headers: {
			...baseHeaders,
			"sec-fetch-site": "none",
		},
		method: "GET",
	});
	const url = res.headers.location;
	const cookies: string[] = [];
	let cookieHeaders = res.headers["set-cookie"];

	if (typeof url !== "string")
		throw new TypeError(
			`Auth request returned an invalid redirect url with status code ${res.statusCode}`,
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
			...baseHeaders,
			"cache-control": "max-age=0",
			connection: "keep-alive",
			"content-type": "application/x-www-form-urlencoded",
			host: "www.portaleargo.it",
			origin: "https://www.portaleargo.it",
			referer: url,
			"sec-fetch-site": "same-origin",
		},
		method: "POST",
	});
	const url1 = res1.headers.location;

	if (typeof url1 !== "string")
		throw new TypeError(
			`Login request returned an invalid redirect url with status code ${res1.statusCode}`,
		);
	const res2 = await request(url1, {
		headers: {
			...baseHeaders,
			"cache-control": "max-age=0",
			cookie: cookies.join("; "),
			referer: "https://www.portaleargo.it/",
			"sec-fetch-site": "same-site",
		},
		method: "GET",
	});
	const url2 = res2.headers.location;

	if (typeof url2 !== "string")
		throw new TypeError(
			`First redirect returned an invalid redirect url with status code ${res2.statusCode}`,
		);
	cookieHeaders = res2.headers["set-cookie"];
	if (typeof cookieHeaders === "string") cookieHeaders = [cookieHeaders];
	for (const c of cookieHeaders ?? []) {
		const [cookie] = c.split(";");

		if (cookie != null) cookies.push(cookie);
	}
	const res3 = await request(url2, {
		headers: {
			...baseHeaders,
			"cache-control": "max-age=0",
			connection: "keep-alive",
			host: "www.portaleargo.it",
			referer: "https://www.portaleargo.it/",
			"sec-fetch-site": "same-site",
		},
		method: "GET",
	});
	const url3 = res3.headers.location;

	if (typeof url3 !== "string")
		throw new TypeError(
			`Third redirect returned an invalid redirect url with status code ${res3.statusCode}`,
		);
	const res4 = await request(url3, {
		headers: {
			...baseHeaders,
			"cache-control": "max-age=0",
			cookie: cookies.join("; "),
			referer: "https://www.portaleargo.it/",
			"sec-fetch-site": "same-site",
		},
		method: "GET",
	});
	const url4 = res4.headers.location;

	if (typeof url4 !== "string")
		throw new TypeError(
			`Last redirect returned an invalid redirect url with status code ${res4.statusCode}`,
		);
	const code = new URL(url4).searchParams.get("code");

	if (code == null)
		throw new TypeError(`Invalid code returned by API: ${url4}`);
	return { ...link, code };
};

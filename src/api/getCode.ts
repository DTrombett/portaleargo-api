import { URL } from "node:url";
import { request } from "undici";
import type { Credentials } from "..";
import { clientId, generateLoginLink } from "..";

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
	const url = generateLoginLink();
	const { headers, statusCode } = await request(url.url, {
		headers: {
			...baseHeaders,
			"sec-fetch-site": "none",
		},
		method: "GET",
	});
	const link = headers.location;
	const cookies: string[] = [];
	let cookieHeaders = headers["set-cookie"];

	if (typeof link !== "string")
		throw new TypeError(
			`Auth request returned an invalid redirect url with status code ${statusCode}`,
		);
	if (typeof cookieHeaders === "string") cookieHeaders = [cookieHeaders];
	for (const c of cookieHeaders ?? []) cookies.push(c.split(";")[0]);
	const challenge = new URL(link).searchParams.get("login_challenge")!;
	const {
		headers: { location },
		statusCode: status,
	} = await request("https://www.portaleargo.it/auth/sso/login", {
		body: `challenge=${challenge}&client_id=${clientId}&prefill=false&famiglia_customer_code=${credentials.schoolCode}&username=${credentials.username}&password=${credentials.password}&login=true`,
		headers: {
			...baseHeaders,
			"cache-control": "max-age=0",
			connection: "keep-alive",
			"content-type": "application/x-www-form-urlencoded",
			host: "www.portaleargo.it",
			origin: "https://www.portaleargo.it",
			referer: link,
			"sec-fetch-site": "same-origin",
		},
		method: "POST",
	});

	if (typeof location !== "string")
		throw new TypeError(
			`Login request returned an invalid redirect url with status code ${status}`,
		);
	const { headers: newHeaders, statusCode: newStatus } = await request(
		location,
		{
			headers: {
				...baseHeaders,
				"cache-control": "max-age=0",
				cookie: cookies.join("; "),
				referer: "https://www.portaleargo.it/",
				"sec-fetch-site": "same-site",
			},
			method: "GET",
		},
	);

	if (typeof newHeaders.location !== "string")
		throw new TypeError(
			`First redirect returned an invalid redirect url with status code ${newStatus}`,
		);
	cookieHeaders = newHeaders["set-cookie"];
	if (typeof cookieHeaders === "string") cookieHeaders = [cookieHeaders];
	for (const c of cookieHeaders ?? []) cookies.push(c.split(";")[0]);
	const {
		headers: { location: redirect },
		statusCode: middleStatus,
	} = await request(newHeaders.location, {
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

	if (typeof redirect !== "string")
		throw new TypeError(
			`Third redirect returned an invalid redirect url with status code ${middleStatus}`,
		);
	const {
		headers: { location: finalRedirect },
		statusCode: finalStatus,
	} = await request(redirect, {
		headers: {
			...baseHeaders,
			"cache-control": "max-age=0",
			cookie: cookies.join("; "),
			referer: "https://www.portaleargo.it/",
			"sec-fetch-site": "same-site",
		},
		method: "GET",
	});

	if (typeof finalRedirect !== "string")
		throw new TypeError(
			`Last redirect returned an invalid redirect url with status code ${finalStatus}`,
		);
	const code = new URL(finalRedirect).searchParams.get("code");

	if (code == null)
		throw new TypeError(`Invalid code returned by API: ${finalRedirect}`);
	return { ...url, code };
};

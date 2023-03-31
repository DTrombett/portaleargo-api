import { env } from "node:process";
import { chromium } from "playwright";
import { clientId, randomString } from "../util";

/**
 * Get the code for the login.
 * @returns The code to use for the login
 */
export const getCode = async (codeChallenge: string) => {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto(
		`https://auth.portaleargo.it/oauth2/auth?redirect_uri=it.argosoft.didup.famiglia.new%3A%2F%2Flogin-callback&client_id=${clientId}&response_type=code&prompt=login&state=${randomString(
			22
		)}&nonce=${randomString(
			22
		)}&scope=openid%20offline%20profile%20user.roles%20argo&code_challenge=${codeChallenge}&code_challenge_method=S256`
	);
	await page.getByLabel("Codice Scuola").first().fill(env.CODICE_SCUOLA!);
	await page.getByLabel("Nome Utente").fill(env.NOME_UTENTE!);
	await page.getByLabel("Password").fill(env.PASSWORD!);
	void page.getByRole("button", { name: "Entra" }).click({ noWaitAfter: true });
	const code = await new Promise<string | null>((resolve) => {
		page.on("response", (res) => {
			const { location } = res.headers();

			if (!location) return;
			const url = new URL(location);

			if (url.protocol === "it.argosoft.didup.famiglia.new:")
				resolve(url.searchParams.get("code"));
		});
	});

	void page.close().then(() => browser.close());
	if (code == null) throw new TypeError("Code not found");
	return code;
};

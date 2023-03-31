import { config } from "dotenv";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import {
	dashboard,
	getCode,
	getToken,
	logToken,
	login,
	profile,
	refreshToken,
	updateDate,
} from "./api";
import type { Dashboard, Login, Profile, Token } from "./types";
import {
	AuthFolder,
	encryptCodeVerifier,
	importData,
	randomString,
} from "./util";

config();
if (!existsSync(AuthFolder)) await mkdir(AuthFolder);
let oldToken: Token | undefined;
const token = await importData<Token>("token").then(async (data) => {
	if (data) {
		oldToken = data;
		if (data.expireDate <= Date.now()) {
			const l = await importData<Login>("login");

			if (l) return refreshToken(data, l);
		} else return data;
	}
	const codeVerifier = randomString(43);

	return getToken(
		await getCode(encryptCodeVerifier(codeVerifier)),
		codeVerifier
	);
});

const loginData = await importData<Login>("login").then(
	async (data) => data ?? login(token)
);

if (oldToken) await logToken(token, loginData, oldToken);
const profileData = await importData<Profile>("profile").then(
	async (data) => data ?? profile(token, loginData)
);

await dashboard(
	token,
	loginData,
	(await importData<Dashboard>("dashboard"))?.updateDate ??
		profileData.year.startDate
);
await updateDate(token, loginData);

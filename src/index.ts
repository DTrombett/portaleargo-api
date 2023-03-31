import { config } from "dotenv";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
	dashboard,
	getCode,
	getToken,
	login,
	profile,
	refreshToken,
} from "./api";
import type { Login, Profile, Token } from "./types";
import {
	AuthFolder,
	encryptCodeVerifier,
	importJson,
	randomString,
} from "./util";

config();
if (!existsSync(AuthFolder)) await mkdir(AuthFolder);
const token = await importJson<Token>(join(AuthFolder, "token.json")).then(
	async (data) => {
		if (data)
			if (data.expireDate <= Date.now()) {
				const l = await importJson<Login>(join(AuthFolder, "login.json"));

				if (l) return refreshToken(data, l);
			} else return data;
		const codeVerifier = randomString(43);

		return getToken(
			await getCode(encryptCodeVerifier(codeVerifier)),
			codeVerifier
		);
	}
);
const loginData = await importJson<Login>(join(AuthFolder, "login.json")).then(
	async (data) => data ?? login(token)
);
await importJson<Profile>(join(AuthFolder, "profile.json")).then(
	async (data) => data ?? profile(token, loginData)
);
const dashboardData = await dashboard(token, loginData);

console.log(dashboardData);

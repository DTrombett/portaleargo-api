import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import type { IncomingHttpHeaders } from "node:http";
import { env } from "node:process";
import { request } from "undici";
import {
	deleteProfile,
	downloadAttachment,
	downloadStudentAttachment,
	getCode,
	getDailyTimetable,
	getDashboard,
	getProfile,
	getToken,
	logToken,
	login,
	profileDetails,
	refreshToken,
	updateDate,
	what,
} from "./api";
import type { ClientOptions, Dashboard, Login, Profile, Token } from "./types";
import {
	AuthFolder,
	encryptCodeVerifier,
	importData,
	randomString,
	writeToFile,
} from "./util";

/**
 * A client to interact with the API
 */
export class Client {
	/**
	 * The school code
	 */
	schoolCode?: string;
	/**
	 * The username
	 */
	username?: string;
	/**
	 * The password
	 */
	password?: string;
	/**
	 * The token data
	 */
	token?: Token;
	/**
	 * The login data
	 */
	loginData?: Login;
	/**
	 * The profile data
	 */
	profile?: Profile;
	/**
	 * The dashboard data
	 */
	dashboard?: Dashboard;
	/**
	 * Whether to log some useful data
	 */
	debug: boolean;
	/**
	 * Additional HTTP headers for the request
	 */
	headers?: IncomingHttpHeaders;
	/**
	 * Whether the client is ready
	 */
	private ready = false;

	/**
	 * @param options - The options for the client
	 */
	constructor(options?: ClientOptions) {
		this.schoolCode = options?.schoolCode ?? env.CODICE_SCUOLA;
		this.password = options?.password ?? env.PASSWORD;
		this.username = options?.username ?? env.NOME_UTENTE;
		this.token = options?.token;
		this.loginData = options?.loginData;
		this.profile = options?.profile;
		this.dashboard = options?.dashboard;
		this.debug = options?.debug ?? false;
		this.headers = options?.headers;
	}

	/**
	 * Check if the client is ready.
	 * @returns Whether the client is ready
	 */
	isReady(): this is {
		token: Token;
		loginData: Login;
		profile: Profile;
	} {
		return this.ready;
	}

	/**
	 * Login to the API.
	 * @returns The login data
	 */
	async login() {
		await Promise.all([
			this.token ?? importData<Token>("token"),
			this.loginData ?? importData<Login>("login"),
			this.profile ?? importData<Profile>("profile"),
			this.dashboard ?? importData<Dashboard>("dashboard"),
			existsSync(AuthFolder) || mkdir(AuthFolder),
		]).then(([token, loginData, profile, dashboard]) => {
			this.token = token;
			this.loginData = loginData;
			this.profile = profile;
			this.dashboard = dashboard;
		});
		const oldToken = this.token;

		this.token = await this.refreshToken(oldToken);
		this.loginData =
			this.loginData ??
			(await login(this.token, {
				headers: this.headers,
				debug: this.debug,
			}));
		if (oldToken) {
			await logToken(this.token, this.loginData, {
				oldToken,
				debug: this.debug,
				headers: this.headers,
				isWhat: this.profile !== undefined,
			});
			if (this.profile) {
				this.ready = true;
				const whatData = await what(this.token, this.loginData, {
					debug: this.debug,
					headers: this.headers,
					lastUpdate:
						this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
				});

				if (whatData.profiloModificato || whatData.differenzaSchede)
					void writeToFile("profile", { ...this.profile, ...whatData.profilo });
				if (whatData.aggiornato) await this.getDashboard();
				return this.loginData;
			}
		}
		this.profile =
			this.profile ??
			(await getProfile(this.token, this.loginData, {
				debug: this.debug,
				headers: this.headers,
			}));
		this.ready = true;
		await this.getDashboard(true);
		return this.loginData;
	}

	/**
	 * Refresh a token if needed.
	 * @param token - The token to check
	 * @returns The new token
	 */
	async refreshToken(token?: Token) {
		if (!this.loginData || !token) return this.getToken();
		if (token.expireDate <= Date.now())
			return refreshToken(token, this.loginData, {
				debug: this.debug,
				headers: this.headers,
			});
		return token;
	}

	/**
	 * Get a token from the API.
	 * @returns The token
	 */
	async getToken() {
		if (
			this.password === undefined ||
			this.schoolCode === undefined ||
			this.username === undefined
		)
			throw new TypeError("School code, username or password are missing!");
		const codeVerifier = randomString(43);

		return getToken(
			await getCode(encryptCodeVerifier(codeVerifier), {
				password: this.password,
				schoolCode: this.schoolCode,
				username: this.username,
			}),
			codeVerifier
		);
	}

	/**
	 * Get the dashboard data from the API.
	 * * **NOTE**: this will force an API call.
	 * You can safely use `client.dashboard` which will provide data updated at login
	 * If you want to refresh the data `client.login()` is recommended
	 * @param suppressDateUpdate - Whether to suppress the date update
	 * @returns The dashboard data
	 */
	async getDashboard(suppressDateUpdate?: boolean) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		this.dashboard = await getDashboard(this.token, this.loginData, {
			lastUpdate:
				this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
			oldDashboard: this.dashboard,
			debug: this.debug,
			headers: this.headers,
		});
		if (suppressDateUpdate !== false)
			updateDate(this.token, this.loginData, {
				debug: this.debug,
				headers: this.headers,
			}).catch(console.error);
		return this.dashboard;
	}

	/**
	 * Delete this profile.
	 */
	async deleteProfile() {
		if (!this.token || !this.loginData)
			throw new Error("Client is not logged in!");
		await deleteProfile(this.token, this.loginData, {
			debug: this.debug,
			headers: this.headers,
		});
		delete this.token;
		delete this.loginData;
		delete this.profile;
		delete this.dashboard;
	}

	/**
	 * Get the profile details for the authenticated user.
	 * @returns The profile details
	 */
	async getProfileDetails() {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return profileDetails(this.token, this.loginData, {
			debug: this.debug,
			headers: this.headers,
		});
	}

	/**
	 * Get the timetable for a specific day.
	 * @param date - The date of the timetable
	 * @returns The daily timetable
	 */
	async getTimetable(date?: { year?: number; month?: number; day?: number }) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getDailyTimetable(this.token, this.loginData, {
			debug: this.debug,
			headers: this.headers,
			day: date?.day,
			month: date?.month,
			year: date?.year,
		});
	}

	/**
	 * Get the url to download an attachment.
	 * @param uid - The uid of the attachment
	 * @returns The download url
	 */
	async getAttachmentLink(uid: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return downloadAttachment(this.token, this.loginData, {
			uid,
			debug: this.debug,
			headers: this.headers,
		});
	}

	/**
	 * Download an attachment.
	 * @param uid - The uid of the attachment
	 * @param file - The path where the file should be saved
	 */
	async downloadAttachment(uid: string, file: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		const { body } = await request(await this.getAttachmentLink(uid));

		await writeFile(file, body);
	}

	/**
	 * Get the url to download a student attachment.
	 * @param uid - The uid of the attachment
	 * @returns The download url
	 */
	async getStudentAttachmentLink(uid: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return downloadStudentAttachment(this.token, this.loginData, {
			uid,
			id: this.profile.id,
			debug: this.debug,
			headers: this.headers,
		});
	}

	/**
	 * Download a student attachment.
	 * @param uid - The uid of the attachment
	 * @param file - The path where the file should be saved
	 */
	async downloadStudentAttachment(uid: string, file: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		const { body } = await request(await this.getStudentAttachmentLink(uid));

		await writeFile(file, body);
	}
}

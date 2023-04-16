import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import type { IncomingHttpHeaders } from "node:http";
import { env } from "node:process";
import { request } from "undici";
import type {
	ClientOptions,
	CorsiRecupero,
	DettagliProfilo,
	Ricevimenti,
} from ".";
import {
	AuthFolder,
	Dashboard,
	Login,
	Profilo,
	Token,
	aggiornaData,
	downloadAllegato,
	downloadAllegatoStudente,
	encryptCodeVerifier,
	getCode,
	getCorsiRecupero,
	getCurriculum,
	getDashboard,
	getDettagliProfilo,
	getOrarioGiornaliero,
	getPCTOData,
	getProfilo,
	getRicevimenti,
	getStoricoBacheca,
	getStoricoBachecaAlunno,
	getTasse,
	getToken,
	getVotiScrutinio,
	importData,
	logToken,
	login,
	randomString,
	refreshToken,
	rimuoviProfilo,
	what,
	writeToFile,
} from ".";

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
	profile?: Profilo;
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
		profile: Profilo;
	} {
		return this.ready;
	}

	/**
	 * Login to the API.
	 * @returns The dashboard data
	 */
	async login() {
		await Promise.all([
			this.token ? undefined : importData<Token>("token"),
			this.loginData ? undefined : importData<Login>("login"),
			this.profile ? undefined : importData<Profilo>("profile"),
			this.dashboard ? undefined : importData<Dashboard>("dashboard"),
			existsSync(AuthFolder) || mkdir(AuthFolder),
		]).then(([token, loginData, profile, dashboard]) => {
			if (token) this.token = new Token(token, this);
			if (loginData) this.loginData = new Login(loginData, this);
			if (profile) this.profile = new Profilo(profile, this);
			if (dashboard) this.dashboard = new Dashboard(dashboard, this);
		});
		const oldToken = this.token;

		this.token = await this.refreshToken();
		this.loginData = this.loginData ?? (await login(this));
		if (oldToken) {
			await logToken(this, {
				oldToken,
				isWhat: this.profile !== undefined,
			});
			if (this.profile) {
				this.ready = true;
				const whatData = await what(this, {
					lastUpdate:
						this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
				});

				if (whatData.profiloModificato || whatData.differenzaSchede)
					void writeToFile("profile", { ...this.profile, ...whatData.profilo });
				if (whatData.aggiornato || !this.dashboard) await this.getDashboard();
				aggiornaData(this).catch(console.error);
				return this.dashboard!;
			}
		}
		this.profile = this.profile ?? (await getProfilo(this));
		this.ready = true;
		return this.getDashboard();
	}

	/**
	 * Refresh a token if needed.
	 * @param token - The token to check
	 * @returns The new token
	 */
	async refreshToken() {
		if (!this.loginData || !this.token) return this.getToken();
		if (this.token.expireDate.getTime() <= Date.now())
			return refreshToken(this);
		return this.token;
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

		return getToken(this, {
			code: await getCode(encryptCodeVerifier(codeVerifier), {
				password: this.password,
				schoolCode: this.schoolCode,
				username: this.username,
			}),
			codeVerifier,
		});
	}

	/**
	 * Rimuovi il profilo.
	 */
	async rimuoviProfilo() {
		if (!this.token || !this.loginData)
			throw new Error("Client is not logged in!");
		await rimuoviProfilo(this);
		delete this.token;
		delete this.loginData;
		delete this.profile;
		delete this.dashboard;
	}

	/**
	 * Ottieni i dettagli del profilo dello studente.
	 * @returns The data
	 */
	async getDettagliProfilo<T extends DettagliProfilo>(old?: T) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getDettagliProfilo(this, {
			old,
		});
	}

	/**
	 * Ottieni l'orario giornaliero.
	 * @param date - The date of the timetable
	 * @returns The data
	 */
	async getOrarioGiornaliero(date?: {
		year?: number;
		month?: number;
		day?: number;
	}) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getOrarioGiornaliero(this, {
			day: date?.day,
			month: date?.month,
			year: date?.year,
		});
	}

	/**
	 * Ottieni il link per scaricare un allegato della bacheca.
	 * @param uid - The uid of the attachment
	 * @returns The url
	 */
	async getLinkAllegato(uid: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return downloadAllegato(this, {
			uid,
		});
	}

	/**
	 * Scarica un allegato.
	 * @param uid - The uid of the attachment
	 * @param file - The path where the file should be saved
	 */
	async downloadAllegato(uid: string, file: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		const { body } = await request(await this.getLinkAllegato(uid));

		await writeFile(file, body);
	}

	/**
	 * Ottieni il link per scaricare un allegato della bacheca alunno.
	 * @param uid - The uid of the attachment
	 * @param id - The profile id
	 * @returns The url
	 */
	async getLinkAllegatoStudente(uid: string, id?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return downloadAllegatoStudente(this, {
			uid,
			id: id ?? this.profile.id,
		});
	}

	/**
	 * Scarica un allegato dello studente.
	 * @param uid - The uid of the attachment
	 * @param file - The path where the file should be saved
	 * @param id - The profile id
	 */
	async downloadAllegatoStudente(uid: string, file: string, id?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		const { body } = await request(await this.getLinkAllegatoStudente(uid, id));

		await writeFile(file, body);
	}

	/**
	 * Ottieni i voti dello scrutinio dello studente.
	 * @returns The data
	 */
	async getVotiScrutinio() {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getVotiScrutinio(this);
	}

	/**
	 * Ottieni i dati riguardo i ricevimenti dello studente.
	 * @returns The data
	 */
	async getRicevimenti<T extends Ricevimenti>(old?: T) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getRicevimenti(this, { old });
	}

	/**
	 * Ottieni le tasse dello studente.
	 * @param id - The profile id
	 * @returns The data
	 */
	async getTasse(id?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getTasse(this, {
			id: id ?? this.profile.id,
		});
	}

	/**
	 * Ottieni i dati del PCTO dello studente.
	 * @param id - The profile id
	 * @returns The data
	 */
	async getPCTOData(id?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getPCTOData(this, {
			id: id ?? this.profile.id,
		});
	}

	/**
	 * Ottieni i dati dei corsi di recupero dello studente.
	 * @param id - The profile id
	 * @returns The data
	 */
	async getCorsiRecupero<T extends CorsiRecupero>(id?: string, old?: T) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getCorsiRecupero(this, {
			id: id ?? this.profile.id,
			old,
		});
	}

	/**
	 * Ottieni il curriculum dello studente.
	 * @param id - The profile id
	 * @returns The data
	 */
	async getCurriculum(id?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getCurriculum(this, {
			id: id ?? this.profile.id,
		});
	}

	/**
	 * Ottieni lo storico della bacheca.
	 * @param id - The profile id
	 * @returns The data
	 */
	async getStoricoBacheca(id: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getStoricoBacheca(this, {
			id,
		});
	}

	/**
	 * Ottieni lo storico della bacheca alunno.
	 * @param id - The profile id
	 * @returns The data
	 */
	async getStoricoBachecaAlunno(id: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getStoricoBachecaAlunno(this, {
			id,
		});
	}

	/**
	 * Get the dashboard data from the API.
	 * @private Use `client.dashboard` instead
	 * @returns The dashboard data
	 */
	private async getDashboard() {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getDashboard(this, {
			lastUpdate:
				this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
		});
	}
}

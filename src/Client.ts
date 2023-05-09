import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import type { IncomingHttpHeaders } from "node:http";
import { env } from "node:process";
import { request } from "undici";
import type {
	ClientOptions,
	CorsiRecupero,
	Credentials,
	DettagliProfilo,
	ReadyClient,
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
	refreshToken,
	rimuoviProfilo,
	what,
	writeToFile,
} from ".";

/**
 * Un client per interagire con l'API
 */
export class Client {
	/**
	 * I dati del token
	 */
	token?: Token;

	/**
	 * I dati del login
	 */
	loginData?: Login;

	/**
	 * I dati del profilo
	 */
	profile?: Profilo;

	/**
	 * I dati della dashboard
	 */
	dashboard?: Dashboard;

	/**
	 * Se scrivere nella console alcuni dati utili per il debug
	 */
	debug: boolean;

	/**
	 * Headers aggiuntivi per ogni richiesta API
	 */
	headers?: IncomingHttpHeaders;

	/**
	 * Il percorso della cartella dove salvare i dati
	 */
	dataPath?: string;

	#credentials?: Partial<Credentials>;
	#ready = false;

	/**
	 * @param options - Le opzioni per il client
	 */
	constructor(options?: ClientOptions) {
		this.#credentials = {
			schoolCode: options?.schoolCode ?? env.CODICE_SCUOLA,
			password: options?.password ?? env.PASSWORD,
			username: options?.username ?? env.NOME_UTENTE,
		};
		this.token = options?.token;
		this.loginData = options?.loginData;
		this.profile = options?.profile;
		this.dashboard = options?.dashboard;
		this.debug = options?.debug ?? false;
		this.headers = options?.headers;
		if (options?.dataPath !== null)
			this.dataPath = options?.dataPath ?? AuthFolder;
	}

	/**
	 * Controlla se il client è pronto
	 */
	isReady(): this is ReadyClient {
		return this.#ready;
	}

	/**
	 * Effettua il login.
	 * @returns Il client aggiornato
	 */
	async login() {
		await this.loadData();
		const oldToken = this.token;

		await this.refreshToken();
		if (!this.loginData) await login(this);
		if (oldToken) {
			await logToken(this, {
				oldToken,
				isWhat: this.profile !== undefined,
			});
			if (this.profile) {
				const whatData = await what(this, {
					lastUpdate:
						this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
				});

				if (
					(whatData.profiloModificato || whatData.differenzaSchede) &&
					this.dataPath !== undefined
				) {
					this.profile.patch(whatData.profilo);
					void writeToFile("profile", this.profile, this.dataPath);
				}
				this.#ready = true;
				if (whatData.aggiornato || !this.dashboard) await this.getDashboard();
				aggiornaData(this).catch(console.error);
				return this as ReadyClient & this & { dashboard: Dashboard };
			}
		}
		if (!this.profile) await getProfilo(this);
		this.#ready = true;
		await this.getDashboard();
		return this as ReadyClient & this & { dashboard: Dashboard };
	}

	/**
	 * Carica i dati salvati localmente.
	 */
	async loadData() {
		if (this.dataPath === undefined) return;
		const [token, loginData, profile, dashboard] = await Promise.all([
			this.token ? undefined : importData<Token>("token", this.dataPath),
			this.loginData ? undefined : importData<Login>("login", this.dataPath),
			this.profile ? undefined : importData<Profilo>("profile", this.dataPath),
			this.dashboard
				? undefined
				: importData<Dashboard>("dashboard", this.dataPath),
			existsSync(this.dataPath) || mkdir(this.dataPath),
		]);

		if (token) this.token = new Token(token, this);
		if (loginData) this.loginData = new Login(loginData, this);
		if (profile) this.profile = new Profilo(profile, this);
		if (dashboard) this.dashboard = new Dashboard(dashboard, this);
	}

	/**
	 * Aggiorna il client, se necessario.
	 * @returns Il nuovo token
	 */
	async refreshToken() {
		if (!this.token) return this.getToken();
		if (this.token.expireDate.getTime() <= Date.now())
			return refreshToken(this);
		return this.token;
	}

	/**
	 * Ottieni il token tramite l'API.
	 * @returns I dati del token
	 */
	async getToken() {
		if (
			[
				this.#credentials?.password,
				this.#credentials?.schoolCode,
				this.#credentials?.username,
			].includes(undefined)
		)
			throw new TypeError("Password, school code, or username missing");
		const code = await getCode(this.#credentials as Credentials);

		return getToken(this, {
			code: code.code,
			codeVerifier: code.codeVerifier,
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
	 * @returns I dati
	 */
	async getDettagliProfilo<T extends DettagliProfilo>(old?: T) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getDettagliProfilo(this, {
			old,
		});
	}

	/**
	 * Ottieni l'orario giornaliero.
	 * @param date - Il giorno dell'orario
	 * @returns I dati
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
	 * @param id - L'id dell'allegato
	 * @returns L'url
	 */
	async getLinkAllegato(id: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return downloadAllegato(this, {
			id,
		});
	}

	/**
	 * Scarica un allegato.
	 * @param id - L'id dell'allegato
	 * @param file - Il percorso dove salvare il file
	 */
	async downloadAllegato(id: string, file: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		const { body } = await request(await this.getLinkAllegato(id));

		await writeFile(file, body);
	}

	/**
	 * Ottieni il link per scaricare un allegato della bacheca alunno.
	 * @param id - l'id dell'allegato
	 * @param profileId - L'id del profilo
	 * @returns L'url
	 */
	async getLinkAllegatoStudente(id: string, profileId?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return downloadAllegatoStudente(this, {
			id,
			profileId: profileId ?? this.profile.id,
		});
	}

	/**
	 * Scarica un allegato dello studente.
	 * @param id - L'id dell'allegato
	 * @param file - Il percorso dove salvare il file
	 * @param profileId - L'id del profilo
	 */
	async downloadAllegatoStudente(id: string, file: string, profileId?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		const { body } = await request(
			await this.getLinkAllegatoStudente(id, profileId)
		);

		await writeFile(file, body);
	}

	/**
	 * Ottieni i voti dello scrutinio dello studente.
	 * @returns I dati
	 */
	async getVotiScrutinio() {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getVotiScrutinio(this);
	}

	/**
	 * Ottieni i dati riguardo i ricevimenti dello studente.
	 * @returns I dati
	 */
	async getRicevimenti<T extends Ricevimenti>(old?: T) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getRicevimenti(this, { old });
	}

	/**
	 * Ottieni le tasse dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getTasse(profileId?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getTasse(this, {
			profileId: profileId ?? this.profile.id,
		});
	}

	/**
	 * Ottieni i dati del PCTO dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getPCTOData(profileId?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getPCTOData(this, {
			profileId: profileId ?? this.profile.id,
		});
	}

	/**
	 * Ottieni i dati dei corsi di recupero dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getCorsiRecupero<T extends CorsiRecupero>(profileId?: string, old?: T) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getCorsiRecupero(this, {
			profileId: profileId ?? this.profile.id,
			old,
		});
	}

	/**
	 * Ottieni il curriculum dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getCurriculum(profileId?: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getCurriculum(this, {
			profileId: profileId ?? this.profile.id,
		});
	}

	/**
	 * Ottieni lo storico della bacheca.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getStoricoBacheca(profileId: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getStoricoBacheca(this, {
			profileId,
		});
	}

	/**
	 * Ottieni lo storico della bacheca alunno.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getStoricoBachecaAlunno(profileId: string) {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getStoricoBachecaAlunno(this, {
			profileId,
		});
	}

	/**
	 * Ottieni i dati della dashboard.
	 * @returns La dashboard
	 */
	private async getDashboard() {
		if (!this.isReady()) throw new Error("Client is not logged in!");
		return getDashboard(this, {
			lastUpdate:
				this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
		});
	}
}

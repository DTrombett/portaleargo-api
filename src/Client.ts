import { existsSync, mkdirSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import type { IncomingHttpHeaders } from "node:http";
import { env } from "node:process";
import { request } from "undici";
import type {
	APILogin,
	APIProfilo,
	ClientOptions,
	CorsiRecupero,
	Credentials,
	Dashboard,
	DettagliProfilo,
	ReadyClient,
	Ricevimenti,
	Token,
} from ".";
import {
	AuthFolder,
	aggiornaData,
	defaultVersion,
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
	getRicevutaTelematica,
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
	loginData?: APILogin["data"][number];

	/**
	 * I dati del profilo
	 */
	profile?: APIProfilo["data"];

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
	 * Le funzioni per leggere e scrivere i dati.
	 * Impostare questo valore forzerà `dataPath` a `null`
	 */
	dataProvider?: NonNullable<ClientOptions["dataProvider"]>;

	/**
	 * La versione di didUp da specificare nell'header.
	 * * Modificare questa opzione potrebbe creare problemi nell'utilizzo della libreria
	 */
	version: string;

	/**
	 * Le credenziali usate per l'accesso
	 */
	credentials?: Partial<Credentials>;

	#ready = false;

	/**
	 * @param options - Le opzioni per il client
	 */
	constructor(options: ClientOptions = {}) {
		this.credentials = {
			schoolCode: options.schoolCode ?? env.CODICE_SCUOLA,
			password: options.password ?? env.PASSWORD,
			username: options.username ?? env.NOME_UTENTE,
		};
		this.token = options.token;
		this.loginData = options.loginData;
		this.profile = options.profile;
		this.dashboard = options.dashboard;
		this.debug = options.debug ?? false;
		this.version = options.version ?? defaultVersion;
		this.headers = options.headers;
		if (options.dataProvider !== null) {
			options.dataPath ??= AuthFolder;
			if (!options.dataProvider && !existsSync(options.dataPath))
				mkdirSync(options.dataPath);
			this.dataProvider = options.dataProvider ?? {
				read: (name) => importData(name, options.dataPath!),
				write: (name, value) => writeToFile(name, value, options.dataPath!),
				reset: () => rm(options.dataPath!, { recursive: true, force: true }),
			};
		}
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

				if (whatData.profiloModificato || whatData.differenzaSchede) {
					Object.assign(this.profile, whatData.profilo);
					void this.dataProvider?.write("profile", this.profile);
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
		if (!this.dataProvider?.read) return;
		const [token, loginData, profile, dashboard] = await Promise.all([
			this.token ? undefined : this.dataProvider.read("token"),
			this.loginData ? undefined : this.dataProvider.read("login"),
			this.profile ? undefined : this.dataProvider.read("profile"),
			this.dashboard ? undefined : this.dataProvider.read("dashboard"),
		]);

		if (token)
			this.token = { ...token, expireDate: new Date(token.expireDate) };
		if (loginData) this.loginData = loginData;
		if (profile) this.profile = profile;
		if (dashboard)
			this.dashboard = {
				...dashboard,
				dataAggiornamento: new Date(dashboard.dataAggiornamento),
			};
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
				this.credentials?.password,
				this.credentials?.schoolCode,
				this.credentials?.username,
			].includes(undefined)
		)
			throw new TypeError("Password, school code, or username missing");
		const code = await getCode(this.credentials as Credentials);

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
		this.checkReady();
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
		this.checkReady();
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
		this.checkReady();
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
		this.checkReady();
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
		this.checkReady();
		return downloadAllegatoStudente(this, {
			id,
			profileId: profileId ?? this.profile.scheda.pk,
		});
	}

	/**
	 * Scarica un allegato dello studente.
	 * @param id - L'id dell'allegato
	 * @param file - Il percorso dove salvare il file
	 * @param profileId - L'id del profilo
	 */
	async downloadAllegatoStudente(id: string, file: string, profileId?: string) {
		this.checkReady();
		const { body } = await request(
			await this.getLinkAllegatoStudente(id, profileId),
		);

		await writeFile(file, body);
	}

	/**
	 * Ottieni i dati di una ricevuta telematica.
	 * @param iuv - L'iuv del pagamento
	 * @returns La ricevuta
	 */
	async getRicevuta(iuv: string) {
		this.checkReady();
		return getRicevutaTelematica(this, { iuv });
	}

	/**
	 * Scarica la ricevuta di un pagamento.
	 * @param iuv - L'iuv del pagamento
	 * @param file - Il percorso dove salvare il file
	 */
	async downloadRicevuta(iuv: string, file: string) {
		this.checkReady();
		const ricevuta = await this.getRicevuta(iuv);
		const { body } = await request(ricevuta.url);

		await writeFile(file, body);
	}

	/**
	 * Ottieni i voti dello scrutinio dello studente.
	 * @returns I dati
	 */
	async getVotiScrutinio() {
		this.checkReady();
		return getVotiScrutinio(this);
	}

	/**
	 * Ottieni i dati riguardo i ricevimenti dello studente.
	 * @returns I dati
	 */
	async getRicevimenti<T extends Ricevimenti>(old?: T) {
		this.checkReady();
		return getRicevimenti(this, { old });
	}

	/**
	 * Ottieni le tasse dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getTasse(profileId?: string) {
		this.checkReady();
		return getTasse(this, {
			profileId: profileId ?? this.profile.scheda.pk,
		});
	}

	/**
	 * Ottieni i dati del PCTO dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getPCTOData(profileId?: string) {
		this.checkReady();
		return getPCTOData(this, {
			profileId: profileId ?? this.profile.scheda.pk,
		});
	}

	/**
	 * Ottieni i dati dei corsi di recupero dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getCorsiRecupero<T extends CorsiRecupero>(profileId?: string, old?: T) {
		this.checkReady();
		return getCorsiRecupero(this, {
			profileId: profileId ?? this.profile.scheda.pk,
			old,
		});
	}

	/**
	 * Ottieni il curriculum dello studente.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getCurriculum(profileId?: string) {
		this.checkReady();
		return getCurriculum(this, {
			profileId: profileId ?? this.profile.scheda.pk,
		});
	}

	/**
	 * Ottieni lo storico della bacheca.
	 * @param profileId - L'id del profilo
	 * @returns I dati
	 */
	async getStoricoBacheca(profileId: string) {
		this.checkReady();
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
		this.checkReady();
		return getStoricoBachecaAlunno(this, {
			profileId,
		});
	}

	/**
	 * Ottieni i dati della dashboard.
	 * @returns La dashboard
	 */
	private async getDashboard() {
		this.checkReady();
		return getDashboard(this, {
			lastUpdate:
				this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
		});
	}

	private checkReady(): asserts this is ReadyClient {
		if (!this.isReady()) throw new Error("Client is not logged in!");
	}
}

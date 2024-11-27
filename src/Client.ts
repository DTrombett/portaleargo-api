import type {
	APIBacheca,
	APIBachecaAlunno,
	APICorsiRecupero,
	APICurriculum,
	APIDashboard,
	APIDettagliProfilo,
	APIDownloadAllegato,
	APILogin,
	APIOrarioGiornaliero,
	APIPCTO,
	APIProfilo,
	APIResponse,
	APIRicevimenti,
	APIRicevutaTelematica,
	APITasse,
	APIToken,
	APIVotiScrutinio,
	APIWhat,
	ClientOptions,
	Credentials,
	Dashboard,
	HttpMethod,
	Json,
	LoginLink,
	ReadyClient,
	Token,
} from ".";
import {
	validateBacheca,
	validateBachecaAlunno,
	validateCorsiRecupero,
	validateCurriculum,
	validateDashboard,
	validateDettagliProfilo,
	validateDownloadAllegato,
	validateLogin,
	validateOrarioGiornaliero,
	validatePCTO,
	validateProfilo,
	validateRicevimenti,
	validateRicevutaTelematica,
	validateTasse,
	validateToken,
	validateVotiScrutinio,
	validateWhat,
} from "./schemas";
import {
	clientId,
	defaultVersion,
	formatDate,
	getAuthFolder,
	getCode,
	getToken,
	handleOperation,
	importData,
	randomString,
	writeToFile,
} from "./util";

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
	headers?: Record<string, string>;

	/**
	 * Non controllare il tipo dei dati ricevuti dall'API.
	 * * Nota che il controllo dei dati viene fatto in maniera asincrona e non blocca o rallenta il processo
	 */
	noTypeCheck: boolean;

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
			schoolCode:
				options.schoolCode ??
				(typeof process === "undefined"
					? undefined
					: // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						process.env?.CODICE_SCUOLA),
			password:
				options.password ??
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				(typeof process === "undefined" ? undefined : process.env?.PASSWORD),
			username:
				options.username ??
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				(typeof process === "undefined" ? undefined : process.env?.NOME_UTENTE),
		};
		this.token = options.token;
		this.loginData = options.loginData;
		this.profile = options.profile;
		this.dashboard = options.dashboard;
		this.debug = options.debug ?? false;
		this.noTypeCheck = options.noTypeCheck ?? false;
		this.version = options.version ?? defaultVersion;
		this.headers = options.headers;
		if (options.dataProvider !== null)
			if (!(this.dataProvider = options.dataProvider))
				if (typeof localStorage !== "undefined")
					this.dataProvider = {
						read: async (name) => {
							const text = localStorage.getItem(name);

							if (text == null) return undefined;
							try {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-return
								return JSON.parse(text);
							} catch (err) {
								return undefined;
							}
						},
						write: async (name, value) => {
							try {
								const text = JSON.stringify(value);

								localStorage.setItem(name, text);
							} catch (err) {}
						},
						reset: async () => {
							localStorage.clear();
						},
					};
				else if (typeof process !== "undefined") {
					const fs = require("node:fs") as typeof import("node:fs");

					options.dataPath ??= getAuthFolder();
					let exists = fs.existsSync(options.dataPath);

					this.dataProvider = {
						read: (name) => importData(name, options.dataPath!),
						write: (name, value) => {
							if (!exists) {
								exists = true;
								fs.mkdirSync(options.dataPath!);
							}
							return writeToFile(name, value, options.dataPath!);
						},
						reset: () =>
							(
								require("node:fs/promises") as typeof import("node:fs/promises")
							).rm(options.dataPath!, { recursive: true, force: true }),
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
	 * Effettua una richiesta API.
	 * @param path - Il percorso della richiesta
	 * @param options - Altre opzioni
	 * @returns La risposta
	 */
	async apiRequest<T extends Json, R extends boolean = false>(
		path: string,
		options: Partial<{
			body: Json;
			method: HttpMethod;
			noWaitAfter: R;
		}> = {},
	) {
		options.method ??= "GET";
		const headers: Record<string, string> = {
			accept: "application/json",
			"argo-client-version": this.version,
			authorization: `Bearer ${this.token?.access_token ?? ""}`,
			"content-type": "application/json; charset=utf-8",
			...this.headers,
		};

		if (this.loginData) {
			headers["x-auth-token"] = this.loginData.token;
			headers["x-cod-min"] = this.loginData.codMin;
		}
		if (this.token)
			headers["x-date-exp-auth"] = formatDate(this.token.expireDate);
		const res = await fetch(
			`https://www.portaleargo.it/appfamiglia/api/rest/${path}`,
			{
				headers,
				method: options.method,
				body:
					options.method === "POST" ? JSON.stringify(options.body) : undefined,
			},
		);
		if (this.debug) console.log(`${options.method} /${path} ${res.status}`);
		const result = {
			res,
		} as {
			res: typeof res;
			body: R extends true ? undefined : T;
		};

		if (options.noWaitAfter !== true) {
			const text = await res.text();

			try {
				result.body = JSON.parse(text);
			} catch (err) {
				throw new TypeError(
					`${options.method} /${path} failed with status code ${res.status}: ${text}`,
				);
			}
		}
		return result;
	}

	/**
	 * Effettua il login.
	 * @returns Il client aggiornato
	 */
	async login() {
		await Promise.all([
			this.token && this.dataProvider?.write("token", this.token),
			this.loginData && this.dataProvider?.write("login", this.loginData),
			this.profile && this.dataProvider?.write("profile", this.profile),
			this.dashboard && this.dataProvider?.write("dashboard", this.dashboard),
		]);
		await this.loadData();
		const oldToken = this.token;

		await this.refreshToken();
		if (!this.loginData) await this.getLoginData();
		if (oldToken) {
			this.logToken({
				oldToken,
				isWhat: this.profile !== undefined,
			}).catch(console.error);
			if (this.profile) {
				const whatData = await this.what(
					this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
				);

				if (whatData.isModificato || whatData.differenzaSchede) {
					Object.assign(this.profile, whatData);
					void this.dataProvider?.write("profile", this.profile);
				}
				this.#ready = true;
				if (whatData.mostraPallino || !this.dashboard)
					await this.getDashboard();
				this.aggiornaData().catch(console.error);
				return this as ReadyClient & this & { dashboard: Dashboard };
			}
		}
		if (!this.profile) await this.getProfilo();
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
		if (this.token.expireDate.getTime() <= Date.now()) {
			const date = new Date();
			const { res, body } = await this.apiRequest<APIToken>(
				"auth/refresh-token",
				{
					method: "POST",
					body: {
						"r-token": this.token.refresh_token,
						"client-id": clientId,
						scopes: `[${this.token.scope.split(" ").join(", ")}]`,
						"old-bearer": this.token.access_token,
						"primo-accesso": "false",
						"ripeti-login": "false",
						"exp-bearer": formatDate(this.token.expireDate),
						"ts-app": formatDate(date),
						proc: "initState_global_random_12345",
						username: this.loginData?.username,
					},
				},
			);
			const expireDate = new Date(res.headers.get("date") ?? date);

			if ("error" in body)
				throw new Error(`${body.error} ${body.error_description}`);
			expireDate.setSeconds(expireDate.getSeconds() + body.expires_in);
			this.token = Object.assign(this.token, body, { expireDate });
			void this.dataProvider?.write("token", this.token);
			if (!this.noTypeCheck) validateToken(body);
		}
		return this.token;
	}

	/**
	 * Ottieni il token tramite l'API.
	 * @param code - The code for the access
	 * @returns I dati del token
	 */
	async getToken(code?: LoginLink & { code: string }) {
		if (!code) {
			if (
				[
					this.credentials?.password,
					this.credentials?.schoolCode,
					this.credentials?.username,
				].includes(undefined)
			)
				throw new TypeError("Password, school code, or username missing");
			code = await getCode(this.credentials as Credentials);
		}
		const { expireDate, ...token } = await getToken(code);

		this.token = Object.assign(this.token ?? {}, token, { expireDate });
		void this.dataProvider?.write("token", this.token);
		if (!this.noTypeCheck) validateToken(token);
		return this.token;
	}

	/**
	 * Rimuovi il profilo.
	 */
	async logOut() {
		if (!this.token || !this.loginData)
			throw new Error("Client is not logged in!");
		await this.rimuoviProfilo();
		delete this.token;
		delete this.loginData;
		delete this.profile;
		delete this.dashboard;
	}

	/**
	 * Ottieni i dettagli del profilo dello studente.
	 * @returns I dati
	 */
	async getDettagliProfilo<T extends APIDettagliProfilo["data"]>(old?: T) {
		this.checkReady();
		const { body } = await this.apiRequest<APIDettagliProfilo>(
			"dettaglioprofilo",
			{
				body: null,
				method: "POST",
			},
		);

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateDettagliProfilo(body);
		return Object.assign(old ?? {}, body.data);
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
		const now = new Date();
		const { body } = await this.apiRequest<APIOrarioGiornaliero>(
			"orario-giorno",
			{
				method: "POST",
				body: {
					datGiorno: formatDate(
						`${date?.year ?? now.getFullYear()}-${
							date?.month ?? now.getMonth() + 1
						}-${date?.day ?? now.getDate() + 1}`,
					),
				},
			},
		);

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateOrarioGiornaliero(body);
		return Object.values(body.data.dati).flat();
	}

	/**
	 * Ottieni il link per scaricare un allegato della bacheca.
	 * @param uid - L'uid dell'allegato
	 * @returns L'url
	 */
	async getLinkAllegato(uid: string) {
		this.checkReady();
		const { body } = await this.apiRequest<APIDownloadAllegato>(
			"downloadallegatobacheca",
			{
				method: "POST",
				body: { uid },
			},
		);

		if (!body.success) throw new Error(body.msg);
		if (!this.noTypeCheck) validateDownloadAllegato(body);
		return body.url;
	}

	/**
	 * Ottieni il link per scaricare un allegato della bacheca alunno.
	 * @param uid - l'uid dell'allegato
	 * @param pkScheda - L'id del profilo
	 * @returns L'url
	 */
	async getLinkAllegatoStudente(
		uid: string,
		pkScheda = this.profile?.scheda.pk,
	) {
		this.checkReady();
		const { body } = await this.apiRequest<APIDownloadAllegato>(
			"downloadallegatobachecaalunno",
			{
				method: "POST",
				body: { uid, pkScheda },
			},
		);

		if (!body.success) throw new Error(body.msg);
		if (!this.noTypeCheck) validateDownloadAllegato(body);
		return body.url;
	}

	/**
	 * Ottieni i dati di una ricevuta telematica.
	 * @param iuv - L'iuv del pagamento
	 * @returns La ricevuta
	 */
	async getRicevuta(iuv: string) {
		this.checkReady();
		const { body } = await this.apiRequest<APIRicevutaTelematica>(
			"ricevutatelematica",
			{
				method: "POST",
				body: { iuv },
			},
		);

		if (!body.success) throw new Error(body.msg);
		const { success, msg, ...rest } = body;

		if (!this.noTypeCheck) validateRicevutaTelematica(body);
		return rest;
	}

	/**
	 * Ottieni i voti dello scrutinio dello studente.
	 * @returns I dati
	 */
	async getVotiScrutinio() {
		this.checkReady();
		const { body } = await this.apiRequest<APIVotiScrutinio>("votiscrutinio", {
			method: "POST",
			body: {},
		});

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateVotiScrutinio(body);
		return body.data.votiScrutinio[0]?.periodi;
	}

	/**
	 * Ottieni i dati riguardo i ricevimenti dello studente.
	 * @returns I dati
	 */
	async getRicevimenti<T extends APIRicevimenti["data"]>(old?: T) {
		this.checkReady();
		const { body } = await this.apiRequest<APIRicevimenti>("ricevimento", {
			method: "POST",
			body: {},
		});

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateRicevimenti(body);
		return Object.assign(old ?? {}, body.data);
	}

	/**
	 * Ottieni le tasse dello studente.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getTasse(pkScheda = this.profile?.scheda.pk) {
		this.checkReady();
		const { body } = await this.apiRequest<APITasse>("listatassealunni", {
			method: "POST",
			body: { pkScheda },
		});

		if (!body.success) throw new Error(body.msg!);
		const { success, msg, data, ...rest } = body;

		if (!this.noTypeCheck) validateTasse(body);
		return {
			...rest,
			tasse: data,
		};
	}

	/**
	 * Ottieni i dati del PCTO dello studente.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getPCTOData(pkScheda = this.profile?.scheda.pk) {
		this.checkReady();
		const { body } = await this.apiRequest<APIPCTO>("pcto", {
			method: "POST",
			body: { pkScheda },
		});

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validatePCTO(body);
		return body.data.pcto;
	}

	/**
	 * Ottieni i dati dei corsi di recupero dello studente.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getCorsiRecupero<T extends APICorsiRecupero["data"]>(
		pkScheda = this.profile?.scheda.pk,
		old?: T,
	) {
		this.checkReady();
		const { body } = await this.apiRequest<APICorsiRecupero>("corsirecupero", {
			method: "POST",
			body: { pkScheda },
		});

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateCorsiRecupero(body);
		return Object.assign(old ?? {}, body.data);
	}

	/**
	 * Ottieni il curriculum dello studente.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getCurriculum(pkScheda = this.profile?.scheda.pk) {
		this.checkReady();
		const { body } = await this.apiRequest<APICurriculum>("curriculumalunno", {
			method: "POST",
			body: { pkScheda },
		});

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateCurriculum(body);
		return body.data.curriculum;
	}

	/**
	 * Ottieni lo storico della bacheca.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getStoricoBacheca(pkScheda: string) {
		this.checkReady();
		const { body } = await this.apiRequest<APIBacheca>("storicobacheca", {
			method: "POST",
			body: { pkScheda },
		});

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateBacheca(body);
		return handleOperation(body.data.bacheca);
	}

	/**
	 * Ottieni lo storico della bacheca alunno.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getStoricoBachecaAlunno(pkScheda: string) {
		this.checkReady();
		const { body } = await this.apiRequest<APIBachecaAlunno>(
			"storicobachecaalunno",
			{
				method: "POST",
				body: { pkScheda },
			},
		);

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateBachecaAlunno(body);
		return handleOperation(body.data.bachecaAlunno);
	}

	/**
	 * Ottieni i dati della dashboard.
	 * @returns La dashboard
	 */
	private async getDashboard() {
		this.checkReady();
		const date = new Date();
		const {
			body,
			res: { headers },
		} = await this.apiRequest<APIDashboard>("dashboard/dashboard", {
			body: {
				dataultimoaggiornamento: formatDate(
					this.dashboard?.dataAggiornamento ?? this.profile.anno.dataInizio,
				),
				opzioni: JSON.stringify(
					Object.fromEntries(
						(this.dashboard ?? this.loginData).opzioni.map((a) => [
							a.chiave,
							a.valore,
						]),
					),
				),
			},
			method: "POST",
		});

		if (!body.success) throw new Error(body.msg!);
		const [data] = body.data.dati;

		this.dashboard = Object.assign(
			(data.rimuoviDatiLocali ? null : this.dashboard) ?? {},
			{
				...data,
				fuoriClasse: handleOperation(
					data.fuoriClasse,
					data.rimuoviDatiLocali ? undefined : this.dashboard?.fuoriClasse,
				),
				promemoria: handleOperation(
					data.promemoria,
					data.rimuoviDatiLocali ? undefined : this.dashboard?.promemoria,
				),
				bacheca: handleOperation(
					data.bacheca,
					data.rimuoviDatiLocali ? undefined : this.dashboard?.bacheca,
				),
				voti: handleOperation(
					data.voti,
					data.rimuoviDatiLocali ? undefined : this.dashboard?.voti,
				),
				bachecaAlunno: handleOperation(
					data.bachecaAlunno,
					data.rimuoviDatiLocali ? undefined : this.dashboard?.bachecaAlunno,
				),
				registro: handleOperation(
					data.registro,
					data.rimuoviDatiLocali ? undefined : this.dashboard?.registro,
				),
				appello: handleOperation(
					data.appello,
					data.rimuoviDatiLocali ? undefined : this.dashboard?.appello,
				),
				prenotazioniAlunni: handleOperation(
					data.prenotazioniAlunni,
					data.rimuoviDatiLocali
						? undefined
						: this.dashboard?.prenotazioniAlunni,
					(a) => a.prenotazione.pk,
				),
				dataAggiornamento: new Date(headers.get("date") ?? date),
			},
		);
		void this.dataProvider?.write("dashboard", this.dashboard);
		if (!this.noTypeCheck) validateDashboard(body);
		return this.dashboard;
	}

	private async getProfilo() {
		const { body } = await this.apiRequest<APIProfilo>("profilo", {});

		if (!body.success) throw new Error(body.msg!);
		this.profile = Object.assign(this.profile ?? {}, body.data);
		void this.dataProvider?.write("profile", this.profile);
		if (!this.noTypeCheck) validateProfilo(body);
		return this.profile;
	}

	private async getLoginData() {
		const { body } = await this.apiRequest<APILogin>("login", {
			method: "POST",
			body: {
				"lista-opzioni-notifiche": "{}",
				"lista-x-auth-token": "[]",
				clientID: randomString(163),
			},
		});

		if (!body.success) throw new Error(body.msg!);
		this.loginData = Object.assign(this.loginData ?? {}, body.data[0]);
		void this.dataProvider?.write("login", this.loginData);
		if (!this.noTypeCheck) validateLogin(body);
		return this.loginData;
	}

	private async logToken(options: { oldToken: Token; isWhat?: boolean }) {
		const { body } = await this.apiRequest<APIResponse>("logtoken", {
			method: "POST",
			body: {
				bearerOld: options.oldToken.access_token,
				dateExpOld: formatDate(options.oldToken.expireDate),
				refreshOld: options.oldToken.refresh_token,
				bearerNew: this.token?.access_token,
				dateExpNew: this.token?.expireDate && formatDate(this.token.expireDate),
				refreshNew: this.token?.refresh_token,
				isWhat: (options.isWhat ?? false).toString(),
				isRefreshed: (
					this.token?.access_token === options.oldToken.access_token
				).toString(),
				proc: "initState_global_random_12345",
			},
		});

		if (!body.success) throw new Error(body.msg!);
	}

	private async rimuoviProfilo() {
		const { body } = await this.apiRequest<APIResponse>("rimuoviprofilo", {
			method: "POST",
			body: {},
		});

		if (!body.success) throw new Error(body.msg!);
		await this.dataProvider?.reset();
	}

	private async what(
		lastUpdate: Date | number | string,
		old?: APIWhat["data"]["dati"][number],
	) {
		const authToken = JSON.stringify([this.loginData?.token]);
		const opzioni = (this.dashboard ?? this.loginData)?.opzioni;
		const { body } = await this.apiRequest<APIWhat>("dashboard/what", {
			method: "POST",
			body: {
				dataultimoaggiornamento: formatDate(lastUpdate),
				opzioni:
					opzioni &&
					JSON.stringify(
						Object.fromEntries(opzioni.map((a) => [a.chiave, a.valore])),
					),
				"lista-x-auth-token": authToken,
				"lista-x-auth-token-account": authToken,
			},
		});

		if (!body.success) throw new Error(body.msg!);
		if (!this.noTypeCheck) validateWhat(body);
		return Object.assign(old ?? {}, body.data.dati[0]);
	}

	private async aggiornaData() {
		const { body } = await this.apiRequest<APIResponse>(
			"dashboard/aggiornadata",
			{
				method: "POST",
				body: {
					dataultimoaggiornamento: formatDate(new Date()),
				},
			},
		);

		if (!body.success) throw new Error(body.msg!);
	}

	private checkReady(): asserts this is ReadyClient {
		if (!this.isReady()) throw new Error("Client is not logged in!");
	}
}

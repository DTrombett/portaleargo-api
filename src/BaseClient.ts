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
} from "./types";
import {
	clientId,
	defaultVersion,
	formatDate,
	getToken,
	handleOperation,
	randomString,
} from "./util";

/**
 * Un client per interagire con l'API
 */
export abstract class BaseClient {
	static readonly BASE_URL = "https://www.portaleargo.it";

	/**
	 * A custom fetch implementation
	 */
	fetch = fetch;

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
			schoolCode: options.schoolCode,
			password: options.password,
			username: options.username,
		};
		this.token = options.token;
		this.loginData = options.loginData;
		this.profile = options.profile;
		this.dashboard = options.dashboard;
		this.debug = options.debug ?? false;
		this.version = options.version ?? defaultVersion;
		this.headers = options.headers;
		if (options.dataProvider !== null) this.dataProvider = options.dataProvider;
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
	apiRequest<T extends Json>(
		path: string,
		options?: Partial<{
			body: Json;
			method: HttpMethod;
			noWait: false;
		}>,
	): Promise<T>;
	apiRequest<T extends Json>(
		path: string,
		options: {
			body?: Json;
			method?: HttpMethod;
			noWait: true;
		},
	): Promise<Omit<Response, "json"> & { json: () => Promise<T> }>;
	async apiRequest(
		path: string,
		options: Partial<{
			body: Json;
			method: HttpMethod;
			noWait: boolean;
		}> = {},
	): Promise<unknown> {
		const headers: Record<string, string> = {
			accept: "application/json",
			"argo-client-version": this.version,
			authorization: `Bearer ${this.token?.access_token ?? ""}`,
		};

		options.method ??= options.body ? "POST" : "GET";
		if (options.body != null) headers["content-type"] = "application/json";
		if (this.loginData) {
			headers["x-auth-token"] = this.loginData.token;
			headers["x-cod-min"] = this.loginData.codMin;
		}
		if (this.token)
			headers["x-date-exp-auth"] = formatDate(this.token.expireDate);
		if (this.headers) Object.assign(headers, this.headers);
		const res = await this.fetch(
			`${BaseClient.BASE_URL}/appfamiglia/api/rest/${path}`,
			{
				headers,
				method: options.method,
				body: options.body != null ? JSON.stringify(options.body) : undefined,
			},
		);

		if (this.debug) console.debug(`${options.method} /${path} ${res.status}`);
		return options.noWait ? res : (res.json() as unknown);
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
			const res = await this.apiRequest<APIToken>("auth/refresh-token", {
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
				noWait: true,
			});
			const expireDate = new Date(res.headers.get("date") ?? date);
			const token = await res.json();

			if ("error" in token)
				throw new Error(`${token.error} ${token.error_description}`);
			expireDate.setSeconds(expireDate.getSeconds() + token.expires_in);
			this.token = Object.assign(this.token, token, { expireDate });
			void this.dataProvider?.write("token", this.token);
		}
		return this.token;
	}

	/**
	 * Ottieni il token tramite l'API.
	 * @param code - The code for the access
	 * @returns I dati del token
	 */
	async getToken(code?: LoginLink & { code: string }) {
		code ??= await this.getCode();
		const { expireDate, ...token } = await getToken(code);

		this.token = Object.assign(this.token ?? {}, token, { expireDate });
		void this.dataProvider?.write("token", this.token);
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
		const body = await this.apiRequest<APIDettagliProfilo>("dettaglioprofilo", {
			method: "POST",
		});

		if (!body.success) throw new Error(body.msg!);
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
		const orario = await this.apiRequest<APIOrarioGiornaliero>(
			"orario-giorno",
			{
				body: {
					datGiorno: formatDate(
						`${date?.year ?? now.getFullYear()}-${
							date?.month ?? now.getMonth() + 1
						}-${date?.day ?? now.getDate() + 1}`,
					),
				},
			},
		);

		if (!orario.success) throw new Error(orario.msg!);
		return Object.values(orario.data.dati).flat();
	}

	/**
	 * Ottieni il link per scaricare un allegato della bacheca.
	 * @param uid - L'uid dell'allegato
	 * @returns L'url
	 */
	async getLinkAllegato(uid: string) {
		this.checkReady();
		const download = await this.apiRequest<APIDownloadAllegato>(
			"downloadallegatobacheca",
			{ body: { uid } },
		);

		if (!download.success) throw new Error(download.msg);
		return download.url;
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
		const download = await this.apiRequest<APIDownloadAllegato>(
			"downloadallegatobachecaalunno",
			{ body: { uid, pkScheda } },
		);

		if (!download.success) throw new Error(download.msg);
		return download.url;
	}

	/**
	 * Ottieni i dati di una ricevuta telematica.
	 * @param iuv - L'iuv del pagamento
	 * @returns La ricevuta
	 */
	async getRicevuta(iuv: string) {
		this.checkReady();
		const ricevuta = await this.apiRequest<APIRicevutaTelematica>(
			"ricevutatelematica",
			{ body: { iuv } },
		);

		if (!ricevuta.success) throw new Error(ricevuta.msg);
		const { success, msg, ...rest } = ricevuta;

		return rest;
	}

	/**
	 * Ottieni i voti dello scrutinio dello studente.
	 * @returns I dati
	 */
	async getVotiScrutinio() {
		this.checkReady();
		const voti = await this.apiRequest<APIVotiScrutinio>("votiscrutinio", {
			body: {},
		});

		if (!voti.success) throw new Error(voti.msg!);
		return voti.data.votiScrutinio[0]?.periodi;
	}

	/**
	 * Ottieni i dati riguardo i ricevimenti dello studente.
	 * @returns I dati
	 */
	async getRicevimenti<T extends APIRicevimenti["data"]>(old?: T) {
		this.checkReady();
		const ricevimenti = await this.apiRequest<APIRicevimenti>("ricevimento", {
			body: {},
		});

		if (!ricevimenti.success) throw new Error(ricevimenti.msg!);
		return Object.assign(old ?? {}, ricevimenti.data);
	}

	/**
	 * Ottieni le tasse dello studente.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getTasse(pkScheda = this.profile?.scheda.pk) {
		this.checkReady();
		const taxes = await this.apiRequest<APITasse>("listatassealunni", {
			body: { pkScheda },
		});

		if (!taxes.success) throw new Error(taxes.msg!);
		const { success, msg, data, ...rest } = taxes;

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
		const pcto = await this.apiRequest<APIPCTO>("pcto", {
			body: { pkScheda },
		});

		if (!pcto.success) throw new Error(pcto.msg!);
		return pcto.data.pcto;
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
		const courses = await this.apiRequest<APICorsiRecupero>("corsirecupero", {
			body: { pkScheda },
		});

		if (!courses.success) throw new Error(courses.msg!);
		return Object.assign(old ?? {}, courses.data);
	}

	/**
	 * Ottieni il curriculum dello studente.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getCurriculum(pkScheda = this.profile?.scheda.pk) {
		this.checkReady();
		const curriculum = await this.apiRequest<APICurriculum>(
			"curriculumalunno",
			{
				body: { pkScheda },
			},
		);

		if (!curriculum.success) throw new Error(curriculum.msg!);
		return curriculum.data.curriculum;
	}

	/**
	 * Ottieni lo storico della bacheca.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getStoricoBacheca(pkScheda: string) {
		this.checkReady();
		const bacheca = await this.apiRequest<APIBacheca>("storicobacheca", {
			body: { pkScheda },
		});

		if (!bacheca.success) throw new Error(bacheca.msg!);
		return handleOperation(bacheca.data.bacheca);
	}

	/**
	 * Ottieni lo storico della bacheca alunno.
	 * @param pkScheda - L'id del profilo
	 * @returns I dati
	 */
	async getStoricoBachecaAlunno(pkScheda: string) {
		this.checkReady();
		const bacheca = await this.apiRequest<APIBachecaAlunno>(
			"storicobachecaalunno",
			{
				body: { pkScheda },
			},
		);

		if (!bacheca.success) throw new Error(bacheca.msg!);
		return handleOperation(bacheca.data.bachecaAlunno);
	}

	/**
	 * Ottieni i dati della dashboard.
	 * @returns La dashboard
	 */
	private async getDashboard() {
		this.checkReady();
		const date = new Date();
		const res = await this.apiRequest<APIDashboard>("dashboard/dashboard", {
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
			noWait: true,
		});
		const body = await res.json();

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
				dataAggiornamento: new Date(res.headers.get("date") ?? date),
			},
		);
		void this.dataProvider?.write("dashboard", this.dashboard);
		return this.dashboard;
	}

	private async getProfilo() {
		const profile = await this.apiRequest<APIProfilo>("profilo");

		if (!profile.success) throw new Error(profile.msg!);
		this.profile = Object.assign(this.profile ?? {}, profile.data);
		void this.dataProvider?.write("profile", this.profile);
		return this.profile;
	}

	private async getLoginData() {
		const login = await this.apiRequest<APILogin>("login", {
			body: {
				"lista-opzioni-notifiche": "{}",
				"lista-x-auth-token": "[]",
				clientID: randomString(163),
			},
		});

		if (!login.success) throw new Error(login.msg!);
		this.loginData = Object.assign(this.loginData ?? {}, login.data[0]);
		void this.dataProvider?.write("login", this.loginData);
		return this.loginData;
	}

	private async logToken(options: { oldToken: Token; isWhat?: boolean }) {
		const res = await this.apiRequest<APIResponse>("logtoken", {
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

		if (!res.success) throw new Error(res.msg!);
	}

	private async rimuoviProfilo() {
		const res = await this.apiRequest<APIResponse>("rimuoviprofilo", {
			body: {},
		});

		if (!res.success) throw new Error(res.msg!);
		await this.dataProvider?.reset();
	}

	private async what(
		lastUpdate: Date | number | string,
		old?: APIWhat["data"]["dati"][number],
	) {
		const authToken = JSON.stringify([this.loginData?.token]);
		const opzioni = (this.dashboard ?? this.loginData)?.opzioni;
		const what = await this.apiRequest<APIWhat>("dashboard/what", {
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

		if (!what.success) throw new Error(what.msg!);
		return Object.assign(old ?? {}, what.data.dati[0]);
	}

	private async aggiornaData() {
		const res = await this.apiRequest<APIResponse>("dashboard/aggiornadata", {
			body: { dataultimoaggiornamento: formatDate(new Date()) },
		});

		if (!res.success) throw new Error(res.msg!);
	}

	private checkReady(): asserts this is ReadyClient {
		if (!this.isReady()) throw new Error("Client is not logged in!");
	}

	protected abstract getCode(): Promise<LoginLink & { code: string }>;
}

import type { APILogin, Client, Jsonify } from "..";
import { Base } from "..";

type LoginData = APILogin["data"][number];
type Data = Jsonify<Login> | LoginData;

/**
 * The login data
 */
export class Login extends Base<LoginData> {
	schoolCode!: string;
	options!: Record<string, boolean>;
	firstAccess!: boolean;
	disabledProfile!: boolean;
	resetPassword!: boolean;
	spid!: boolean;
	token!: string;
	username!: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.schoolCode = data.codMin;
			this.options = Object.fromEntries(
				data.opzioni.map((a) => [a.chiave, a.valore])
			);
			this.firstAccess = data.isPrimoAccesso;
			this.disabledProfile = data.profiloDisabilitato;
			this.resetPassword = data.isResetPassword;
			this.spid = data.isSpid;
			this.token = data.token;
			this.username = data.username;
		}
	}
}

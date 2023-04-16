import type { APIToken, Client, Jsonify } from "..";
import { Base } from "..";

type Data = APIToken | Jsonify<Token>;

/**
 * Rappresenta i dati del token
 */
export class Token extends Base<APIToken> {
	accessToken!: string;
	expireDate!: Date;
	idToken!: string;
	refreshToken!: string;
	scopes!: string[];
	tokenType!: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: APIToken, client: Client, date: Date);
	constructor(data: Jsonify<Token>, client: Client);
	constructor(data: Data, client: Client, date?: Date) {
		super(client);
		this.patch(data, date);
	}

	patch(data: Data, date?: Date) {
		if (this.isJson(data)) {
			this.handleJson(data);
			this.expireDate = new Date(data.expireDate);
		} else {
			date!.setSeconds(date!.getSeconds() + data.expires_in);
			this.accessToken = data.access_token;
			this.expireDate = date!;
			this.idToken = data.id_token;
			this.refreshToken = data.refresh_token;
			this.scopes = data.scope.split(" ");
			this.tokenType = data.token_type;
		}
	}
}

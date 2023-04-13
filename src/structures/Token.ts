import type { APIToken, Jsonify } from "..";
import { Base } from "..";

type Data = APIToken | Jsonify<Token>;

/**
 * Rappresenta i dati del token
 */
export class Token extends Base<APIToken> {
	accessToken!: string;
	expireDate!: number;
	idToken!: string;
	refreshToken!: string;
	scopes!: string[];
	tokenType!: string;

	/**
	 * @param data - The API data
	 */
	constructor(data: APIToken, date: Date);
	constructor(data: Jsonify<Token>);
	constructor(data: Data, date?: Date) {
		super();
		this.patch(data, date);
	}

	patch(data: Data, date?: Date) {
		if (this.isJson(data)) super.patch(data);
		else {
			if (date) date.setSeconds(date.getSeconds() + data.expires_in);
			this.accessToken = data.access_token;
			if (date) this.expireDate = date.getTime();
			this.idToken = data.id_token;
			this.refreshToken = data.refresh_token;
			this.scopes = data.scope.split(" ");
			this.tokenType = data.token_type;
		}
	}
}

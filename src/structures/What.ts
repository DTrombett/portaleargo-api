import type { APIWhat, Client, Jsonify } from "..";
import { Base, BaseProfilo } from "..";

type WhatData = APIWhat["data"]["dati"][0];
type Data = Jsonify<What> | WhatData;

/**
 * The what data
 */
export class What extends Base<WhatData> {
	aggiornato!: boolean;
	differenzaSchede!: boolean;
	forzaLogin!: boolean;
	idAggiornamentoScheda!: boolean;
	profiloModificato!: boolean;
	profilo!: BaseProfilo;

	/**
	 * @param data - The API data
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) {
			this.handleJson(data);
			this.profilo = new BaseProfilo(data.profilo, this.client);
		} else {
			this.aggiornato = data.mostraPallino;
			this.differenzaSchede = data.differenzaSchede;
			this.forzaLogin = data.forceLogin;
			this.idAggiornamentoScheda = data.scheda.aggiornaSchedaPK;
			this.profiloModificato = data.isModificato;
			this.profilo = new BaseProfilo(data, this.client);
		}
		return this;
	}
}

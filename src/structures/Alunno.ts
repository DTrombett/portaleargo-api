import type { APIDettagliProfilo, Client, Jsonify } from "..";
import { Base } from "..";

type AlunnoData = APIDettagliProfilo["data"]["alunno"];
type Data = AlunnoData | Jsonify<Alunno>;

/**
 * Rappresenta i dati di un alunno
 */
export class Alunno extends Base<AlunnoData> {
	cognome!: string;
	cellulare!: string;
	codiceFiscale!: string;
	dataNascita!: string;
	cap!: string;
	comuneResidenza!: string;
	nome!: string;
	comuneNascita!: string;
	capResidenza!: string;
	cittadinanza!: string;
	indirizzo!: string;
	email!: string;
	via!: string;
	telefono!: string;
	sesso!: string;
	comune!: string;

	/**
	 * @param data - I dati ricevuti tramite l'API
	 */
	constructor(data: Data, client: Client) {
		super(client);
		this.patch(data);
	}

	patch(data: Data) {
		if (this.isJson(data)) this.handleJson(data);
		else {
			this.indirizzo = data.desIndirizzoRecapito;
			this.dataNascita = data.datNascita;
			this.comuneNascita = data.desComuneNascita;
			this.cap = data.desCap;
			this.comune = data.desComuneRecapito;
			if (data.desEMail != null) this.email = data.desEMail;
			this.sesso = data.sesso;
			if (data.desCellulare != null) this.cellulare = data.desCellulare;
			this.nome = data.nome;
			this.cittadinanza = data.cittadinanza;
			this.capResidenza = data.desCapResidenza;
			this.comuneResidenza = data.desComuneResidenza;
			this.via = data.desVia;
			this.cognome = data.cognome;
			this.codiceFiscale = data.desCf;
			this.telefono = data.desTelefono;
		}
		return this;
	}
}

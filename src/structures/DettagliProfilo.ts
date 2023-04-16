import type { APIDettagliProfilo, Client, Jsonify } from "..";
import { Base } from "..";

type DettagliProfiloData = APIDettagliProfilo["data"];
type Data = DettagliProfiloData | Jsonify<DettagliProfilo>;

/**
 * Rappresenta i dettagli del profilo dello studente
 */
export class DettagliProfilo extends Base<DettagliProfiloData> {
	flgUtente!: string;
	genitore!: {
		sesso: string;
		cognome: string;
		email: string;
		cellulare: string | null;
		telefono: string;
		nome: string;
		dataNascita: string;
	};
	alunno!: {
		cognome: string;
		cellulare: string | null;
		codiceFiscale: string;
		dataNascita: string;
		cap: string;
		comuneResidenza: string;
		nome: string;
		comuneNascita: string;
		capResidenza: string;
		cittadinanza: string;
		indirizzo: string;
		email: string | null;
		via: string;
		telefono: string;
		sesso: string;
		comune: string;
	};

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
			this.flgUtente = data.utente.flgUtente;
			this.genitore = {
				sesso: data.genitore.flgSesso,
				dataNascita: data.genitore.datNascita,
				email: data.genitore.desEMail,
				cellulare: data.genitore.desCellulare,
				nome: data.genitore.desNome,
				cognome: data.genitore.desCognome,
				telefono: data.genitore.desTelefono,
			};
			this.alunno = {
				indirizzo: data.alunno.desIndirizzoRecapito,
				dataNascita: data.alunno.datNascita,
				comuneNascita: data.alunno.desComuneNascita,
				cap: data.alunno.desCap,
				comune: data.alunno.desComuneRecapito,
				email: data.alunno.desEMail,
				sesso: data.alunno.sesso,
				cellulare: data.alunno.desCellulare,
				nome: data.alunno.nome,
				cittadinanza: data.alunno.cittadinanza,
				capResidenza: data.alunno.desCapResidenza,
				comuneResidenza: data.alunno.desComuneResidenza,
				via: data.alunno.desVia,
				cognome: data.alunno.cognome,
				codiceFiscale: data.alunno.desCf,
				telefono: data.alunno.desTelefono,
			};
		}
	}
}

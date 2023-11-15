import type { JSONSchemaType } from "ajv";
import Ajv from "ajv";
import { fastUri } from "fast-uri";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type {
	APIDettagliProfilo,
	APIDownloadAllegato,
	APILogin,
	APIOrarioGiornaliero,
	APIProfilo,
	APIToken,
	APIVotiScrutinio,
	APIWhat,
} from "../types";
import { AuthFolder, writeToFile } from "../util";
import {
	allRequired,
	apiResponse,
	array,
	base,
	boolean,
	nullableString,
	number,
	string,
} from "./utilityTypes";

const ajv = new Ajv({
	allErrors: true,
	strictRequired: "log",
	verbose: true,
	uriResolver: fastUri,
	// code: { esm: true },
});
const validate = <T>(name: string, schema: JSONSchemaType<T>) => {
	const func = ajv.compile(schema);

	return (data: unknown) => {
		func(data);
		if (func.errors) {
			const fileName = `${name}-${Date.now()}`;
			const errorsPath = join(AuthFolder, "errors");

			stat(errorsPath)
				.catch(() => mkdir(errorsPath))
				.then((stats) => {
					if (!stats || stats.isDirectory())
						void writeToFile(fileName, data, errorsPath);
				})
				.catch(() => {});
			console.warn(
				`\x1b[33m⚠️  Received an unexpected ${name}\n${func.errors
					.map(
						(err) =>
							`${name}${err.instancePath.replaceAll("/", ".")} ${err.message!}`,
					)
					.join(
						"\n",
					)}\n⚠️  Please, create an issue on https://github.com/DTrombett/portaleargo-api/issues providing this message and, possibly, the data received from the API saved in ${join(
					errorsPath,
					fileName,
				)}.json (remember to hide eventual sensitive data)\x1b[0m`,
			);
		}
	};
};

export const validateToken = validate<APIToken>(
	"token",
	allRequired({
		access_token: string,
		expires_in: number,
		id_token: string,
		refresh_token: string,
		scope: string,
		token_type: string,
	}),
);
export const validateLogin = validate<APILogin>(
	"loginData",
	apiResponse({
		type: "array",
		minItems: 1,
		maxItems: 1,
		additionalItems: false,
		items: [
			allRequired({
				codMin: string,
				isPrimoAccesso: boolean,
				isResetPassword: boolean,
				isSpid: boolean,
				profiloDisabilitato: boolean,
				token: string,
				username: string,
				opzioni: array(
					allRequired({
						chiave: string,
						valore: boolean,
					}),
				),
			}),
		],
	}),
);
export const validateProfilo = validate<APIProfilo>(
	"profilo",
	apiResponse(
		allRequired({
			resetPassword: boolean,
			ultimoCambioPwd: nullableString,
			profiloDisabilitato: boolean,
			isSpid: boolean,
			primoAccesso: boolean,
			profiloStorico: boolean,
			alunno: allRequired({
				cognome: string,
				desEmail: nullableString,
				isUltimaClasse: boolean,
				maggiorenne: boolean,
				nome: string,
				nominativo: string,
				pk: string,
			}),
			anno: allRequired({
				anno: string,
				dataFine: string,
				dataInizio: string,
			}),
			genitore: allRequired({
				desEMail: string,
				nominativo: string,
				pk: string,
			}),
			scheda: allRequired({
				pk: string,
				classe: allRequired({
					pk: string,
					desDenominazione: string,
					desSezione: string,
				}),
				corso: allRequired({
					descrizione: string,
					pk: string,
				}),
				scuola: allRequired({
					descrizione: string,
					desOrdine: string,
					pk: string,
				}),
				sede: allRequired({
					descrizione: string,
					pk: string,
				}),
			}),
		}),
	),
);
export const validateDettagliProfilo = validate<APIDettagliProfilo>(
	"dettagliProfilo",
	apiResponse(
		allRequired({
			utente: allRequired({ flgUtente: string }),
			genitore: allRequired({
				flgSesso: string,
				desCognome: string,
				desEMail: string,
				desCellulare: nullableString,
				desTelefono: string,
				desNome: string,
				datNascita: string,
			}),
			alunno: allRequired({
				cognome: string,
				desCellulare: nullableString,
				desCf: string,
				datNascita: string,
				desCap: string,
				desComuneResidenza: string,
				nome: string,
				desComuneNascita: string,
				desCapResidenza: string,
				cittadinanza: string,
				desIndirizzoRecapito: string,
				desEMail: nullableString,
				nominativo: string,
				desVia: string,
				desTelefono: string,
				sesso: string,
				desComuneRecapito: string,
			}),
		}),
	),
);
export const validateWhat = validate<APIWhat>(
	"what",
	apiResponse(
		allRequired({
			dati: {
				type: "array",
				minItems: 1,
				maxItems: 1,
				additionalItems: false,
				items: [
					allRequired({
						forceLogin: boolean,
						isModificato: boolean,
						pk: string,
						mostraPallino: boolean,
						differenzaSchede: boolean,
						profiloStorico: boolean,
						alunno: allRequired({
							isUltimaClasse: boolean,
							nominativo: string,
							cognome: string,
							nome: string,
							pk: string,
							maggiorenne: boolean,
							desEmail: nullableString,
						}),
						scheda: allRequired({
							aggiornaSchedaPK: boolean,
							classe: allRequired({
								pk: string,
								desDenominazione: string,
								desSezione: string,
							}),
							dataInizio: string,
							anno: number,
							corso: allRequired({
								descrizione: string,
								pk: string,
							}),
							sede: allRequired({
								descrizione: string,
								pk: string,
							}),
							scuola: allRequired({
								desOrdine: string,
								descrizione: string,
								pk: string,
							}),
							dataFine: string,
							pk: string,
						}),
					}),
				],
			},
		}),
	),
);
export const validateOrarioGiornaliero = validate<APIOrarioGiornaliero>(
	"orario",
	apiResponse(
		allRequired({
			dati: {
				type: "object",
				propertyNames: { type: "string" },
				additionalProperty: {
					type: "array",
					items: {
						...base,
						properties: {
							numOra: number,
							mostra: boolean,
							desCognome: string,
							desNome: string,
							docente: string,
							materia: string,
							pk: string,
							scuAnagrafePK: string,
							desDenominazione: string,
							desEmail: string,
							desSezione: string,
							ora: nullableString,
						},
						required: [
							"numOra",
							"mostra",
							"desCognome",
							"desNome",
							"docente",
							"materia",
							"desDenominazione",
							"desEmail",
							"desSezione",
							"ora",
						],
					},
				},
				required: [],
			},
		}),
	),
);
export const validateDownloadAllegato = validate<APIDownloadAllegato>(
	"downloadAllegato",
	{
		...base,
		required: ["success"],
		properties: { success: boolean, url: string, msg: string },
		oneOf: [{ required: ["msg"] }, { required: ["url"] }],
	},
);
export const validateVotiScrutinio = validate<APIVotiScrutinio>(
	"votiScrutinio",
	apiResponse(
		allRequired({
			votiScrutinio: {
				type: "array",
				minItems: 1,
				maxItems: 1,
				additionalItems: false,
				items: [
					allRequired({
						pk: string,
						periodi: array(
							allRequired({
								desDescrizione: string,
								materie: string,
								suddivisione: string,
								votiGiudizi: boolean,
								scrutinioFinale: boolean,
							}),
						),
					}),
				],
			},
		}),
	),
);

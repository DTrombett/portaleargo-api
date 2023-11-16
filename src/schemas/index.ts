import type { JSONSchemaType } from "ajv";
import Ajv from "ajv";
import { fastUri } from "fast-uri";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type {
	APICorsiRecupero,
	APICurriculum,
	APIDettagliProfilo,
	APIDownloadAllegato,
	APILogin,
	APIOrarioGiornaliero,
	APIPCTO,
	APIProfilo,
	APIRicevimenti,
	APIRicevutaTelematica,
	APITasse,
	APIToken,
	APIVotiScrutinio,
	APIWhat,
} from "../types";
import { AuthFolder, writeToFile } from "../util";
import {
	allRequired,
	apiResponse,
	array,
	arrayOfAny,
	base,
	boolean,
	merge,
	nullableNumber,
	nullableString,
	number,
	record,
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
		setImmediate(() => {
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
								`${name}${err.instancePath.replaceAll(
									"/",
									".",
								)} ${err.message!}`,
						)
						.join(
							"\n",
						)}\n⚠️  Please, create an issue on https://github.com/DTrombett/portaleargo-api/issues providing this message and, possibly, the data received from the API saved in ${join(
						errorsPath,
						fileName,
					)}.json (remember to hide eventual sensitive data)\x1b[0m`,
				);
			}
		});
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
	merge<Omit<APILogin, "total">, Pick<APILogin, "total">>(
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
		allRequired({ total: number }),
	),
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
			dati: record<
				`${number}`,
				APIOrarioGiornaliero["data"]["dati"][`${number}`]
			>(string, {
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
						pk: { ...string, nullable: true },
						scuAnagrafePK: { ...string, nullable: true },
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
			}),
		}),
	),
);
export const validateDownloadAllegato = validate<APIDownloadAllegato>(
	"downloadAllegato",
	{
		...base,
		required: ["success"],
		properties: { success: boolean, url: string, msg: string },
		oneOf: [
			{ required: ["msg"], properties: { msg: string } },
			{ required: ["url"], properties: { url: string } },
		],
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
								materie: array(string),
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
export const validateRicevimenti = validate<APIRicevimenti>(
	"ricevimenti",
	apiResponse(
		allRequired({
			tipoAccesso: string,
			genitoreOAlunno: array(
				allRequired({
					desEMail: string,
					nominativo: string,
					pk: string,
					telefono: string,
				}),
			),
			prenotazioni: array(
				allRequired({
					operazione: string,
					datEvento: string,
					prenotazione: allRequired({
						prgScuola: number,
						datPrenotazione: string,
						numPrenotazione: number,
						prgAlunno: number,
						genitore: string,
						numMax: number,
						orarioPrenotazione: string,
						prgGenitore: number,
						flgAnnullato: nullableString,
						flgAnnullatoDa: nullableString,
						desTelefonoGenitore: string,
						flgTipo: nullableString,
						datAnnullamento: nullableString,
						desUrl: nullableString,
						pk: string,
						genitorePK: string,
						desEMailGenitore: string,
						numPrenotazioni: number,
					}),
					disponibilita: allRequired({
						ora_Fine: string,
						desNota: string,
						datDisponibilita: string,
						desUrl: string,
						numMax: number,
						ora_Inizio: string,
						flgAttivo: string,
						desLuogoRicevimento: string,
						pk: string,
					}),
					docente: allRequired({
						desCognome: string,
						desNome: string,
						pk: string,
						desEmail: nullableString,
					}),
				}),
			),
			disponibilita: record<
				string,
				APIRicevimenti["data"]["disponibilita"][string]
			>(string, {
				type: "array",
				items: allRequired({
					numMax: number,
					desNota: string,
					docente: allRequired({
						desCognome: string,
						desNome: string,
						pk: string,
						desEmail: nullableString,
					}),
					numPrenotazioniAnnullate: nullableNumber,
					flgAttivo: string,
					oraFine: string,
					indisponibilita: nullableString,
					datInizioPrenotazione: string,
					desUrl: string,
					unaTantum: string,
					oraInizioPrenotazione: string,
					datScadenza: string,
					desLuogoRicevimento: string,
					oraInizio: string,
					pk: string,
					flgMostraEmail: string,
					desEMailDocente: string,
					numPrenotazioni: number,
				}),
			}),
		}),
	),
);
export const validateTasse = validate<APITasse>(
	"tasse",
	merge<
		Omit<APITasse, "isPagOnlineAttivo">,
		Pick<APITasse, "isPagOnlineAttivo">
	>(
		apiResponse(
			array(
				allRequired({
					importoPrevisto: string,
					dataPagamento: nullableString,
					dataCreazione: nullableString,
					scadenza: string,
					rptPresent: boolean,
					rata: string,
					iuv: nullableString,
					importoTassa: string,
					stato: string,
					descrizione: string,
					debitore: string,
					importoPagato: nullableString,
					pagabileOltreScadenza: boolean,
					rtPresent: boolean,
					isPagoOnLine: boolean,
					status: string,
					listaSingoliPagamenti: {
						type: "array",
						items: allRequired({
							descrizione: string,
							importoPrevisto: string,
							importoTassa: string,
						}),
						...({ nullable: true } as object),
					},
				}),
			),
		),
		allRequired({
			isPagOnlineAttivo: boolean,
		}),
	),
);
export const validatePCTO = validate<APIPCTO>(
	"pcto",
	apiResponse(
		allRequired({
			pcto: array(
				allRequired({
					percorsi: arrayOfAny,
					pk: string,
				}),
			),
		}),
	),
);
export const validateCorsiRecupero = validate<APICorsiRecupero>(
	"corsiRecupero",
	apiResponse(
		allRequired({
			corsiRecupero: arrayOfAny,
			periodi: arrayOfAny,
		}),
	),
);
export const validateCurriculum = validate<APICurriculum>(
	"curriculum",
	apiResponse(
		allRequired({
			curriculum: array(
				allRequired({
					anno: number,
					classe: string,
					credito: number,
					CVAbilitato: boolean,
					esito: {
						oneOf: [
							string,
							allRequired({
								desDescrizione: string,
								numColore: number,
								flgPositivo: string,
								flgTipoParticolare: nullableString,
								tipoEsito: string,
								descrizione: string,
								icona: string,
								codEsito: string,
								particolarita: string,
								positivo: string,
								tipoEsitoParticolare: string,
								esitoPK: allRequired({
									codMin: string,
									codEsito: string,
								}),
							}),
						],
					},
					isInterruzioneFR: boolean,
					isSuperiore: boolean,
					media: nullableNumber,
					mostraCredito: boolean,
					mostraInfo: boolean,
					ordineScuola: string,
					pkScheda: string,
				}),
			),
		}),
	),
);
export const validateRicevutaTelematica = validate<APIRicevutaTelematica>(
	"ricevuta",
	{
		...base,
		properties: {
			fileName: string,
			msg: { ...string, nullable: true },
			success: boolean,
			url: string,
		},
		required: ["fileName", "success", "url"],
	},
);

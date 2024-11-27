import type { JSONSchemaType } from "ajv";
import Ajv from "ajv";
import { mkdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
	APIRicevimenti,
	APIRicevutaTelematica,
	APITasse,
	APIToken,
	APIVotiScrutinio,
	APIWhat,
} from "../types";
import { writeToFile } from "../util/writeToFile";
import {
	allRequired,
	any,
	apiOperation,
	apiResponse,
	array,
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
});
const validate = <T>(name: string, schema: JSONSchemaType<T>) => {
	const func = ajv.compile(schema);

	return (data: unknown) => {
		setTimeout(async () => {
			try {
				func(data);
				const { errors } = func;

				if (errors) {
					const fileName = `${name}-${Date.now()}`;
					const errorsPath = join(tmpdir(), "argo");
					const stats = await stat(errorsPath).catch(() => mkdir(errorsPath));

					if (!stats || stats.isDirectory())
						await writeToFile(
							fileName,
							{ data, error: ajv.errorsText(errors) },
							errorsPath,
						);
					console.warn(
						`\x1b[33m⚠️  Received an unexpected ${name}\n⚠️  Please, create an issue on https://github.com/DTrombett/portaleargo-api/issues providing the data received from the API and the errors saved in ${join(
							errorsPath,
							fileName,
						)}.json (remember to hide eventual sensitive data)\x1b[0m`,
					);
				}
			} catch (err) {
				console.error(err);
			}
		});
	};
};

export const validateToken = validate<APIToken>("token", {
	...base,
	properties: {
		access_token: string,
		expires_in: number,
		id_token: string,
		refresh_token: string,
		scope: string,
		token_type: string,
		error: string,
		error_description: string,
	},
	oneOf: [
		allRequired({
			access_token: string,
			expires_in: number,
			id_token: string,
			refresh_token: string,
			scope: string,
			token_type: string,
		}),
		allRequired({
			error: string,
			error_description: string,
		}),
	],
});
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
			dati: record<string, APIOrarioGiornaliero["data"]["dati"][string]>(
				string,
				{
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
				},
			),
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
			votiScrutinio: array(
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
			),
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
						numPrenotazione: nullableNumber,
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
						numPrenotazioni: nullableNumber,
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
					percorsi: array(any),
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
			corsiRecupero: array(any),
			periodi: array(any),
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
export const validateDashboard = validate<APIDashboard>(
	"dashboard",
	apiResponse(
		allRequired({
			dati: {
				type: "array",
				minItems: 1,
				maxItems: 1,
				additionalItems: false,
				items: [
					{
						...base,
						properties: {
							msg: string,
							mediaGenerale: number,
							mensa: { type: "object", nullable: true },
							rimuoviDatiLocali: boolean,
							ricaricaDati: boolean,
							profiloDisabilitato: boolean,
							autocertificazione: { type: "object", nullable: true },
							schede: array(any),
							prenotazioniAlunni: apiOperation(
								allRequired({
									datEvento: string,
									docente: allRequired({
										desCognome: string,
										desNome: string,
										pk: string,
										desEmail: string,
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
									prenotazione: allRequired({
										prgScuola: number,
										datPrenotazione: string,
										numPrenotazione: nullableNumber,
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
										genitorePK: string,
										desEMailGenitore: string,
										numPrenotazioni: nullableNumber,
										pk: string,
									}),
								}),
								true,
							),
							noteDisciplinari: array(any),
							pk: string,
							classiExtra: boolean,
							opzioni: array(
								allRequired({
									chiave: string,
									valore: boolean,
								}),
							),
							mediaPerMese: { ...record(string, number), nullable: true },
							listaMaterie: array(
								allRequired({
									abbreviazione: string,
									scrut: boolean,
									codTipo: string,
									faMedia: boolean,
									materia: string,
									pk: string,
								}),
							),
							listaPeriodi: {
								...array<
									NonNullable<APIDashboard["data"]["dati"][0]["listaPeriodi"]>
								>({
									...base,
									properties: {
										pkPeriodo: string,
										dataInizio: string,
										descrizione: string,
										datInizio: { type: "string", nullable: true },
										votoUnico: boolean,
										mediaScrutinio: number,
										isMediaScrutinio: boolean,
										dataFine: string,
										datFine: { type: "string", nullable: true },
										codPeriodo: string,
										isScrutinioFinale: boolean,
									},
									required: [
										"codPeriodo",
										"dataFine",
										"dataInizio",
										"descrizione",
										"isMediaScrutinio",
										"isScrutinioFinale",
										"mediaScrutinio",
										"pkPeriodo",
										"votoUnico",
									],
								}),
								nullable: true,
							},
							fileCondivisi: allRequired({
								fileAlunniScollegati: array(any),
								listaFile: array(any),
							}),
							listaDocentiClasse: array(
								allRequired({
									desCognome: string,
									materie: array(string),
									desNome: string,
									pk: string,
									desEmail: string,
								}),
							),
							mediaPerPeriodo: {
								...record(
									string,
									allRequired({
										mediaGenerale: number,
										mediaMese: record(string, number),
										listaMaterie: record(
											string,
											allRequired({
												sommaValutazioniOrale: number,
												numValutazioniOrale: number,
												mediaMateria: number,
												mediaScritta: number,
												sumValori: number,
												numValori: number,
												numVoti: number,
												numValutazioniScritto: number,
												sommaValutazioniScritto: number,
												mediaOrale: number,
											}),
										),
									}),
								),
								nullable: true,
							},
							mediaMaterie: merge<
								Record<
									string,
									{
										sommaValutazioniOrale: number;
										numValutazioniOrale: number;
										mediaMateria: number;
										mediaScritta: number;
										sumValori: number;
										numValori: number;
										numVoti: number;
										numValutazioniScritto: number;
										sommaValutazioniScritto: number;
										mediaOrale: number;
									}
								>,
								// eslint-disable-next-line @typescript-eslint/no-empty-object-type
								{ listaMaterie?: {} }
							>(
								record(
									string,
									allRequired({
										sommaValutazioniOrale: number,
										numValutazioniOrale: number,
										mediaMateria: number,
										mediaScritta: number,
										sumValori: number,
										numValori: number,
										numVoti: number,
										numValutazioniScritto: number,
										sommaValutazioniScritto: number,
										mediaOrale: number,
									}),
								),
								{
									...base,
									properties: {
										listaMaterie: { type: "object", nullable: true },
									},
								},
							),
							appello: apiOperation(
								allRequired({
									datEvento: string,
									descrizione: string,
									daGiustificare: boolean,
									giustificata: string,
									data: string,
									codEvento: string,
									docente: string,
									commentoGiustificazione: string,
									dataGiustificazione: string,
									nota: string,
								}),
							),
							bacheca: apiOperation(
								allRequired({
									datEvento: string,
									messaggio: string,
									data: string,
									pvRichiesta: boolean,
									categoria: string,
									dataConfermaPresaVisione: string,
									url: nullableString,
									autore: string,
									dataScadenza: nullableString,
									adRichiesta: boolean,
									isPresaVisione: boolean,
									dataConfermaAdesione: string,
									listaAllegati: array(
										allRequired({
											nomeFile: string,
											path: string,
											descrizioneFile: nullableString,
											pk: string,
											url: string,
										}),
									),
									dataScadAdesione: nullableString,
									isPresaAdesioneConfermata: boolean,
								}),
							),
							bachecaAlunno: apiOperation(
								allRequired({
									nomeFile: string,
									datEvento: string,
									messaggio: string,
									data: string,
									flgDownloadGenitore: string,
									isPresaVisione: boolean,
								}),
							),
							fuoriClasse: apiOperation(
								allRequired({
									datEvento: string,
									descrizione: string,
									data: string,
									docente: string,
									nota: string,
									frequenzaOnLine: boolean,
								}),
							),
							promemoria: apiOperation(
								allRequired({
									datEvento: string,
									desAnnotazioni: string,
									pkDocente: string,
									flgVisibileFamiglia: string,
									datGiorno: string,
									docente: string,
									oraInizio: string,
									oraFine: string,
								}),
							),
							registro: apiOperation(
								allRequired({
									datEvento: string,
									isFirmato: boolean,
									desUrl: nullableString,
									pkDocente: string,
									compiti: array(
										allRequired({
											compito: string,
											dataConsegna: string,
										}),
									),
									datGiorno: string,
									docente: string,
									materia: string,
									pkMateria: string,
									attivita: nullableString,
									ora: number,
								}),
							),
							voti: apiOperation(
								allRequired({
									datEvento: string,
									pkPeriodo: string,
									codCodice: string,
									valore: number,
									codVotoPratico: string,
									docente: string,
									pkMateria: string,
									tipoValutazione: nullableString,
									prgVoto: number,
									descrizioneProva: string,
									faMenoMedia: string,
									pkDocente: string,
									descrizioneVoto: string,
									codTipo: string,
									datGiorno: string,
									mese: number,
									numMedia: number,
									desMateria: string,
									materiaLight: allRequired({
										scuMateriaPK: allRequired({
											codMin: string,
											prgScuola: number,
											numAnno: number,
											prgMateria: number,
										}),
										codMateria: string,
										desDescrizione: string,
										desDescrAbbrev: string,
										codSuddivisione: string,
										codTipo: string,
										flgConcorreMedia: string,
										codAggrDisciplina: nullableString,
										flgLezioniIndividuali: nullableString,
										codAggrInvalsi: nullableString,
										codMinisteriale: nullableString,
										icona: string,
										descrizione: nullableString,
										conInsufficienze: boolean,
										selezionata: boolean,
										prgMateria: number,
										tipo: string,
										articolata: string,
										lezioniIndividuali: boolean,
										idmateria: string,
										codEDescrizioneMateria: string,
										tipoOnGrid: string,
									}),
									desCommento: string,
								}),
							),
						},
						required: [
							"appello",
							"bacheca",
							"bachecaAlunno",
							"classiExtra",
							"fileCondivisi",
							"fuoriClasse",
							"listaDocentiClasse",
							"listaMaterie",
							"mediaGenerale",
							"mediaMaterie",
							"msg",
							"noteDisciplinari",
							"opzioni",
							"pk",
							"prenotazioniAlunni",
							"profiloDisabilitato",
							"promemoria",
							"registro",
							"ricaricaDati",
							"rimuoviDatiLocali",
							"schede",
							"voti",
						],
					},
				],
			},
		}),
	),
);
export const validateBacheca = validate<APIBacheca>(
	"bacheca",
	apiResponse(
		allRequired({
			bacheca: apiOperation(
				allRequired({
					datEvento: string,
					messaggio: string,
					data: string,
					pvRichiesta: boolean,
					categoria: string,
					dataConfermaPresaVisione: string,
					url: nullableString,
					autore: string,
					dataScadenza: nullableString,
					adRichiesta: boolean,
					isPresaVisione: boolean,
					dataConfermaAdesione: string,
					listaAllegati: array(
						allRequired({
							nomeFile: string,
							path: string,
							descrizioneFile: nullableString,
							pk: string,
							url: string,
						}),
					),
					dataScadAdesione: nullableString,
					isPresaAdesioneConfermata: boolean,
				}),
			),
		}),
	),
);
export const validateBachecaAlunno = validate<APIBachecaAlunno>(
	"bachecaAlunno",
	apiResponse(
		allRequired({
			bachecaAlunno: apiOperation(
				allRequired({
					nomeFile: string,
					datEvento: string,
					messaggio: string,
					data: string,
					flgDownloadGenitore: string,
					isPresaVisione: boolean,
				}),
			),
		}),
	),
);

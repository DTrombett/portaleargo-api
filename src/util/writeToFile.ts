import { getAuthFolder } from ".";

/**
 * Salva dei dati in un file JSON.
 * @param name - Il nome del file, escludendo l'estensione
 * @param value - I dati da scrivere
 */
export const writeToFile = async (
	name: string,
	value: unknown,
	path = getAuthFolder(),
) =>
	(require("node:fs/promises") as typeof import("node:fs/promises"))
		.writeFile(
			`${(require("node:path") as typeof import("node:path")).join(
				path,
				name,
			)}.json`,
			JSON.stringify(value),
		)
		.catch(console.error);

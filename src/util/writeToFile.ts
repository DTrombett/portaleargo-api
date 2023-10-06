import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AuthFolder } from "..";

/**
 * Salva dei dati in un file JSON.
 * @param name - Il nome del file, escludendo l'estensione
 * @param value - I dati da scrivere
 */
export const writeToFile = (name: string, value: unknown, path = AuthFolder) =>
	writeFile(`${join(path, name)}.json`, JSON.stringify(value)).catch(
		console.error,
	);

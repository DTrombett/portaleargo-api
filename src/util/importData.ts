import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReadData } from "../types";

/**
 * Importa dei dati salvati in un file.
 * @param name - Il nome del file, escludendo l'estensione
 * @returns I dati importati
 */
export const importData = async <T extends keyof ReadData>(
	name: T,
	path: string,
) => {
	try {
		return JSON.parse(
			await readFile(join(path, `${name}.json`), {
				encoding: "utf8",
			}),
		) as ReadData[T];
	} catch {
		return undefined;
	}
};

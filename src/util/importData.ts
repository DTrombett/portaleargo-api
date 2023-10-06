import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Jsonify, ReadData } from "..";
import { AuthFolder } from "..";

/**
 * Importa dei dati salvati in un file.
 * @param name - Il nome del file, escludendo l'estensione
 * @returns I dati importati
 */
export const importData = async <T extends keyof ReadData>(
	name: T,
	path = AuthFolder,
) =>
	readFile(join(path, `${name}.json`), {
		encoding: "utf8",
	})
		.then(async (content) => JSON.parse(content) as Jsonify<ReadData[T]>)
		.catch(() => undefined);

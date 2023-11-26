import { getAuthFolder, type ReadData } from "..";

/**
 * Importa dei dati salvati in un file.
 * @param name - Il nome del file, escludendo l'estensione
 * @returns I dati importati
 */
export const importData = async <T extends keyof ReadData>(
	name: T,
	path = getAuthFolder(),
) =>
	(require("node:fs/promises") as typeof import("node:fs/promises"))
		.readFile(
			(require("node:path") as typeof import("node:path")).join(
				path,
				`${name}.json`,
			),
			{
				encoding: "utf8",
			},
		)
		.then(async (content) => JSON.parse(content) as ReadData[T])
		.catch(() => undefined);

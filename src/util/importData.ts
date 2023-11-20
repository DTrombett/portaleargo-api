import type { ReadData } from "..";

/**
 * Importa dei dati salvati in un file.
 * @param name - Il nome del file, escludendo l'estensione
 * @returns I dati importati
 */
export const importData = async <T extends keyof ReadData>(
	name: T,
	path: Promise<string> | string,
) => {
	const [{ readFile }, { join }, resolvedPath] = await Promise.all([
		import("node:fs/promises"),
		import("node:path"),
		path,
	]);

	return readFile(join(resolvedPath, `${name}.json`), {
		encoding: "utf8",
	})
		.then(async (content) => JSON.parse(content) as ReadData[T])
		.catch(() => undefined);
};

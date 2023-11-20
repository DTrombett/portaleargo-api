/**
 * Salva dei dati in un file JSON.
 * @param name - Il nome del file, escludendo l'estensione
 * @param value - I dati da scrivere
 */
export const writeToFile = async (
	name: string,
	value: unknown,
	path: Promise<string> | string,
) => {
	const [{ writeFile }, { join }, resolvedPath] = await Promise.all([
		import("node:fs/promises"),
		import("node:path"),
		path,
	]);

	return writeFile(
		`${join(resolvedPath, name)}.json`,
		JSON.stringify(value),
	).catch(console.error);
};

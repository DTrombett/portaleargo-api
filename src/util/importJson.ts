import { readFile } from "node:fs/promises";

/**
 * Import a json file.
 * @param path - The path to the file
 * @returns The imported json
 */
export const importJson = async <T>(path: string) =>
	readFile(path, {
		encoding: "utf8",
	})
		.then(async (content) => JSON.parse(content) as T)
		.catch(() => null);

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { AuthFolder } from "./Constants";

/**
 * Import a data file.
 * @param name - The file name without the extension
 * @returns The imported json
 */
export const importData = async <T>(name: string) =>
	readFile(join(AuthFolder, `${name}.json`), {
		encoding: "utf8",
	})
		.then(async (content) => JSON.parse(content) as T)
		.catch(() => undefined);

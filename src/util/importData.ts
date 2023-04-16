import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Jsonify } from "..";
import { AuthFolder } from "..";

/**
 * Import a data file.
 * @param name - The file name without the extension
 * @returns The imported json
 */
export const importData = async <T>(
	name: string
): Promise<Jsonify<T> | undefined> =>
	readFile(join(AuthFolder, `${name}.json`), {
		encoding: "utf8",
	})
		.then(async (content) => JSON.parse(content) as Jsonify<T>)
		.catch(() => undefined);

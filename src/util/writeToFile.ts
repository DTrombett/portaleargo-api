import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AuthFolder } from "..";

/**
 * Write the response of a request to a json file.
 * @param name - The file name without the extension
 * @param value - The content to write
 */
export const writeToFile = (name: string, value: unknown) =>
	writeFile(`${join(AuthFolder, name)}.json`, JSON.stringify(value)).catch(
		console.error
	);

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Json } from "../types";
import { AuthFolder } from "./Constants";

/**
 * Write the response of a request to a json file.
 * @param name - The file name without the extension
 * @param body - The content to write
 */
export const writeToFile = (name: string, body: Json) =>
	writeFile(join(AuthFolder, name), JSON.stringify(body)).catch(console.error);
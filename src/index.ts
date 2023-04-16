import { config } from "dotenv";
import { Client } from ".";

export * from "./Client";
export * from "./api";
export * from "./structures";
export * from "./types";
export * from "./util";

const now = performance.now();
config();
const client = new Client({
	debug: true,
});

await client.login();
console.log(await client.getDettagliProfilo(), performance.now() - now);
// TODO: Add rest with client option

// TODO: Add option to not save local data

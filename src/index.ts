import { config } from "dotenv";
import { Client } from "./Client";

export * from "./Client";
export * from "./api";
export * from "./structures";
export * from "./types";
export * from "./util";

config();
const client = new Client({
	debug: true,
});

await client.login();
console.log(await client.getDettagliProfilo());
// TODO: Convert every structure.object to a new structure

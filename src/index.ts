import { config } from "dotenv";
import { Client } from "./Client";

config();
const client = new Client({
	debug: true,
});

await client.login();

export * from "./Client";
export * from "./api";
export * from "./builders";
export * from "./types";
export * from "./util";

import { config } from "dotenv";
import { Client } from "./Client";

config();
const client = new Client();

await client.login();
await client.getDashboard();

export * from "./Client";
export * from "./api";
export * from "./builders";
export * from "./types";
export * from "./util";

// TODO: Support `what` endpoint with profile type
// TODO: Make custom types more user friendly similar to the app

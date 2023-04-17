// import { config } from "dotenv";
// import { Client } from ".";
//
// config();
// const now = performance.now();
// const client = new Client({
// 	debug: true,
// });
//
// await client.login();
// console.log(await client.getDettagliProfilo(), performance.now() - now);

export * from "./Client";
export * from "./api";
export * from "./structures";
export * from "./types";
export * from "./util";

// import { config } from "dotenv";
// import { Client } from ".";
//
// config();
// const now = performance.now();
// const client = new Client({
// 	debug: true,
// });
//
// client
// 	.login()
// 	.then(async () => {
// 		console.log(await client.getDettagliProfilo(), performance.now() - now);
// 	})
// 	.catch(console.error);

export * from "./Client";
export * from "./api";
export * from "./structures";
export * from "./types";
export * from "./util";

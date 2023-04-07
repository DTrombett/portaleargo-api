// import { config } from "dotenv";
// import { Client } from "./Client";
//
// config();
// const client = new Client({
// 	debug: true,
// });
//
// await client.login();
// console.log(await client.getVotiScrutinio());

export * from "./Client";
export * from "./api";
export * from "./builders";
export * from "./types";
export * from "./util";

// import { config } from "dotenv";
// import { Client } from "./Client";
//
// config();
// const now = performance.now();
// const client = new Client({
// 	debug: true,
// });
//
// await client.login();
// const curriculum = await client.getCurriculum();
// const tasse = await client.getTasse(curriculum[1].id);
// const after = performance.now();
//
// console.log(tasse);
// console.log(after - now);

export * from "./Client";
export * from "./api";
export * from "./builders";
export * from "./types";
export * from "./util";

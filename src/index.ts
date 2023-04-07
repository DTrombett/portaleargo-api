// import { config } from "dotenv";
// import { Client } from "./Client";
//
// config();
// const client = new Client({
// 	debug: true,
// });
// const dashboard = await client.login();
//
// await client.downloadStudentAttachment(
// 	dashboard.bachecaAlunno[0].id,
// 	"./file.pdf"
// );

export * from "./Client";
export * from "./api";
export * from "./builders";
export * from "./types";
export * from "./util";

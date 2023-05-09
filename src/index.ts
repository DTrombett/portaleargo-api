// import { config } from "dotenv";
// import { Client } from ".";

// config();
// const client = new Client({
// 	debug: true,
// });

// client
// 	.login()
// 	.then(async (newClient) => {
// 		console.log(newClient);
// 	})
// 	.catch(console.error);

export * from "./Client";
export * from "./api";
export * from "./structures";
export * from "./types";
export * from "./util";

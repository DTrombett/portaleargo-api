import "dotenv/config";
import { Client } from "./Client";

console.time();
const client = new Client({ debug: true });

await client.login();
const uid = client.dashboard?.bacheca.find((e) => e.listaAllegati.length)
	?.listaAllegati[0]?.pk;

await Promise.allSettled([
	client.getCorsiRecupero(),
	client
		.getCurriculum()
		.then((c) =>
			Promise.allSettled([
				client.getStoricoBacheca(c.at(-1)!.pkScheda),
				client.getStoricoBachecaAlunno(c.at(-1)!.pkScheda),
			]),
		),
	client.getDettagliProfilo(),
	client.getOrarioGiornaliero(),
	client.getPCTOData(),
	client.getRicevimenti(),
	client.getTasse(),
	client.getVotiScrutinio(),
	uid && client.getLinkAllegato(uid),
]);
await client.logOut();
console.timeEnd();

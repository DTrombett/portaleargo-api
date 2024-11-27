// #region Config
import "dotenv/config";
import { Client } from "./Client";

const fn = async () => {
	const client = new Client({ debug: true });

	await client.login();
	const now = performance.now();
	// #endregion
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
	// #region End
	console.log(performance.now() - now);
};

fn();
// #endregion

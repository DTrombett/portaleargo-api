import type { APIOperation } from "../types";

/**
 * Gestisci dei dati dell'API contenenti un'operazione.
 * @param array - L'array ricevuto
 * @param old - L'eventuale array da modificare
 * @param pk - Una funzione per estrarre il pk
 * @returns Il nuovo array
 */
export const handleOperation = <T, P extends boolean>(
	array: APIOperation<T, P>[],
	old: Omit<
		Extract<APIOperation<T, P>, { operazione?: "I" }>,
		"operazione"
	>[] = [],
	...[pk]: P extends true
		? [
				pk: (
					a: Omit<
						Extract<APIOperation<T, P>, { operazione?: "I" }>,
						"operazione"
					>,
				) => string,
			]
		: []
) => {
	const toDelete: string[] = [];
	const getPk =
		(pk as
			| ((
					a: Omit<
						Extract<APIOperation<T, P>, { operazione?: "I" }>,
						"operazione"
					>,
			  ) => string)
			| undefined) ?? ((a) => a.pk!);

	for (const a of array)
		if (a.operazione === "D") toDelete.push(a.pk);
		else {
			const { operazione, ...rest } = a;
			const found = old.find((b) => a.pk === getPk(b));

			if (found) Object.assign(found, rest);
			else old.push(rest);
		}
	return old.filter((a) => {
		const p = getPk(a);

		toDelete.unshift(p);
		return !toDelete.includes(p, 1);
	});
};

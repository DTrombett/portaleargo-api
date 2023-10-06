import type { APIOperation, Json } from "..";

/**
 * Gestisci dei dati dell'API contenenti un'operazione.
 * @param array - L'array ricevuto
 * @param old - L'eventuale array da modificare
 * @param map - Una funzione per convertire l'array
 * @returns Il nuovo array
 */
export const handleOperation = <
	P extends {
		id: string;
	},
	T = Json,
>(
	array: APIOperation<T>[],
	old: P[] = [],
	map: (a: Extract<APIOperation<T>, { operazione: "I" }>) => P,
) => {
	const toDelete: string[] = [];

	for (const a of array)
		if (a.operazione === "D") toDelete.push(a.pk);
		else old.push(map(a));
	return old.filter((a) => !toDelete.includes(a.id));
};

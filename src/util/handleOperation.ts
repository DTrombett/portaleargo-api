import type { APIOperation, Json } from "..";

/**
 * Gestisci dei dati dell'API contenenti un'operazione.
 * @param array - L'array ricevuto
 * @param old - L'eventuale array da modificare
 * @param map - Una funzione per convertire l'array
 * @returns Il nuovo array
 */
export const handleOperation = <T = Json>(
	array: APIOperation<T>[],
	old: (T & { pk: string })[] = [],
	map?: (
		a: Omit<Extract<APIOperation<T>, { operazione: "I" }>, "operazione">,
	) => T & { pk: string },
) => {
	const toDelete: string[] = [];

	for (const a of array)
		if (a.operazione === "D") toDelete.push(a.pk);
		else {
			const { operazione, ...rest } = a;

			old.push(map?.(rest) ?? (rest as T & { pk: string }));
		}
	return old.filter((a) => !toDelete.includes(a.pk));
};

import type { APIOperation, Json } from "..";

/**
 * Handle an array of operations from the API.
 * @param array - The array from the API
 * @param old - The array to modify
 * @param map - A function to convert the API type
 */
export const handleOperation = <
	P extends {
		id: string;
	},
	T = Json
>(
	array: APIOperation<T>[],
	old: P[] = [],
	map: (a: Extract<APIOperation<T>, { operazione: "I" }>) => P
) => {
	const toDelete: string[] = [];

	for (const a of array)
		if (a.operazione === "D") toDelete.push(a.pk);
		else old.push(map(a));
	return old.filter((a) => !toDelete.includes(a.id));
};

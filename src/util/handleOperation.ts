import type { APIOperation } from "../types";

/**
 * Handle an array of operations from the API.
 * @param array - The array from the API
 * @param object - The object to modify
 * @param map - A function to convert the API type
 */
export const handleOperation = <
	T,
	P extends {
		id: string;
	}
>(
	array: APIOperation<T>[],
	object: Record<string, P>,
	map: (a: T) => Omit<P, "id">
) => {
	for (const a of array)
		if (a.operazione === "D") delete object[a.pk];
		else object[a.pk] = { id: a.pk, ...map(a) } as P;
};

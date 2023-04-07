import type { APIOperation } from "../types";

/**
 * Handle an array of operations from the API.
 * @param array - The array from the API
 * @param target - The array to modify
 * @param map - A function to convert the API type
 */
export const handleOperation = <
	T,
	P extends {
		id: string;
	}
>(
	array: APIOperation<T>[],
	target: P[] = [],
	map: (a: T) => Omit<P, "id">
) => {
	const toDelete: string[] = [];

	for (const a of array)
		if (a.operazione === "D") toDelete.push(a.pk);
		else target.push({ id: a.pk, ...map(a) } as P);
	return target.filter((a) => !toDelete.includes(a.id));
};

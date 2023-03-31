/**
 * Convert an API array to an object.
 * @param array - The array to convert
 * @param map - The function to convert an element
 * @returns The new object
 */
export const arrayToObject = <
	T,
	A extends {
		[key in N]: string;
	},
	N extends keyof A | "pk" = "pk"
>(
	array: A[],
	map: (d: A) => T,
	pk = "pk" as N
): Record<string, T & { id: string }> =>
	Object.fromEntries(
		array.map((d) => [
			d[pk],
			{
				id: d[pk],
				...map(d),
			},
		])
	);

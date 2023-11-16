import type { JSONSchemaType } from "ajv";
import type { APIResponse } from "../types";

export const base = { type: "object", additionalProperties: false } as const;
export const allRequired = <
	T,
	P extends JSONSchemaType<T>["properties"] = JSONSchemaType<T>["properties"],
>(
	properties: P,
): typeof base & {
	properties: P;
	required: (keyof P)[];
} => ({
	...base,
	properties,
	required: Object.keys(properties),
});
export const boolean: JSONSchemaType<boolean> = { type: "boolean" };
export const string: JSONSchemaType<string> = { type: "string" };
export const number: JSONSchemaType<number> = { type: "number" };
export const nullableString: JSONSchemaType<string> = {
	type: "string",
	nullable: true,
};
export const nullableNumber: JSONSchemaType<number> = {
	type: "number",
	nullable: true,
};
export const record = <K extends number | string | symbol, T>(
	name: JSONSchemaType<K>,
	value: JSONSchemaType<T>,
): JSONSchemaType<Record<K, T>> => ({
	type: "object",
	required: [],
	propertyNames: name,
	additionalProperties: value,
});
export const apiResponse = <T>(
	data: T extends APIResponse<infer A> ? JSONSchemaType<A> : never,
): JSONSchemaType<T> => ({
	...base,
	properties: {
		success: boolean,
		msg: nullableString,
		data,
	},
	required: ["success", "data"],
});
export const array = <T extends any[] | null>(
	items: JSONSchemaType<NonNullable<T>[number]>,
	options?: Partial<JSONSchemaType<T>>,
) =>
	({
		type: "array",
		items,
		...options,
	}) as JSONSchemaType<T>;
export const merge = <A, B>(
	first: JSONSchemaType<A>,
	second: JSONSchemaType<B>,
) =>
	({
		...second,
		...first,
		properties: { ...second.properties, ...first.properties },
		required: [...second.required, ...first.required],
	}) as JSONSchemaType<A & B>;
export const arrayOfAny: JSONSchemaType<any[]> = array(
	{} as JSONSchemaType<any>,
);

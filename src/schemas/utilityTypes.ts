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
export const array = <T extends any[]>(data: JSONSchemaType<T[number]>) =>
	({
		type: "array",
		items: data,
	}) as JSONSchemaType<T>;

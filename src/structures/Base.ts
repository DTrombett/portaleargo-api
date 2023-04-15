import type { Jsonify, ObjectJson } from "..";

const identifierName = "class name";

/**
 * Rappresenta una struttura base
 */
export class Base<T extends ObjectJson = ObjectJson> {
	[identifierName] = this.constructor.name;

	// constructor() {}

	protected static isKey<O extends object>(
		key: PropertyKey,
		object: O
	): key is keyof O {
		return Object.hasOwn(object, key);
	}

	protected isJson<O extends ObjectJson>(data: O | T): data is O {
		return data[identifierName] === this.constructor.name;
	}

	protected handleJson(data: Jsonify<Base>) {
		for (const key in data) if (Base.isKey(key, data)) this[key] = data[key];
	}
}

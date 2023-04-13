import type { Json, Jsonify } from "..";

/**
 * Rappresenta una struttura base
 */
export class Base<T extends Json = Json> {
	protected static isKey<O extends object>(
		key: PropertyKey,
		object: O
	): key is keyof O {
		return Object.hasOwn(object, key);
	}

	/**
	 * Patch the structure with new data.
	 * @param data - The API data
	 */
	protected patch(data: Jsonify<Base> | T) {
		if (this.isJson(data))
			for (const key in data) if (Base.isKey(key, data)) this[key] = data[key];
	}

	protected isJson<O extends Json>(data: O | T): data is O {
		return !(data == null || "pk" in data);
	}
}

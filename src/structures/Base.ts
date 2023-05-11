import { inspect } from "node:util";
import type { Client, Jsonify, ObjectJson } from "..";

const identifierName = "Class name!";

/**
 * Rappresenta una struttura base
 */
export class Base<T extends ObjectJson = ObjectJson> {
	/**
	 * Il client
	 */
	client: Client;

	protected readonly [identifierName] = this.constructor.name;

	/**
	 * @param client - Il client
	 */
	constructor(client: Client) {
		Object.defineProperty(this, identifierName, {
			writable: false,
			configurable: false,
		});
		this.client = client;
	}

	protected static isKey<O extends object>(
		key: PropertyKey,
		object: O
	): key is keyof O {
		return Object.hasOwn(object, key);
	}

	/**
	 * Converti questa struttura in JSON.
	 * @returns La rappresentazione JSON di questa struttura
	 */
	toJSON() {
		const self: Omit<this, "client"> = { ...this, client: undefined };

		return self;
	}

	[inspect.custom]() {
		const self = {
			...this,
		} as {
			[K in typeof identifierName | "client"]: unknown;
		};

		delete self.client;
		delete self[identifierName];
		return self;
	}

	protected patch(_data: T) {
		return this;
	}

	protected isJson<O extends ObjectJson>(data: O | T): data is O {
		return typeof data[identifierName] !== "undefined";
	}

	protected handleJson(data: Jsonify<Base>) {
		for (const key in data)
			if (key !== identifierName && Base.isKey(key, data))
				this[key] = data[key];
	}
}

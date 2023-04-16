import { inspect } from "node:util";
import type { Client, Jsonify, ObjectJson } from "..";

const identifierName = "class name";

/**
 * Rappresenta una struttura base
 */
export class Base<T extends ObjectJson = ObjectJson> {
	/**
	 * The client that instantiated this
	 */
	client: Client;
	protected readonly [identifierName] = this.constructor.name;

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

	protected isJson<O extends ObjectJson>(data: O | T): data is O {
		return data[identifierName] === this.constructor.name;
	}

	protected handleJson(data: Jsonify<Base>) {
		for (const key in data)
			if (key !== identifierName && Base.isKey(key, data))
				this[key] = data[key];
	}
}

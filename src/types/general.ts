export type Json =
	| Json[]
	| boolean
	| number
	| string
	| {
			[key: string]: Json;
	  }
	| null;
export type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

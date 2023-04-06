import { config } from "dotenv";
import { env } from "process";
import { defineConfig, Options } from "tsup";

if (!("NODE_ENV" in env)) config();
const options: Options = {
	clean: true,
	entry: ["src/index.ts"],
	format: ["esm"],
	external: ["tsup"],
	platform: "node",
	target: "esnext",
	minify: true,
};

if (env.NODE_ENV !== "production") {
	options.sourcemap = true;
}

export default defineConfig(options);

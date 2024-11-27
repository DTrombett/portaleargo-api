import "dotenv/config";
import { env } from "process";
import { defineConfig, type Options } from "tsup";

const baseConfig: Options = {
	clean: true,
	format: "esm",
	keepNames: true,
	minify: env.NODE_ENV === "production",
	removeNodeProtocol: false,
	replaceNodeEnv: true,
	skipNodeModulesBundle: true,
	sourcemap: true,
};
const options: Options[] = [
	{
		entry: ["src/index.ts"],
		platform: "node",
		target: "node18",
		...baseConfig,
	},
	{
		entry: ["src/web.ts"],
		platform: "browser",
		target: "es2020",
		external: [/^node:/],
		...baseConfig,
	},
];

if (env.NODE_ENV !== "production")
	options.push({
		entry: ["src/_test.ts"],
		platform: "node",
		target: "node22",
		...baseConfig,
	});

export default defineConfig(options);

import { defineConfig, Options } from "tsup";

const options: Options = {
	clean: true,
	entry: ["src/index.ts"],
	// format: ["esm"],
	external: ["dotenv", "node:*"],
	platform: "neutral",
	target: "esnext",
	minify: true,
	keepNames: true,
	sourcemap: true,
};

export default defineConfig(options);

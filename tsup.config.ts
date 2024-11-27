import "dotenv/config";
import { env } from "process";
import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	entry:
		env.NODE_ENV === "production"
			? ["src/index.ts"]
			: ["src/index.ts", "src/_test.ts"],
	format: ["cjs", "esm"],
	platform: "neutral",
	replaceNodeEnv: true,
	target: "es2020",
	sourcemap: true,
	removeNodeProtocol: false,
	external: [/^node:.*/],
	minify: true,
	keepNames: true,
});

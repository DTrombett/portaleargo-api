import { defineConfig, Options } from "tsup";

const options: Options = {
	clean: true,
	entry: ["src/index.ts"],
	// format: ["esm"],
	external: ["tsup"],
	platform: "node",
	target: "esnext",
	minify: true,
	keepNames: true,
	sourcemap: true,
	dts: true,
};

export default defineConfig(options);

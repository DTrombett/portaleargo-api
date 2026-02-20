import { build, type BuildOptions } from "esbuild";
import { env } from "node:process";

const options: BuildOptions = {
	bundle: true,
	charset: "utf8",
	format: "esm",
	keepNames: true,
	minify: env.NODE_ENV === "production",
	outdir: "dist",
	sourcemap: true,
	treeShaking: true,
};

await Promise.all([
	build({
		...options,
		entryPoints:
			env.NODE_ENV === "production"
				? ["src/index.ts"]
				: ["src/index.ts", "src/_test.ts"],
		packages: "external",
		platform: "node",
		target: "node20",
	}),
	build({
		...options,
		entryPoints: ["src/web.ts"],
		platform: "browser",
		target: "es2022",
	}),
]);

const path = require("path");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
	bail: true,
	cache: true,
	entry: "./src/index.ts",
	externals: ["undici"],
	externalsPresets: { node: true, web: true },
	mode: "none",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: "ts-loader",
						options: { transpileOnly: true, happyPackMode: true },
					},
				],
				exclude: path.join(__dirname, "node_modules"),
			},
		],
	},
	name: "Base",
	optimization: {
		concatenateModules: true,
		mergeDuplicateChunks: true,
		removeEmptyChunks: true,
	},
	output: {
		clean: true,
		filename: "index.js",
		globalObject: "this",
		library: {
			name: "portaleargoApi",
			type: "umd",
		},
		libraryTarget: "umd",
		path: path.resolve(__dirname, "dist"),
		publicPath: "",
		asyncChunks: true,
	},
	resolve: {
		extensions: [".ts", ".js"],
		symlinks: false,
		cache: true,
		cacheWithContext: true,
	},
};

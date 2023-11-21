const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = merge(common, {
	devServer: {
		static: "./dist",
	},
	devtool: "inline-source-map",
	mode: "development",
});

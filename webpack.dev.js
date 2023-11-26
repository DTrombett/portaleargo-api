const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = merge(common, {
	devServer: {
		static: "./dist",
	},
	devtool: "eval-source-map",
	mode: "development",
});

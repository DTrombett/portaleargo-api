const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { builtinModules } = require("node:module");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = merge(common, {
	devtool: "source-map",
	mode: "production",
});

import autoExternal from "rollup-plugin-auto-external";
import { swc } from "rollup-plugin-swc3";

/** @type {import("rollup").RollupOptions} */
export default {
	input: "./src/index.ts",
	output: {
		file: "./dist/index.js",
		format: "esm",
	},
	plugins: [
		swc({
			minify: true,
		}),
		autoExternal(),
	],
	external: ["dotenv/config"],
};

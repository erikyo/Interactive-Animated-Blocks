const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		ssc: path.resolve(process.cwd(), `src/index.ts`),
		'ssc-editor': path.resolve(process.cwd(), `src/editor.ts`),
	},
};

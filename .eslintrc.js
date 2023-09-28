/**
 * Set WordPress presets
 */

const eslintConfig = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
};

eslintConfig.parserOptions = {
	babelOptions: {
		presets: ['@wordpress/babel-preset-default'],
	},
};

module.exports = eslintConfig;

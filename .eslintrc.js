/**
 * Set WordPress presets
 */

const eslintConfig = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	rules: {
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'off',
	},
};

eslintConfig.parserOptions = {
	babelOptions: {
		presets: ['@wordpress/babel-preset-default'],
	},
};

module.exports = eslintConfig;

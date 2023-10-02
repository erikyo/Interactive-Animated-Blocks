import { animationTypes } from './data';
import type { StyleRule, SSCAnimationDefaults } from '../types';

/**
 * It takes a data object and a type string, and returns a string of the data object's key/value pairs, separated by semicolons
 *
 * @param {Object} data - The data object to be converted to a string.
 * @param {string} type - The type of data we're working with.
 *
 * @return {string}     - A stringified version of the Object
 */
export function dataStringify(data: Object, type: string): string | null {
	let csv = '';

	csv += Object.entries(data)
		.map((item) => {
			if (type === 'sequence') {
				return item[1].action + ':' + item[1].value;
			} else if (type === 'defaults') {
				return null;
			}
			return item[0] !== 'steps' && item[0] !== 'scene'
				? item[0] + ':' + item[1]
				: null;
		})
		.join(';');

	return csv;
}

/**
 * It takes a jss style object and returns a string of linted CSS code
 *
 * @param {Object} styleObject - The style object to be linted.
 * @return {string} A string of CSS code.
 */
export function lintCSS(styleObject: Object): string {
	return styleObject && Object.keys(styleObject).length
		? 'this {\n' +
				capitalToloDash(autoLintCode(styleObj2String(styleObject))) +
				';\n}'
		: 'this {\n\t\n}';
}

/**
 * It takes a string of CSS and converts it to an object
 * if this string is in jss format will be converted to css
 *
 * @param {string} style - the style string to be parsed
 *
 * @return {Object} - the css string converted into an object
 */
export const parseCSS = (style: string): Object => {
	// Remove all breaklines
	const result: string = style?.replace(/\n/g, '');
	// Get all the content inside "this{ }"
	const cssResult = result.match('this {(.*?)}');
	// Convert jss to css
	return css2obj(cssResult && cssResult.length > 0 ? cssResult[1] : false);
};

/**
 * It takes a string of CSS and returns an object of key/value pairs in jss format
 *
 * @param {string} css - The CSS string to convert to an object.
 * @return {Object} An object with the CSS properties as keys and the CSS values as values.
 */
export const css2obj = (css: string | false) => {
	const regExp = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g;
	const style: { [x: string]: string } = {};
	if (css) {
		css.replace(
			regExp,
			(m, p: string, value: string) => (style[loDashToCapital(p)] = value)
		);
		return style;
	}
	return {};
};

/**
 * JSON style object to a CSS string
 *
 * It takes an object of CSS styles and returns a string of CSS styles
 *
 * @param {Object} style       - The style object to convert to a string.
 * @param {string} [indent=\t] - The string to use for indentation.
 */
export const styleObj2String = (style: object, indent: string = '\t') =>
	Object.entries(style)
		.map(([k, v]) => indent + `${k}: ${v}`)
		.join(';');

/**
 * It takes a string and replaces all capital letters with a dash followed by the lowercase version of the letter
 *
 * @param {string} k - The string to be converted.
 */
export const capitalToloDash = (k: string) =>
	k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

/**
 * Replace all hyphens followed by a lowercase letter with the same letter capitalized.
 *
 * @param {string} k - The string to be converted.
 */
export const loDashToCapital = (k: string): string =>
	k.replace(/-[a-z]/g, (match) => `${match[1].toUpperCase()}`);

/**
 * It takes a string of JavaScript code and adds a newline after every semicolon and opening curly brace
 *
 * @param k The code to be linted.
 * @return value the matched value with a new line character appended to it.
 */
export const autoLintCode = (k: string) =>
	k.replace(/\;| \{/gi, function (matched) {
		return matched + '\n';
	});

/**
 * Parses the options string and returns an array of parsed arguments.
 *
 * @param {string} opts - The options string to parse.
 * @return {Array<Array<string>>} An array of parsed arguments.
 */
export const parseOptions = (opts: string): string[][] => {
	const rawArgs = opts.split(';');
	let parsedArgs = [];
	parsedArgs = rawArgs.map((arg) => arg.split(':'));
	return parsedArgs;
};

/**
 * Parses the dataset stored with wp editor and returns an object with the arguments as keys and values
 *
 * @param {string} opts - The string of data attributes that we want to parse.
 * @return {Object | undefined} - An object with the key being the first element of the array and the value being the second element of the array.
 */
export const getElementData = (
	opts: string
): SSCAnimationDefaults | undefined => {
	if (opts) {
		const parsedArgs = parseOptions(opts);

		const args: any = {};
		parsedArgs.forEach((el) => {
			if (el[0] !== 'default') {
				args[el[0]] = el[1];
			}
		});
		return args as SSCAnimationDefaults;
	}
	return undefined;
};

/**
 * Parses the dataset stored with wp editor and returns an object with the arguments as keys and values
 *
 * @param {string} opts - The string of data attributes that we want to parse.
 * @return {Object | undefined} - An object with the key being the first element of the array and the value being the second element of the array.
 */
export const getElementStyle = (opts: string): StyleRule[] => {
	if (opts) {
		const parsedArgs = parseOptions(opts);

		const style: StyleRule[] = [];
		parsedArgs.forEach((el: string[], index: number) => {
			if (el[0] !== 'defalut') {
				style[index] = {
					property: el[0],
					value: el[1],
				};
			}
		});
		return style;
	}
	return [];
};

/**
 * Split a sentence into words or letters
 *
 * It takes a sentence and splits it into words, then splits each word into letters
 *
 * @param {string} sentence       - The sentence to be split.
 * @param {string} [splitBy=word] - 'word' or 'letter'
 *
 * @return {string} A string of HTML with the words and letters wrapped in span tags.
 */
export function splitSentence(
	sentence: string,
	splitBy: string = 'word'
): string {
	const words = sentence.split(' ');
	const result = words.map((word) => {
		if (splitBy === 'word') {
			return `<span class="word">${word}</span>`;
		}
		return (
			'<span class="word">' +
			word.replace(
				/([^\x00-\x80]|\w)/g,
				`<span class="letter">$&</span>`
			) +
			'</span>'
		);
	});
	return result.join(' ');
}

/**
 * It takes an animation type and returns the default values for that animation
 *
 * @param {string} opt - The animation type selected.
 *
 * @return {Object} The default values for the animation type.
 */
export const getDefaults = (opt: string): SSCAnimationDefaults | undefined => {
	return animationTypes.find((animation) => animation.value === opt);
};

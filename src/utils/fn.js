import { animationTypes } from './data';

/**
 * It takes a data object and a type string, and returns a string of the data object's key/value pairs, separated by semicolons
 *
 * @param {Object} data - The data object to be converted to a string.
 * @param {string} type - The type of data we're working with.
 *
 * @return {string}     - A stringified version of the Object
 */
export function dataStringify( data, type ) {
	let csv = '';

	csv += Object.entries( data )
		.map( ( item ) => {
			if ( type === 'sequence' ) {
				return item[ 1 ].action + ':' + item[ 1 ].value;
			}
			return item[ 0 ] !== 'steps' && item[ 0 ] !== 'scene'
				? item[ 0 ] + ':' + item[ 1 ]
				: null;
		} )
		.join( ';' );
	return csv || null;
}

/**
 * It takes a jss style object and returns a string of linted CSS code
 *
 * @param {string} style - The style object to be linted.
 *
 * @return {string} A string of CSS code.
 */
export function lintCSS( style ) {
	return style && Object.keys( style ).length
		? 'this {\n' + capitalToloDash( autoLintCode( styleObj2String( style ) ) ) + ';\n}'
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
export const parseCSS = ( style ) => {
	// remove all breaklines
	let result = style.replaceAll( '\n', '' );
	// get all the content inside "this{ }"
	result = result.match( 'this {(.*?)}' )[ 1 ];
	// convert jss to css
	result = css2obj( loDashToCapital( result ) );
	return result;
};

/**
 * It takes a string of CSS and returns an object of key/value pairs in jss format
 *
 * @param {string} css - The CSS string to convert to an object.
 * @return {Object} An object with the CSS properties as keys and the CSS values as values.
 */
export const css2obj = ( css ) => {
	const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
		o = {};
	css.replace( r, ( m, p, v ) => ( o[ p ] = v ) );
	return o;
};

/**
 * JSON style object to a CSS string
 *
 * It takes an object of CSS styles and returns a string of CSS styles
 *
 * @param {Object} style       - The style object to convert to a string.
 * @param {string} [indent=\t] - The string to use for indentation.
 */
export const styleObj2String = ( style, indent = '\t' ) =>
	Object.entries( style )
		.map( ( [ k, v ] ) => indent + `${ k }: ${ v }` )
		.join( ';' );

/**
 * It takes a string and replaces all capital letters with a dash followed by the lowercase version of the letter
 *
 * @param {string} k - The string to be converted.
 */
export const capitalToloDash = ( k ) =>
	k.replace( /[A-Z]/g, ( match ) => `-${ match.toLowerCase() }` );

/**
 * Replace all hyphens followed by a lowercase letter with the same letter capitalized.
 *
 * @param {string} k - The string to be converted.
 */
export const loDashToCapital = ( k ) =>
	k.replace( /-[a-z]/g, ( match ) => `${ match[ 1 ].toUpperCase() }` );

/**
 * It takes a string of JavaScript code and adds a newline after every semicolon and opening curly brace
 *
 * @param {string} k - The code to be linted.
 * @return {string} the matched value with a new line character appended to it.
 */
export const autoLintCode = ( k ) =>
	k.replace( /\;| \{/gi, function( matched ) {
		return matched + '\n';
	} );

/**
 * Parses the dataset stored with wp editor and returns an object with the arguments as keys and values
 *
 * @param {string} opts        - The string of data attributes that we want to parse.
 * @param {string} [type=data] - The type of data you want to get. Use style to parse css style
 * @return {Object}            - An object with the key being the first element of the array and the value being the second element of the array.
 */
export const getElelementData = ( opts, type = 'data' ) => {
	if ( opts ) {
		const rawArgs = opts.split( ';' );
		let parsedArgs = [];
		parsedArgs = rawArgs.map( ( arg ) => arg.split( ':' ) );
		const args = {};
		parsedArgs.forEach( ( el, index ) => {
			if ( type === 'style' ) {
				args[ index ] = { property: el[ 0 ], value: el[ 1 ] };
			} else {
				args[ el[ 0 ] ] = el[ 1 ];
			}
		} );
		return args;
	}
	return false;
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
export function splitSentence( sentence, splitBy = 'word' ) {
	const words = sentence.split( ' ' );
	const result = words.map( ( word ) => {
		if ( splitBy === 'word' ) {
			return `<span class="word">${ word }</span>`;
		}
		return (
			'<span class="word">' +
			word.replace( /\S/g, `<span class="letter">$&</span>` ) +
			'</span>'
		);
	} );
	return result.join( ' ' );
}

/**
 * It takes an animation type and returns the default values for that animation
 *
 * @param {string} opt - The animation type selected.
 *
 * @return {Object} The default values for the animation type.
 */
export const getDefaults = ( opt ) => {
	const animationType = animationTypes.filter( ( animation ) => {
		return animation.value ? animation.value === opt : null;
	} );
	return animationType[ 0 ] ? animationType[ 0 ].default : {};
};

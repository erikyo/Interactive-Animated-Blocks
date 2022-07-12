import { animationTypes } from './data';

export function dataStringify( data, type ) {
	let csv = '';

	csv += Object.entries( data )
		.map( ( item ) => {
			if ( type === 'sequence' ) {
				return item[ 1 ].action + ':' + item[ 1 ].value;
			}
			// delete data.steps;
			return item[ 0 ] !== 'steps' && item[ 0 ] !== 'scene'
				? item[ 0 ] + ':' + item[ 1 ]
				: null;
		} )
		.join( ';' );
	return csv || null;
}

export const css2obj = ( css ) => {
	const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
		o = {};
	css.replace( r, ( m, p, v ) => ( o[ p ] = v ) );
	return o;
};

// JSON style object to a CSS string
export const styleObj2String = ( style, indent = '\t' ) =>
	Object.entries( style )
		.map( ( [ k, v ] ) => indent + `${ k }: ${ v }` )
		.join( ';' );

// Replace any capital letter with dash lowercase letter
export const capitalToloDash = ( k ) =>
	k.replace( /[A-Z]/g, ( match ) => `-${ match.toLowerCase() }` );

// Replace any capital letter with dash lowercase letter
export const loDashToCapital = ( k ) =>
	k.replace( /-[a-z]/g, ( match ) => `${ match[ 1 ].toUpperCase() }` );

// Replace any capital letter with dash lowercase letter
export const autoLintCode = ( k ) =>
	k.replace( /\;| \{/gi, function ( matched ) {
		return matched + '\n';
	} );

// parse data stored with wp editor into element dataset and transform into properties / style to provide a faster access
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

// get default setting
export const getDefaults = ( opt ) => {
	const animationType = animationTypes.filter( ( animation ) => {
		return animation.value ? animation.value === opt : null;
	} );
	return animationType[ 0 ] ? animationType[ 0 ].default : {};
};

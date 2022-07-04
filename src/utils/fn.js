import { animationTypes } from '../utils/data';

export function dataStringify( data, type ) {
	let csv = '';

	csv += Object.entries( data )
		.map( ( item ) => {
			if ( type === 'sequence' ) {
				return item[ 1 ].action + ':' + item[ 1 ].value;
			}
			// delete data.steps;
			return ! data.steps ? item[ 0 ] + ':' + item[ 1 ] : null;
		} )
		.join( ';' );
	return csv || null;
}

export function cssize( style ) {
	// split css rule and
	// remove line breaks
	style = style.replace( /(\r\n|\n|\r)/gm, '' );
	const styleParsed = style.split( ';' ).filter( ( element ) => element );

	if ( ! styleParsed ) {
		return false;
	}

	// parse each css rule gathered
	const Styleraw = [];
	styleParsed.forEach( ( rule ) => Styleraw.push( rule.split( ':' ) ) );

	const Stylejs = {};
	Styleraw.forEach( ( rule ) => ( Stylejs[ rule[ 0 ] ] = rule[ 1 ] ) );

	return Stylejs;
}

// get default setting
export const getDefaults = ( opt ) => {
	const animationType = animationTypes.filter( ( animation ) => {
		return animation.value === opt;
	} );
	return animationType[ 0 ].default || {};
};

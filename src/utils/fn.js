import { animationTypes } from './data';

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
	// split css rule and remove line breaks
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
		return animation.value === opt;
	} );
	return animationType[ 0 ].default || {};
};


// detect available wheel event
export const mouseWheel =
  'onwheel' in document.createElement( 'div' )
    ? 'wheel' // Modern browsers support "wheel"
    : document.onmousewheel !== undefined
      ? 'mousewheel' // Webkit and IE support at least "mousewheel"
      : 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

// An ease-out function that slows the count as it progresses
export const easeOutQuad = ( t ) => t * ( 2 - t );

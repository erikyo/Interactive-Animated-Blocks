import './styles/ssc.scss';
import _ssc from './frontend/_ssc';

/**
 * Exporting the sscOptions object.
 */
export const sscOptions = {
	rootMargin: '0px', // the IntersectionObserver root margin
	// removed because we only need to know if the element is entering or leaving the viewport
	// const intersectionPrecision = 5;
	// threshold: [ ...Array( intersectionPrecision + 1 ).keys() ].map( ( x ) => x / intersectionPrecision ), // 1-100 the precision of intersections (higher number increase cpu usage - use with care!)
	threshold: [ 0 ],
	container: document.querySelector( '.wp-site-blocks' ), // maybe document.getElementById( 'page' );
};

/**
 * On page scripts load trigger immediately ssc using sscOptions
 */
window.addEventListener( 'load', () => {
	const options = {
		page: sscOptions.container,
	};

	typeof window.screenControl
		? ( window.screenControl = new _ssc( options ) )
		: console.warn( 'SSC ERROR: unable to load multiple instances' );
} );

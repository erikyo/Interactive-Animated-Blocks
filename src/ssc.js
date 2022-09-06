import './styles/ssc.scss';
import _ssc from './frontend/_ssc';


/**
 * Exports the sscOptions object.
 * It returns an object with the rootMargin, threshold, and container properties
 *
 * @returns An object with three properties:
 * rootMargin: A string that defines the margins around the root element.
 * threshold: An array of numbers between 0 and 1 that defines the percentage of the target element that should be visible before it is considered visible.
 * container: The element that is used as the viewport for checking visibility of the target.
 */
export const sscOptions = function() {
	return {
		rootMargin: document.body.classList.contains( 'admin-bar' ) ? '32px 0px 1px 0px' : '1px', // the IntersectionObserver root margin
		// removed because we only need to know if the element is entering or leaving the viewport
		// const intersectionPrecision = 5;
		// threshold: [ ...Array( intersectionPrecision + 1 ).keys() ].map( ( x ) => x / intersectionPrecision ), // 1-100 the precision of intersections (higher number increase cpu usage - use with care!)
		threshold: [ 0 ],
		container: document.querySelector( '.wp-site-blocks' ) || document.body, // maybe document.getElementById( 'page' );
	};
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

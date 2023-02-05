import './styles/ssc.scss';
import _ssc from './frontend/_ssc';

/**
 * Exports the sscOptions object.
 * It returns an object with the rootMargin, threshold, and container properties
 *
 * @return An object with three properties:
 * rootMargin: A string that defines the margins around the root element.
 * threshold: An array of numbers between 0 and 1 that defines the percentage of the target element that should be visible before it is considered visible.
 * container: The element that is used as the viewport for checking visibility of the target.
 */
const sscOptionsDefault: {
	container: HTMLElement;
	rootMargin: string;
	threshold: number[];
} = {
	rootMargin: '0px', // the IntersectionObserver root margin
	threshold: [ 0 ],
	container: document.body,
};

export const options = { ...sscOptionsDefault };

/**
 * On page scripts load trigger immediately ssc using sscOptions
 */
window.addEventListener( 'load', () => {
	if ( typeof window.screenControl ) {
		window.screenControl = new _ssc( options );
	} else {
		throw new Error( 'SSC ERROR: unable to load multiple instances' );
	}
} );

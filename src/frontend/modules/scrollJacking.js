// ScrollTo

import { options } from '../../ssc';
import { mouseWheel } from '../../utils/compat';
import { isPartiallyVisible, delay, disableWheel, isInside } from '../../utils/utils';
import anime from 'animejs';

/**
 * Flag if another scroll-jacking is running to avoid to fire multiple this function
 *
 * @type {boolean|number}
 */
export let hasScrolling = false;

/**
 * If the targetID is a number, then set the hasScrolling variable to that number, otherwise set it to false.
 *
 * @param {string} targetID - The ID of the target element to scroll to.
 *
 * @return {string} the value of the variable hasScrolling.
 */
export function setScrolling( targetID ) {
	return hasScrolling = parseInt( targetID, 10 );
}

let lastVideoScrollPosition = 0;

/**
 * It scrolls to the target element
 *
 * @module scrollJacking
 *
 * @param {IntersectionObserverEntry} entry - The entry object that is passed to the callback function.
 *
 * @return {Function} A function that will be called when the IntersectionObserver fires.
 */
function scrollJacking( entry ) {
	// if there aren't any defined target, store this one
	if ( entry.target.action !== 'enter' || hasScrolling ) {
		return false;
	}

	const intersection = parseInt( entry.target.sscItemOpts.intersection, 10 );
	const duration = parseInt( entry.target.sscItemOpts.duration, 10 );
	const scrollDelay = parseInt( entry.target.sscItemOpts.delay, 10 );

	/**
	 * It scrolls to the element passed to it
	 *
	 * @param {IntersectionObserverEntry} el - The element that was clicked.
	 *
	 * @return {Function} A function that is being called with the element as a parameter.
	 */
	function screenJackTo( el ) {
		// disable the mouse wheel during scrolling to avoid flickering
		options.container.addEventListener( mouseWheel, disableWheel, { passive: false } );
    options.container.addEventListener( 'touchmove', disableWheel, false );

		if ( window.scrollY === lastVideoScrollPosition ) {
			// defer scroll jacking if the window hasn't been scrolled
			delay( 20 ).then( () => scrollJacking( el ) );
		}

		// Store the last position
		lastVideoScrollPosition = window.scrollY;

		setScrolling( el.target.sscItemData.sscItem );

		/** Stores the history state */
		if ( el.target.id ) {
			window.history.pushState( null, null, '#' + el.target.id );
		}

		/**
		 *  Anime.js animation
		 *
		 *  @module Animation
		 */
		//anime.remove(); // remove any previous animation
		anime( {
			targets: [
				window.document.scrollingElement ||
					window.document.body ||
					window.document.documentElement,
			],
			scrollTop: el.target.offsetTop + 10,
			easing: el.target.sscItemOpts.easing || 'linear',
			duration: duration || 700,
			delay: 0,
		} );

		delay(
			parseInt( scrollDelay, 10 ) + duration || 1000
		).then( () => {
			// this.windowData.lastScrollPosition = window.scrollY;
			// window.scrollY = el.target.offsetTop;
			hasScrolling = false;
			options.container.removeEventListener( mouseWheel, disableWheel );
			options.container.removeEventListener( 'touchmove', disableWheel );
		} );
	}

	if ( ! hasScrolling && isInside( entry.target, intersection ) ) {
		return screenJackTo( entry );
	} else if ( isPartiallyVisible( entry.target ) ) {
		delay( 20 ).then( () => scrollJacking( entry ) );
	}
}

export default scrollJacking;

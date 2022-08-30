// ScrollTo
import { mouseWheel } from '../../utils/compat';
import { isPartiallyVisible, delay, disableWheel, isActiveArea, isInView } from '../../utils/utils';
import anime from 'animejs';

/**
 * Flag if another scroll-jacking is running to avoid to fire multiple this function
 *
 * @type {boolean|number}
 */
export let hasScrolling = false;
/**
 * @param {string} targetID
 */
export function setScrolling( targetID ) {
	console.log( 'next target scroll to:', hasScrolling );
	return parseInt( targetID, 10 );
}

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
		if ( hasScrolling ) {
			console.log( 'already scrolling to ', hasScrolling );
		}
		return false;
	}

	const intersection = parseInt( entry.target.sscItemOpts.intersection, 10 );
	const duration = parseInt( entry.target.sscItemOpts.duration, 10 );

	const screenJackTo = ( el ) => {
		// disable the mouse wheel during scrolling to avoid flickering
		document.body.addEventListener( mouseWheel, disableWheel, { passive: false } );
		document.body.addEventListener( 'touchmove', disableWheel, false );

		hasScrolling = setScrolling( el.target.sscItemData.sscItem );

		/** Stores the history state */
		if ( el.target.id ) {
			window.history.pushState( null, null, '#' + el.target.id );
		}

		/**
		 *  Anime.js animation
		 *
		 *  @module Animation
		 */
		anime.remove(); // remove any previous animation
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
			parseInt( el.target.sscItemOpts.delay, 10 ) + duration || 1000
		).then( () => {
			// this.windowData.lastScrollPosition = window.scrollY;
			// window.scrollY = el.target.offsetTop;
			hasScrolling = false;
			document.body.removeEventListener( mouseWheel, disableWheel );
			document.body.removeEventListener( 'touchmove', disableWheel );
		} );
	};

	if ( isActiveArea( entry.target, intersection ) ) {
		screenJackTo( entry );
	} else if ( isPartiallyVisible( entry.target ) ) {
		delay( 100 ).then( () => scrollJacking( entry ) );
	}
}

export default scrollJacking;

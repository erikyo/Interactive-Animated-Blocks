// ScrollTo
import { mouseWheel } from '../../utils/compat';
import { isPartiallyVisible, delay, disableWheel } from '../../utils/utils';
import anime from 'animejs';

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
	if ( entry.target.action !== 'enter' && this.hasScrolling !== false ) {
		return false;
	}

	this.hasScrolling = entry.target.sscItemData.sscItem;

	const screenJackTo = ( el ) => {
		// disable the mouse wheel during scrolling to avoid flickering
		window.addEventListener( mouseWheel, disableWheel, { passive: false } );
		window.addEventListener( 'touchmove', disableWheel, false );
		window.scrollTo( {
			top: window.scrollY,
			behavior: 'auto',
		} );

		const duration = parseInt( el.target.sscItemOpts.duration, 10 );

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
			complete: () => {
				delay(
					parseInt( el.target.sscItemOpts.delay, 10 ) || 200
				).then( () => {
					// this.windowData.lastScrollPosition = window.scrollY;
					// window.scrollY = el.target.offsetTop;
					this.hasScrolling = false;
					window.removeEventListener( mouseWheel, disableWheel );
					window.removeEventListener( 'touchmove', disableWheel );
				} );
			},
		} );
	};

	if ( isPartiallyVisible( entry.target ) ) {
		screenJackTo( entry );
	}
}

export default scrollJacking;

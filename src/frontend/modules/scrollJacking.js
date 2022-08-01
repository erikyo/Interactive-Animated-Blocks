// ScrollTo
import { mouseWheel } from '../../utils/compat';
import { isPartiallyVisible, delay, disableWheel } from '../../utils/utils';
import anime from 'animejs';

function scrollJacking( entry ) {
	// if there aren't any defined target, store this one
	if ( entry.target.action !== 'enter' || this.hasScrolling !== false )
		return false;

	this.hasScrolling = entry.target.sscItemData.sscItem;

	const screenJackTo = ( el ) => {
		// disable the mouse wheel during scrolling to avoid flickering
		window.addEventListener( mouseWheel, disableWheel, {
			passive: false,
		} );

		const duration = parseInt( el.target.sscItemOpts.duration, 10 );

		if ( el.target.id )
			window.history.pushState( null, null, '#' + el.target.id );

		// remove any previous animation
		anime.remove();
		anime( {
			targets: [
				window.document.scrollingElement ||
					window.document.body ||
					window.document.documentElement,
			],
			scrollTop: el.target.offsetTop + 10,
			easing: el.target.sscItemOpts.easing || 'linear',
			duration: duration || 700,
			delay: parseInt( el.target.sscItemOpts.delay, 10 ) || 0,
			complete: () => {
				delay( 200 ).then( () => {
					// this.windowData.lastScrollPosition = window.scrollY;
					// window.scrollY = el.target.offsetTop;
					this.hasScrolling = false;
					return window.removeEventListener(
						mouseWheel,
						disableWheel,
						{
							passive: false,
						}
					);
				} );
			},
		} );
	};

	if ( isPartiallyVisible( entry.target ) ) {
		screenJackTo( entry );
	}
};

export default scrollJacking;

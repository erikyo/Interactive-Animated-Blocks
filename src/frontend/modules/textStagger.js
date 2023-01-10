import anime from 'animejs';
import { textStaggerPresets } from '../../utils/data';
import { delay, isActiveArea } from '../../utils/utils';
import { splitSentence } from '../../utils/fn';

/**
 * It splits the text into individual letters, then animates them in a staggered fashion
 *
 * @module textStagger
 * @param {IntersectionObserverEntry} entry - The entry object passed to the callback function.
 *
 * @todo - provide an option to "start hidden"
 *
 * @return {Function} - if the element is not inside the active area it returns itself in 200ms
 */
function textStagger( entry ) {
	const item = entry.target;
	const intersectionArea =
		parseInt( item.sscItemOpts.intersection, 10 ) || 80;

	if (
		item.action === 'enter' &&
		isActiveArea( entry.target, intersectionArea )
	) {
		const preset = item.sscItemOpts.preset;
		const duration = parseInt( item.sscItemOpts.duration, 10 );
		const animationDelay = parseInt( item.sscItemOpts.delay, 10 );
		const easing = item.sscItemOpts.easing;
		const splitBy = item.sscItemOpts.splitBy || 'letter';

		const replaced = splitSentence( item.lastChild.textContent, splitBy );

		if ( item.lastChild.innerHTML ) {
			item.lastChild.innerHTML = replaced;
		} else {
			item.innerHTML = replaced;
		}

		item.style.position = 'relative';

		const anim = anime.timeline( {
			loop: false,
			autoplay: false,
			animationDelay,
		} );

		textStaggerPresets[ preset ].forEach( ( data, index ) => {
			switch ( index ) {
				case 0:
					anim.add( {
						...textStaggerPresets[ preset ][ index ],
						targets: item.querySelectorAll( '.' + splitBy ),
						duration: duration * 0.75,
						easing,
						delay: anime.stagger( duration * 0.05 ),
						...data,
					} );
					break;
				case 1:
					anim.add( {
						...( textStaggerPresets[ preset ][ index ] || null ),
						targets: item,
						easing,
						duration,
						delay: duration,
						...data,
					} );
					break;
				default:
					anim.add( {
						...( textStaggerPresets[ preset ][ index ] || null ),
						targets: item,
						easing,
						...data,
					} );
					break;
			}
		} );

		return anim.play();
	}

	// TODO: isn't worth to provide a kind of option for this?
	delay( 200 ).then( () => textStagger( entry ) );
}

export default textStagger;

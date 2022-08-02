import anime from 'animejs';
import { textStaggerPresets } from '../../utils/data';
import { delay, isActiveArea } from '../../utils/utils';
import { splitSentence } from '../../utils/fn';

function textStagger( entry ) {
	const item = entry.target;

	if ( item.action === 'enter' && isActiveArea( entry.target, 75 ) ) {
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

	delay( 200 ).then( () => textStagger( entry ) );
}

export default textStagger;

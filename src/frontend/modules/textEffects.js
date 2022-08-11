import anime from 'animejs';
import { delay } from '../../utils/utils';
import { splitSentence } from '../../utils/fn';

/**
 * Animate words and numbers
 * It splits the text into letters, wraps each letter in a span, and then animates each letter
 *
 * @param {HTMLElement} el - The element that is being animated.
 */
const animateWord = ( el ) => {
	const animateLetter = ( letter ) => {
		const alpha = [
			'!',
			'#',
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'A',
			'M',
			'T',
			'P',
			'W',
			'G',
			'E',
			'R',
			'I',
			'K',
		];

		letter.classList.add( 'changing' ); //change color of letter
		const original = letter.innerHTML; //get original letter for use later
		/*.letter{
      &.changing{
        color: lightgray;
      }
    }*/

		//loop through random letters
		let i = 0;
		const letterInterval = setInterval( function() {
			// Get random letter
			const randomLetter =
				alpha[ Math.floor( Math.random() * alpha.length ) ];
			letter.innerHTML = randomLetter;
			if ( i >= Math.random() * 100 || randomLetter === original ) {
				//if letter has changed around 10 times then stop
				clearInterval( letterInterval );
				letter.innerHTML = original; //set back to original letter
				letter.classList.remove( 'changing' ); //reset color
			}
			++i;
		}, 100 );
	};

	const letters = el.querySelectorAll( '.letter' );
	const shuffleDuration = el.sscItemOpts.duration;

	letters.forEach( function( letter, index ) {
		//trigger animation for each letter in word
		setTimeout( function() {
			animateLetter( letter, shuffleDuration );
		}, 100 * index ); //small delay for each letter
	} );

	setTimeout( function() {
		el.removeAttribute( 'data-ssc-count' );
	}, shuffleDuration );
};

/**
 * Animate Numbers
 *
 * @param {Object} el Element to animate.
 */
function animateCount( el ) {
	anime( {
		targets: el.target || el.target.lastChild,
		textContent: [ 0, parseInt( el.target.lastChild.textContent, 10 ) ],
		round: 1,
		duration: parseInt( el.target.sscItemOpts.duration ) || 5000,
		delay: parseInt( el.target.sscItemOpts.delay ) || 500,
		easing: el.target.sscItemOpts.easing,
		complete: () => el.target.removeAttribute( 'data-ssc-count' ),
	} );
}

/**
 * It checks if the element has already been animated, and if not, it either animates the number or the text
 *
 * @module textAnimated
 *
 * @param {IntersectionObserverEntry} el - The element that is being animated.
 */
function textAnimated( el ) {
	if ( el.target.dataset.sscCount || el.target.action === 'leave' ) {
		return true;
	}
	el.target.dataset.sscCount = 'true';

	if ( el.target.sscItemOpts.target === 'number' ) {
		animateCount( el );
	} else {
		if ( ! el.target.dataset.init ) {
			const replaced = splitSentence( el.target.innerHTML, 'letters' );

			if ( el.target.innerHTML ) {
				el.target.innerHTML = replaced;
			}
			el.target.dataset.init = 'true';
		}

		delay( el.target.sscItemOpts.delay ).then( () =>
			animateWord( el.target )
		);
	}
}

export default textAnimated;

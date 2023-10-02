import anime from 'animejs/lib/anime.es.js'
import { delay } from '../../utils/utils';
import { splitSentence } from '../../utils/fn';
import type {
	SSCAnimationTypeCounter,
	SSCAnimationTypeStagger,
	SscElement,
} from '../../types';

/**
 * Animate words and numbers
 * It splits the text into letters, wraps each letter in a span, and then animates each letter
 *
 * @param {HTMLElement} el      - The element that is being animated.
 * @param               options
 */
const animateWord = (el: HTMLElement, options: SSCAnimationTypeStagger) => {
	const animateLetter = (letter: HTMLElement): void => {
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

		letter.classList.add('changing'); //change color of letter
		const original = letter.innerHTML; //get original letter for use later
		/*.letter{
      &.changing{
        color: lightgray;
      }
    }*/

		//loop through random letters
		let i = 0;
		const letterInterval = setInterval(function () {
			// Get random letter
			const randomLetter =
				alpha[Math.floor(Math.random() * alpha.length)];
			letter.innerHTML = randomLetter;
			if (i >= Math.random() * 100 || randomLetter === original) {
				//if letter has changed around 10 times then stop
				clearInterval(letterInterval);
				letter.innerHTML = original; //set back to original letter
				letter.classList.remove('changing'); //reset color
			}
			++i;
		}, 100);
	};

	const letters = el.querySelectorAll('.letter') as NodeListOf<HTMLElement>;
	const shuffleDuration = options.duration;

	letters.forEach((letter, index: number) => {
		//trigger animation for each letter in word
		setTimeout(function () {
			animateLetter(letter);
		}, 100 * index); //small delay for each letter
	});

	setTimeout(function () {
		el.removeAttribute('data-ssc-count');
	}, shuffleDuration);
};

/**
 * Animate Numbers
 * It splits the text into numbers, wraps each number in a span, and then animates each number
 *
 * @param element Element to animate.
 * @param options
 */
function animateCount(element: SscElement, options: SSCAnimationTypeCounter) {
	anime({
		targets: element || (element as HTMLElement).lastChild,
		textContent: [0, Number(element.lastChild?.textContent)],
		round: 1,
		duration: Number(options.duration) || 5000,
		delay: Number(options.delay) || 500,
		easing: options.easing,
		complete: () => element.removeAttribute('data-ssc-count'),
	});
}

/**
 * It checks if the element has already been animated, and if not, it either animates the number or the text
 *
 * @module textAnimated
 *
 * @param {SscElement} element - The element that is being animated.
 */
function textAnimated(element: SscElement) {
	if (element.dataset.sscCount || element.action === 'leave') {
		return true;
	}
	const options = element.sscItemOpts as
		| SSCAnimationTypeCounter
		| SSCAnimationTypeStagger;
	element.dataset.sscCount = 'true';

	if (options.target === 'number') {
		animateCount(element, options as SSCAnimationTypeCounter);
	} else {
		const textContent = element.textContent;
		if (!element.dataset.init && textContent) {
			const replaced = splitSentence(textContent, 'letters');

			if (element.innerHTML) {
				element.innerHTML = replaced;
			}
			element.dataset.init = 'true';
		}

		delay(options.delay).then(() =>
			animateWord(element, options as SSCAnimationTypeStagger)
		);
	}
}

export default textAnimated;

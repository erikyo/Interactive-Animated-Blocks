import anime from 'animejs/lib/anime.es.js';
import { textStaggerPresets } from '../../utils/data';
import { delay, isActiveArea } from '../../utils/utils';
import { splitSentence } from '../../utils/fn';
import type { SSCAnimationTypeStagger, SscElement } from '../../types';

/**
 * It splits the text into individual letters, then animates them in a staggered fashion
 *
 * @module textStagger
 * @param {SscElement} element - The entry object passed to the callback function.
 *
 * @todo - provide an option to "start hidden"
 *
 * @return {Function} - if the element is not inside the active area it returns itself in 200ms
 */
function textStagger(element: SscElement) {
	const textStaggerOptions = element.sscItemOpts as SSCAnimationTypeStagger;
	const intersectionArea = Number(textStaggerOptions.activeArea) || 80;

	if (element.action === 'enter' && isActiveArea(element, intersectionArea)) {
		const preset = textStaggerOptions.preset;
		const duration = Number(textStaggerOptions.duration);
		const animationDelay = Number(textStaggerOptions.delay);
		const easing = textStaggerOptions.easing;
		const splitBy = textStaggerOptions.splitBy || 'letter';

		if (!element.lastChild?.textContent) return;

		const replaced = splitSentence(element.lastChild?.textContent, splitBy);

		if ((element.lastChild as HTMLElement)?.innerHTML) {
			(element.lastChild as HTMLElement).innerHTML = replaced;
		} else {
			element.innerHTML = replaced;
		}

		element.style.position = 'relative';

		const anim = anime.timeline({
			loop: false,
			autoplay: false,
			animationDelay,
		});

		textStaggerPresets[preset].forEach((data, index) => {
			switch (index) {
				case 0:
					anim.add({
						...textStaggerPresets[preset][index],
						targets: element.querySelectorAll('.' + splitBy),
						duration: duration * 0.75,
						easing,
						delay: anime.stagger(duration * 0.05),
						...data,
					});
					break;
				case 1:
					anim.add({
						...(textStaggerPresets[preset][index] || null),
						targets: element,
						easing,
						duration,
						delay: duration,
						...data,
					});
					break;
				default:
					anim.add({
						...(textStaggerPresets[preset][index] || null),
						targets: element,
						easing,
						...data,
					});
					break;
			}
		});

		return anim.play();
	}

	// TODO: isn't worth to provide a kind of option for this?
	delay(200).then(() => textStagger(element));
}

export default textStagger;

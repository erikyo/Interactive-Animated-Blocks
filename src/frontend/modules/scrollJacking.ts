// ScrollTo
import {
	delay,
	disableWheel,
	isInside,
	isPartiallyVisible,
} from '../../utils/utils';

import scrollToElement from 'scroll-to-element';

import { mouseWheel } from '../../utils/compat';

/**
 * store if another scroll-jacking is running to avoid to be fire multiple
 *
 * @type {boolean|number}
 */
export let hasScrolling = false;

/**
 * It scrolls to the element passed to it
 *
 * @param {IntersectionObserverEntry.target} el - The element that was clicked.
 */
export function screenJackTo(el) {
	hasScrolling = true;
	const duration = parseInt(el.sscItemOpts.duration, 10);
	const scrollDelay = parseInt(el.sscItemOpts.delay, 10);

	/** Stores the history state */
	if (el.id) {
		window.history.pushState(null, null, '#' + el.id);
	}

	// disable the mouse wheel during scrolling to avoid flickering
	window.addEventListener(mouseWheel, disableWheel, { passive: false });
	window.addEventListener('touchmove', disableWheel, false);

	const easing = el.sscItemOpts.easing
		.replace('easeI', 'i')
		.replace('easeO', 'o');

	scrollToElement(el, {
		offset: 0,
		ease: easing || 'inQuad', // https://github.com/component/ease
		duration: duration || 1000,
	}).on('end', () => {
		delay(scrollDelay).then(() => {
			hasScrolling = false;
			window.removeEventListener(mouseWheel, disableWheel);
			window.removeEventListener('touchmove', disableWheel);
		});
	});
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
export function scrollJacking(entry) {
	const intersection = parseInt(entry.target.sscItemOpts.intersection, 10);
	if (!hasScrolling && isInside(entry.target, intersection)) {
		return screenJackTo(entry.target);
	}

	if (isPartiallyVisible(entry.target)) {
		return delay(200).then(() => scrollJacking(entry));
	}
}

export default scrollJacking;

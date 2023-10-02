import {
	delay,
	disableWheel,
	isInside,
	isPartiallyVisible,
} from '../../utils/utils';

// @ts-ignore
import scrollToElement from 'scroll-to-element';

import { mouseWheel } from '../../utils/compat';
import type {
	SSCAnimationTypeJackscrolling,
	SscElement,
} from '../../types.d.ts';

/**
 * store if another scroll-jacking is running to avoid to be fire multiple
 *
 * @type {boolean|number}
 */
export let isScrolling = false;

/**
 * It scrolls to the element passed to it
 *
 * @param {IntersectionObserverEntry.target} el - The element that was clicked.
 */
export function screenJackTo(el: SscElement): void {
	isScrolling = true;
	const duration = parseInt(el.sscItemOpts.duration, 10);
	const scrollDelay = parseInt(el.sscItemOpts.delay, 10);

	/** Stores the history state */
	if (el.id) {
		window.history.pushState(null, '', '#' + el.id);
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
			isScrolling = false;
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
 * @param {IntersectionObserverEntry} element - The entry object that is passed to the callback function.
 *
 * @return A function that will be called when the IntersectionObserver fires.
 */
export function scrollJacking(element: SscElement): Promise<unknown> | void {
	const itemOptions = element.sscItemOpts as SSCAnimationTypeJackscrolling;
	const intersection = Number(itemOptions.activeArea) || 80;
	if (!isScrolling && isInside(element, intersection)) {
		return screenJackTo(element);
	}

	if (isPartiallyVisible(element)) {
		return delay(200).then(() => scrollJacking(element));
	}
}

export default scrollJacking;

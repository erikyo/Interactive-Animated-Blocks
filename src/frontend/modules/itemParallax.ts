import type { SSCAnimationTypeParallax, SscElement } from '../../types.d.ts';

// The watched list of items to be parallaxed
export const itemParallaxed: SscElement[] = [];

export function addToParallaxed(el: SscElement) {
	itemParallaxed[el.sscItemData?.sscItem] = el;
}

/** last scroll position */
let lastParallaxScrollPosition = 0;

/**
 * The Parallax effect
 * Handles the Parallax effect for each item stored into "itemParallaxed" array
 *
 * If the last scroll position is the same as the current scroll position, then request an animation frame and exit the current loop.
 * Otherwise, apply the parallax style to each element and request an animation frame callback.
 *
 * The parallax function is called on the window's scroll event
 *
 */
export function parallax(): number | undefined {
	// if last position is the same as current
	if (window.scrollY === lastParallaxScrollPosition) {
		// callback the animationFrame and exit the current loop
		return window.requestAnimationFrame(parallax);
	}

	itemParallaxed.forEach((element: SscElement) => {
		// apply the parallax style (use the element get getBoundingClientRect since we need updated data)
		const rect = element.getBoundingClientRect();
		const motion = window.innerHeight - rect.top;
		const elementOptions =
			element.sscItemOpts as SSCAnimationTypeParallax;
		if (motion > 0) {
			const styleValue =
				Number(elementOptions?.speed) *
				Number(elementOptions?.level) *
				motion *
				-0.01;
			const heightFix = styleValue + rect.height;
			element.style.transform =
				'translate3d(' +
				(elementOptions?.direction === 'y'
					? '0,' + heightFix + 'px'
					: heightFix + 'px,0') +
				',0)';
		}

		// Store the last position
		lastParallaxScrollPosition = window.scrollY;

		// requestAnimationFrame callback
		window.requestAnimationFrame(parallax);
	});
}

/**
 * If the item is entering the viewport, add it to the watched list and start the parallax function.
 * If the item is leaving the viewport, remove it from the watched list
 *
 * @module parallaxController
 *
 * @param  sscElement - the entry object that is passed to the callback function
 */
export function parallaxController(sscElement: SscElement) {
	// add this object to the watched list
	addToParallaxed(sscElement);
	// if the parallax function wasn't running before we need to start it
	if (itemParallaxed.length) {
		parallax();
	}
	// if the item is leaving the viewport
	if (sscElement.dataset.visible !== 'true') {
		// remove the animated item from the watched list
		delete itemParallaxed[sscElement.sscItemData.sscItem];
	}
}

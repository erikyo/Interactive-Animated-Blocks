import { windowProps } from '../frontend/_ssc';
import type {SscPositionYDef, WindowProps} from '../types.d.ts';

/**
 * This function returns a promise that resolves after the given number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay.
 */
export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * It prevents That the mouse wheel can change the position on the page
 *
 * @param {Event} e - The event object.
 */
export function disableWheel(e: WheelEvent) {
	e.preventDefault();
	e.stopPropagation();
	return false;
}

/**
 * Checks when the element is inside the viewport
 *
 * If the top of the element is above the bottom of the viewport or the bottom of the element is below the top of the viewport, then the element is partially visible.
 *
 * @param {HTMLElement} el - The element you want to check.
 * @return {boolean} true when the element is shown inside the viewport
 */
export const isPartiallyVisible = (el: HTMLElement) => {
	const rect = el.getBoundingClientRect();
	const innerHeight = windowProps.viewHeight;
	if (rect.height <= innerHeight) {
		return rect.bottom >= 0 || rect.top <= innerHeight;
	}
	return (
		(rect.top >= 0 && rect.top <= innerHeight) ||
		(rect.bottom >= 0 && rect.bottom <= innerHeight) ||
		(rect.top < 0 && rect.bottom > innerHeight)
	);
};

/**
 * Checks when the element is completely inside in the viewport edges
 *
 * "If the top of the element is greater than or equal to 0 and the bottom of the element is less than or equal to the height of the window, then the element is fully visible."
 *
 * @param {HTMLElement} el - The element you want to check if it's fully visible.
 * @return {boolean} if the item edges are completely inside the viewport
 */
export const isFullyVisible = (el: HTMLElement) => {
	const rect = el.getBoundingClientRect();
	return rect.top >= 0 && rect.bottom <= windowProps.viewHeight;
};

/**
 * Check when the element center (the median between Y top and Y bottom ) is inside the active area
 *
 * The element's center within 20% of the viewport's height from the top and bottom
 * The function returns true if the element's center is inside the active viewport, and false if it's not
 *
 * @param {HTMLElement} el            - The element you want to check if it's in the active area.
 * @param {number}      rangePosition - The percentage of the viewport's height that represents the active area
 * @return {boolean}                  - true if the element is inside the active area
 */
export const isActiveArea = (el: HTMLElement, rangePosition: number) => {
	const rect = el.getBoundingClientRect();
	const innerHeight = windowProps.viewHeight;
	const limit = innerHeight * (100 - rangePosition) * 0.005; // 20% of 1000px is 100px from top and 100px from bottom
	const elementCenter = rect.top + rect.height * 0.5;
	return limit < elementCenter && elementCenter < innerHeight - limit;
};

/**
 * Check when the element (top or bottom) is inside the active area, works well with elements larger than the screen like the jack scrolling container
 * The active area is a horizontal slice of the screen - the 80% active area in a 1000px height screen is the area between 100px from the top to 900px from the top (i.e. 800px height)
 *
 * It returns true if the element top or bottom is inside the active viewport, and false if it's not
 *
 * @param {HTMLElement} el            - The element you want to check if it's in the active area.
 * @param {number}      rangePosition - The percentage of the viewport's height that represents the active area
 *
 * @return {boolean|undefined}                  - true if the element is inside the active area
 */
export const isInside = (
	el: HTMLElement,
	rangePosition: number
): boolean | undefined => {
	const rect = el.getBoundingClientRect();
	const innerHeight = window.innerHeight;
	// eg. 20 (%) of 1000 (px) are the slice inside 100px from top and 100px from bottom
	const limit = innerHeight * 0.005 * rangePosition;
	// if the element top side is inside the view
	if (windowProps.direction === 'down') {
		return limit < rect.top && rect.top < innerHeight - limit;
	} else if (windowProps.direction === 'up') {
		return limit < rect.bottom && rect.bottom < innerHeight - limit;
	}
};

/**
 * If the center of the element is between the top and bottom margins of the active area, then the element is in view
 *
 * @param {Object} position         - The stored original position of the element in the viewport.
 * @param {number} intersectionArea - The percentage of the element that needs to be visible in order to trigger the animation.
 * @return {boolean}                - the element is in view true / false
 */
export const isInView = (
	position: SscPositionYDef,
	intersectionArea: number
) => {
	position.ycenter = (position.yTop + position.yBottom) * 0.5;
	const activeArea = intersectionArea * (window.innerHeight * 0.01);
	const inactiveArea = (window.innerHeight - activeArea) * 0.5;
	const margins = {
		top: window.scrollY + inactiveArea,
		bottom: window.scrollY + (window.innerHeight - inactiveArea),
	};
	return margins.top < position.ycenter && margins.bottom > position.ycenter;
};

/**
 * If the last scroll position is less than the current scroll position, the user is scrolling down.
 * If the last scroll position is greater than the current scroll position, the user is scrolling up
 *
 * @param {boolean} update
 */
export function scrollDirection(update: boolean = false) {
	const scrollY = window.scrollY;
	if (windowProps.lastScrollPosition < scrollY) {
		windowProps.direction = 'down';
	} else if (windowProps.lastScrollPosition > scrollY) {
		windowProps.direction = 'up';
	}
	if (update) windowProps.lastScrollPosition = scrollY;
}

/**
 * If the mouse is over the element, return true.
 *
 * @param {Event} e - The event object
 * @return {boolean} - Return true when the given element has the mouse over
 */
export const hasMouseOver = (e: MouseEvent) => {
	const mouseX: number = e.clientX;
	const mouseY: number = e.clientY;
	const rect: DOMRect = (e.target as HTMLElement).getBoundingClientRect();

	return rect
		? rect.left < mouseX &&
				mouseX < rect.right &&
				rect.top < mouseY &&
				mouseY < rect.bottom
		: false;
};

/**
 * detect weather the "old" touchPos is greater or smaller than the newTouchPos
 *
 * If the new touch position is greater than the old touch position, the finger is moving down.
 * If the new touch position is less than the old touch position, the finger is moving up.
 *
 * @param {TouchEvent} e          - the event object
 * @param              windowData
 */
function ontouchmoveEvent(e: TouchEvent, windowData: WindowProps) {
	const newTouchPos = e.changedTouches[0].clientY;
	if (windowData.touchPos.y) {
		if (newTouchPos > windowData.touchPos.y) {
			// eslint-disable-next-line no-console
			console.log('finger moving down');
		} else if (newTouchPos < windowData.touchPos.y) {
			// eslint-disable-next-line no-console
			console.log('finger moving up');
		}
	}
}

/**
 * It's adding a class to the body element when the user scrolls to the top of the page.
 */
export const screenBodyClass = () => {
	scrollDirection(true);
	if (windowProps.lastScrollPosition < 5) {
		document.body.classList.add('top');
	} else {
		document.body.classList.remove('top');
	}
};

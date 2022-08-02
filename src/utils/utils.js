/**
 * This function returns a promise that resolves after the given number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay.
 */
export const delay = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );

/**
 * It prevents That the mouse wheel can change the position on the page
 *
 * @param {Event} e - The event object.
 */
export const disableWheel = ( e ) => {
	e.preventDefault();
};

/**
 * Checks when the element is inside the viewport
 *
 * If the top of the element is above the bottom of the viewport or the bottom of the element is below the top of the viewport, then the element is partially visible.
 *
 * @param {HTMLElement} el - The element you want to check.
 * @return {boolean} true when the element is shown inside the viewport
 */
export const isPartiallyVisible = ( el ) => {
	const rect = el.getBoundingClientRect();
	return rect.top < window.innerHeight && rect.bottom > 0;
};

/**
 * Checks when the element is completely inside in the viewport edges
 *
 * "If the top of the element is greater than or equal to 0 and the bottom of the element is less than or equal to the height of the window, then the element is fully visible."
 *
 * @param {HTMLElement} el - The element you want to check if it's fully visible.
 * @return {boolean} if the item edges are completely inside the viewport
 */
export const isFullyVisible = ( el ) => {
	const rect = el.getBoundingClientRect();
	return rect.top >= 0 && rect.bottom <= window.innerHeight;
};

/**
 * Check when the element is inside the active area
 *
 * "Is the element's center within 20% of the viewport's height from the top and bottom?"
 * The function returns true if the element's center is within the range, and false if it's not
 *
 * @param {HTMLElement} el            - The element you want to check if it's in the active area.
 * @param {number}      rangePosition - The percentage of the viewport's height to use as active area
 * @return {boolean}                  - true if the element is inside the active area
 */
export const isActiveArea = ( el, rangePosition ) => {
	const rect = el.getBoundingClientRect();
	const limit = window.innerHeight * ( rangePosition * 0.005 ); // 20% of 1000px is 100px from top and 100px from bottom
	const elementCenter = rect.top + rect.height * 0.5;
	return elementCenter > limit && elementCenter < window.innerHeight - limit;
};

/**
 * Check if the element is above or below a certain percentage of the screen
 *
 * @param {HTMLElement} el            - The element you want to check if it's crossing the center of the screen.
 * @param {number}      rangePosition - The percentage of the viewport height that the element should be at.
 * @return {boolean}                     - return true if above, false if below
 */
export const isCrossing = ( el, rangePosition ) => {
	const rect = el.getBoundingClientRect();
	const center = parseInt(
		window.innerHeight * ( rangePosition * 0.01 ),
		10
	);
	return rect.top > center && rect.bottom < center;
};

/**
 * If the center of the element is between the top and bottom margins of the active area, then the element is in view
 *
 * @param {Object} position         - The stored original position of the element in the viewport.
 * @param {number} intersectionArea - The percentage of the element that needs to be visible in order to trigger the animation.
 * @return {boolean}                - the element is in view true / false
 */
export const isInView = ( position, intersectionArea ) => {
	position.ycenter = ( position.yTop + position.yBottom ) * 0.5;
	const activeArea = intersectionArea * ( window.innerHeight * 0.01 );
	const inactiveArea = ( window.innerHeight - activeArea ) * 0.5;
	const margins = {
		top: window.scrollY + inactiveArea,
		bottom: window.scrollY + ( window.innerHeight - inactiveArea ),
	};
	return margins.top < position.ycenter && margins.bottom > position.ycenter;
};

/**
 * It returns true if the element is between the top and bottom margins of the active area
 *
 * @param {HTMLElement} el               - the element we're checking
 * @param {number}      intersectionArea - The percentage of the viewport that the element should be in.
 *
 * @return {boolean} Return true if the element is inside the active area
 */
export function isBetween( el, intersectionArea ) {
	const elCenter = ( el.position.yTop + el.position.yBottom ) * 0.5;
	const activeArea = intersectionArea * ( window.innerHeight * 0.01 );
	const inactiveArea = ( window.innerHeight - activeArea ) * 0.5;
	const margins = {
		top: window.scrollY + inactiveArea,
		bottom: window.scrollY + ( window.innerHeight - inactiveArea ),
	};
	return margins.top > elCenter && elCenter < margins.bottom;
}

/**
 * If the last scroll position is less than the current scroll position, the user is scrolling down.
 * If the last scroll position is greater than the current scroll position, the user is scrolling up
 */
export function scrollDirection() {
	if ( this.windowData.lastScrollPosition < window.scrollY ) {
		document.body.dataset.direction = 'down';
	} else if ( this.windowData.lastScrollPosition > window.scrollY ) {
		document.body.dataset.direction = 'up';
	}
}

/**
 * If the mouse is over the element, return true.
 *
 * @param {Event} e - The event object
 * @return {boolean} - Return true when the given element has the mouse over
 */
export const hasMouseOver = ( e ) => {
	const mouseX = e;
	const mouseY = e;
	const rect = e.target.getBoundingClientRect();

	return rect.left < mouseX < rect.right && rect.top < mouseY < rect.bottom;
};

/**
 * It sets the touchPos property of the current object to the y-coordinate of the first touch point in the event's changedTouches list
 *
 * @param {TouchEvent} e - The event object.
 */
export function touchstartEvent( e ) {
	this.touchPos.Y = e.changedTouches[ 0 ].clientY;
}

/**
 * detect weather the "old" touchPos is greater or smaller than the newTouchPos
 *
 * If the new touch position is greater than the old touch position, the finger is moving down.
 * If the new touch position is less than the old touch position, the finger is moving up.
 *
 * @param {TouchEvent} e - the event object
 */
export function ontouchmoveEvent( e ) {
	const newTouchPos = e.changedTouches[ 0 ].clientY;
	if ( newTouchPos > this.touchPos.Y ) {
		console.log( 'finger moving down' );
	} else if ( newTouchPos < this.touchPos.Y ) {
		console.log( 'finger moving up' );
	}
}

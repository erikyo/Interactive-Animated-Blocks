import { mouseWheel } from '../../utils/compat';

/**
 * It takes a mouse wheel event value,
 * and applies a scale transform to the target image
 *
 *
 * @param {Event} event - The event object.
 */
const imageScale = ( event ) => {
	event.preventDefault();
	window.requestAnimationFrame( () => {
		let scale = parseFloat( event.target.dataset.sscZoom ) || 1;
		scale += event.deltaY * -0.001;

		// Restrict scale
		// TODO: options
		scale = Math.min( Math.max( 1, scale ), 4 );

		event.target.dataset.sscZoom = scale;

		// Apply scale transform
		event.target.style.transform = `scale(${ scale })`;
	} );
};

/**
 * This controller launches the imagescale "animation" type and is triggered when the mouse is over the image
 *
 * If the mouse enters the image, add the mouse wheel event listener to the image.
 * If the mouse leaves the image, remove the mouse wheel event listener from the image
 *
 * The function is called by the IntersectionObserver.
 *
 * @module imageScaleController
 *
 * @param {IntersectionObserverEntry} entry - The IntersectionObserverEntry object that is passed to the callback function.
 */
function imageScaleController( entry ) {
	const imageEl = entry.target.querySelector( 'img' );
	if ( entry.target.action === 'enter' ) {
		imageEl.addEventListener( mouseWheel, imageScale );
	} else if ( entry.target.action === 'leave' ) {
		imageEl.removeEventListener( mouseWheel, imageScale );
	}
}

export default imageScaleController;

import { mouseWheel } from '../../utils/compat';
import type { SSCAnimationTypeZoom, SscElement } from '../../types';

/**
 * It takes a mouse wheel event value,
 * and applies a scale transform to the target image
 *
 *
 * @param {Event} event - The event object.
 */
const imageScale = (event: WheelEvent) => {
	event.preventDefault();
	const imageElement = event.target as SscElement;
	const imageElementData = imageElement.sscItemOpts as SSCAnimationTypeZoom;
	window.requestAnimationFrame(() => {
		let scale = imageElementData.zoom || 1;
		scale += event.deltaY * -0.001;

		// Restrict scale
		// TODO: options
		scale = Math.min(Math.max(1, scale), 4);

		imageElementData.zoom = scale;

		// Apply scale transform
		imageElement.style.transform = `scale(${scale})`;
	});
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
 * @param  element The element to be animated
 */
function imageScaleController(element: SscElement) {
	const imageEl: HTMLImageElement | null = element.querySelector('img');
	if (imageEl) {
		if (element.action === 'enter') {
			imageEl.addEventListener(mouseWheel, imageScale);
		} else if (element.action === 'leave') {
			imageEl.removeEventListener(mouseWheel, imageScale);
		}
	}
}

export default imageScaleController;

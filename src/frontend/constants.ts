import { SscOptionsDefault } from '../types';

export const WAITFOR: number = 250;

/**
 * Exports the sscOptions object.
 * It returns an object with the rootMargin, threshold, and container properties
 *
 * @return An object with three properties:
 * rootMargin: A string that defines the margins around the root element.
 * threshold: An array of numbers between 0 and 1 that defines the percentage of the target element that should be visible before it is considered visible.
 * container: The element that is used as the viewport for checking visibility of the target.
 */
export const sscOptionsDefault: SscOptionsDefault = {
	rootMargin: '0px', // the IntersectionObserver root margin
	threshold: [0],
	container: document.body,
};

export const AnimateCssUrl =
	'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

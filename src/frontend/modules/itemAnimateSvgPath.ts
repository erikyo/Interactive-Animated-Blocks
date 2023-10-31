import anime from 'animejs';
import { delay, isActiveArea, isPartiallyVisible } from '../../utils/';
import type { SscElement } from '../../types';

interface SscElementOptions extends SscElement {
	easing: string;
	duration: number;
	delay: number;
	intersection: number;
}

/**
 * If the element is in the viewport, animate the SVG paths
 *
 * @todo - provide an option to "start hidden"
 *
 * @module animationSvgPath
 *
 * @param {SscElement}        element                   - The element to be animated.
 * @param {SVGAnimateElement} [animationInstance=false] - This is the instance of the animation. It's used to reverse the animation.
 */
const animationSvgPath = (
	element: SscElement,
	animationInstance: anime.AnimeInstance | undefined
) => {
	const svgElement = element as SscElement;
	const svgOptions = svgElement.sscItemOpts as SscElementOptions;
	let animation: anime.AnimeInstance | undefined;
	if (animationInstance) {
		animation = animationInstance;
	}

	const path = element.querySelectorAll('path');
	if (
		svgElement.action === 'enter' &&
		isActiveArea(element, svgOptions.intersection)
	) {
		svgElement.action = 'leave';
		if (animation?.began && animation?.currentTime !== 0) {
			animation.reverse();
		} else {
			animation = anime({
				targets: path,
				direction: 'normal',
				strokeDashoffset: [anime.setDashoffset, 0],
				easing: svgOptions.easing || 'linear',
				duration: svgOptions.duration || 5000,
				delay(el, i) {
					return (i * svgOptions.duration) / path.length;
				},
			});
		}
	} else if (
		svgElement.action === 'leave' &&
		!isActiveArea(element, svgOptions.intersection)
	) {
		svgElement.action = 'enter';
		if (!animation?.completed && typeof animation?.reverse === 'function') {
			animation.reverse();
		} else {
			animation = anime({
				targets: path,
				strokeDashoffset: [anime.setDashoffset, 0],
				duration: svgOptions.duration,
				delay(el, i) {
					return (i * svgOptions.duration) / path.length;
				},
				direction: 'reverse',
			});
		}
	}
	if (isPartiallyVisible(element)) {
		delay(100).then(() => {
			animationSvgPath(svgElement, animation);
		});
	}
};

export default animationSvgPath;

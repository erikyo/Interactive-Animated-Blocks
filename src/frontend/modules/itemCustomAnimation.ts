import anime from 'animejs';
import { delay, isActiveArea, isPartiallyVisible } from '../../utils/utils';
import type { SscElement } from '../../types.d.ts';

/**
 * It creates an animation sequence for each element that has a `sscSequence` attribute,
 * and then it plays or pauses the animation based on the element's visibility
 *
 * @module animationSequence
 *
 * @param element - the element to be animated
 */
function animationSequence(element: SscElement) {
	const action = element.action;
	const animation = element.sscSequence || {};

	// build the animation if isn't already stored
	if (!this.sequenceAnimations[element.sscItemData.sscItem]) {
		let i = 0;
		const currentStep = {};

		// loop into animation object in order to create the animation timeline
		Object.entries(animation).forEach((step) => {
			// we use the duration as a "marker" for the next step
			if (step[1].property === 'duration') {
				currentStep[i] = {
					...currentStep[i],
					duration: step[1].value + 'ms',
				};
				i++;
			} else {
				// otherwise store the step and continue the loop
				currentStep[i] = {
					...currentStep[i],
					[step[1].property]: step[1].value,
				};
			}
		});

		if (currentStep[0]) {
			// creates the animation initializer
			const a = anime.timeline({
				targets: element,
				autoplay: false,
				delay: element.sscItemOpts.delay,
				duration: element.sscItemOpts.duration,
				easing: element.sscItemOpts.easing, // Can be inherited
				direction: 'normal', // Is not inherited
				complete() {
					element.removeAttribute('data-ssc-lock');
				},
			});

			// loop into the rest of the actions adding the timelines step to sequence
			Object.entries(currentStep).forEach((step) => {
				a.add(step[1]);
			});
			this.sequenceAnimations[element.sscItemData.sscItem] = a;
		}
	}

	// The Enter animation sequence
	if (this.sequenceAnimations[element.sscItemData.sscItem]) {
		if (
			action === 'enter' &&
			isActiveArea(element, element.sscItemOpts.intersection)
		) {
			element.action = 'leave';
			this.sequenceAnimations[element.sscItemData.sscItem].play();
		} else if (
			action === 'leave' &&
			!isActiveArea(element, element.sscItemOpts.intersection)
		) {
			element.action = 'enter';
			this.sequenceAnimations[element.sscItemData.sscItem].pause();
		}
	}
	if (isPartiallyVisible(element)) {
		delay(100).then(() => {
			this.animationSequence(element);
		});
	}
}

export default animationSequence;

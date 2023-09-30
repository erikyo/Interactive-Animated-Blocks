import anime from 'animejs';
import { delay, isActiveArea, isPartiallyVisible } from '../../utils/utils';
import type { SscElement } from '../../types.d.ts';

interface SequenceEl extends SscElement {
	sscSequence: {};
}

type StepProps = {
	property: string;
	value: string | number;
	duration?: string | number;
	easing?: string;
}

const sequenceAnimations: SequenceEl[] = [];

function buildAnimationSequence(element: SequenceEl) {
	let i = 0;
	const customAnimationEl = element as SequenceEl;
	const animation: StepProps[] = customAnimationEl.sscSequence || {};
	const currentStep: StepProps[] = [];

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
		sequenceAnimations[element.sscItemData.sscItem] = a;
	}
}

/**
 * It creates an animation sequence for each element that has a `sscSequence` attribute,
 * and then it plays or pauses the animation based on the element's visibility
 *
 * @module animationSequence
 *
 * @param  element - the element to be animated
 */
function animationSequence(element: SscElement) {
	const action = element.action;
	buildAnimationSequence(element as SequenceEl);

	// The Enter animation sequence
	if (sequenceAnimations[element.sscItemData.sscItem]) {
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

import anime from 'animejs';
import { delay, isActiveArea, isPartiallyVisible } from '../../utils/utils';

/**
 * It creates an animation sequence for each element that has a `sscSequence` attribute,
 * and then it plays or pauses the animation based on the element's visibility
 *
 * @module animationSequence
 *
 * @param {IntersectionObserverEntry} entry  - The entry object passed by the IntersectionObserver.
 * @param {string}                    action - The action to be performed.
 */
function animationSequence(entry, action) {
	const animation = entry.target.sscSequence || {};

	// build the animation if isn't already stored
	if (!this.sequenceAnimations[entry.target.sscItemData.sscItem]) {
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
				targets: entry.target,
				autoplay: false,
				delay: entry.target.sscItemOpts.delay,
				duration: entry.target.sscItemOpts.duration,
				easing: entry.target.sscItemOpts.easing, // Can be inherited
				direction: 'normal', // Is not inherited
				complete() {
					entry.target.removeAttribute('data-ssc-lock');
				},
			});

			// loop into the rest of the actions adding the timelines step to sequence
			Object.entries(currentStep).forEach((step) => {
				a.add(step[1]);
			});
			this.sequenceAnimations[entry.target.sscItemData.sscItem] = a;
		}
	}

	// The Enter animation sequence
	if (this.sequenceAnimations[entry.target.sscItemData.sscItem]) {
		if (
			action === 'enter' &&
			isActiveArea(entry.target, entry.target.sscItemOpts.intersection)
		) {
			entry.target.action = 'leave';
			this.sequenceAnimations[entry.target.sscItemData.sscItem].play();
		} else if (
			action === 'leave' &&
			!isActiveArea(entry.target, entry.target.sscItemOpts.intersection)
		) {
			entry.target.action = 'enter';
			this.sequenceAnimations[entry.target.sscItemData.sscItem].pause();
		}
	}
	if (isPartiallyVisible(entry.target)) {
		delay(100).then(() => {
			this.animationSequence(entry, action);
		});
	}
}

export default animationSequence;

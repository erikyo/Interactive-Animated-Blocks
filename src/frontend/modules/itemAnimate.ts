import { delay, isInView, isPartiallyVisible } from '../../utils/utils';
import type {
	SSCAnimationTypeAnimation,
	SscElement,
	SscPositionYDef,
} from '../../types.d.ts';

export const animations: AnimationEl[] = [];

export interface AnimationEl {
	element: SscElement;
	animatedElements: SscElement[];
	animationEnter: string | undefined;
	animationLeave: string | undefined;
	stagger: string;
	position: SscPositionYDef;
	delay: number;
	duration: number;
	easing: string;
	lock: boolean;
	intersection: number;
	state: 'enter' | 'leave' | 'init' | '';
	/**
	 * The element methods
	 */
	initElement: () => void;
	updatePosition: () => void;
	animateItem: (action: 'enter' | 'leave') => void;
	applyAnimation: (target: SscElement, action: string) => void;
	addCssClass: (item: SscElement, className: string) => void;
	removeCssClass: (item: SscElement, className: string) => void;
	applyChildAnimation: (item: SscElement, className: string) => void;
}

/**
 * Prepare an animated item.
 *
 * @param {SscElement}                element - The element to be animated.
 * @param {SSCAnimationTypeAnimation} options - The animation options.
 * @return {AnimationEl} - The animation element.
 */
export function prepareAnimatedItem(
	element: SscElement,
	options: SSCAnimationTypeAnimation
): AnimationEl {
	return {
		element,
		animatedElements: [],
		animationEnter: options.animationEnter || undefined,
		animationLeave: options.animationLeave || undefined,
		stagger: options.stagger,
		position: {
			yTop: undefined,
			yBottom: undefined,
		},
		delay: Number(options.delay) || 0,
		duration: Number(options.duration) || 1000,
		easing: options.easing || 'EaseInOut',
		lock: false,
		intersection: Number(element.sscItemData.intersection) || 80,
		state: 'init',
		/**
		 * Update the element position when it enters or leaves the viewport
		 */
		updatePosition() {
			const targetRect = element.getBoundingClientRect();
			this.position = {
				yTop: window.scrollY + targetRect.top,
				yBottom: window.scrollY + targetRect.top + targetRect.height,
			};
		},
		/**
		 * Animate the element
		 *
		 * @param action
		 */
		animateItem(action: 'enter' | 'leave') {
			// the single animation for the element
			if (this.animatedElements && this.animatedElements.length === 1) {
				// check if the action needed is "enter" and if the element is in viewport
				return this.applyAnimation(this.element, action);
			}

			// The element has multiple animated child elements
			Object.values(this.animatedElements).forEach(
				(child, index: number) => {
					const childOptions =
						element.sscItemOpts as SSCAnimationTypeAnimation;
					const animationDelay = element.sscItemOpts
						? Number(options.delay)
						: this.duration * index * 0.1;

					childOptions.delay = String(animationDelay);

					child.lock = true;

					delay(animationDelay).then(() => {
						if (element.sscItemOpts) {
							this.applyChildAnimation(child, action);
						} else {
							this.applyAnimation(child, action);
						}
						// wait the animation has been completed before unlock the element
						new Promise(() => {
							setTimeout(() => {
								child.lock = false;
								this.state =
									this.state === 'enter' ? 'leave' : 'enter';
							}, this.duration);
						});
					});
				}
			);
		},
		/**
		 * Initialize the element properties
		 */
		initElement() {
			// stores the current element position (top Y and bottom Y)
			this.updatePosition();

			// set the custom props used by animate.css
			if (this.duration) {
				element.style.setProperty(
					'--animate-duration',
					this.duration + 'ms'
				);
			}
			if (this.easing) {
				element.style.setProperty(
					'transition-timing-function',
					this.easing
				);
			}

			// check if the item is a single animation
			if (this.stagger) {
				// collect item children
				const childElements = element.querySelectorAll('.ssc-animated');
				this.animatedElements = [...childElements] as SscElement[];
				// if scc animated items aren't found use item children
				if (this.animatedElements.length === 0) {
					this.animatedElements = [
						...element.children,
					] as SscElement[];
				}
				// init each child
				Object.values(this.animatedElements).forEach((child) => {
					child.classList.add('ssc-animation-child');
					child.isChildren = true;
				});
			} else {
				this.animatedElements = [element];
			}
			return this;
		},
		/**
		 * Add a css class to the element
		 *
		 * @param item
		 * @param cssClass
		 */
		addCssClass(item, cssClass: string | undefined = undefined) {
			if (cssClass) {
				const animation = cssClass ?? this.animationEnter;
				if (animation)
					item.classList.add(
						'animate__animated',
						'animate__' + animation
					);
			}
			return this;
		},
		/**
		 * Remove a css class to the element
		 *
		 * @param item
		 * @param cssClass
		 */
		removeCssClass(item, cssClass: string | undefined = undefined) {
			if (cssClass) {
				const animation = cssClass ?? this.animationLeave;
				if (animation)
					item.classList.remove(
						'animate__animated',
						'animate__' + animation
					);
			}
			return this;
		},
		/**
		 * Apply an animation to the element based on the action passed in the param
		 * @param el
		 * @param action
		 */
		applyAnimation(el, action) {
			if (action === 'enter') {
				if (this?.animationLeave)
					this.removeCssClass(el, this.animationLeave);
				if (this?.animationEnter)
					this.addCssClass(el, this.animationEnter);
				return;
			}
			if (this?.animationEnter)
				this.removeCssClass(el, this.animationEnter);
			if (this?.animationLeave) this.addCssClass(el, this.animationLeave);
		},
		/**
		 * Apply a child animation to the element based on the action passed in the param
		 * @param el     The element to apply the animation
		 * @param action The action (enter or leave)
		 */
		applyChildAnimation(el, action: string) {
			if (action === 'enter') {
				if (this?.animationLeave)
					this.removeCssClass(el, this.animationLeave);
				if (this?.animationEnter)
					this.addCssClass(el, this.animationEnter);
				return;
			}
			if (this?.animationEnter)
				this.removeCssClass(el, this.animationEnter);
			if (this?.animationLeave) this.addCssClass(el, this.animationLeave);
		},
	};
}

/**
 * Get the collection of animated items
 */
export const getAnimatedItem = (): AnimationEl[] => {
	return animations;
};

/**
 * Initializes the animation for the given element.
 *
 * @param {SscElement} element - The element to initialize the animation for.
 */
export const initAnimation = (element: SscElement) => {
	// init the animations collection
	const elementOptions = element.sscItemOpts as SSCAnimationTypeAnimation;
	if (!element.isChildren) {
		/**
		 * @property {Object} animations - the animations collection
		 */
		animations[element.sscItemData?.sscItem] = prepareAnimatedItem(
			element,
			elementOptions
		);

		animations[element.sscItemData.sscItem].initElement();
	} else {
		// the animation childrens hold a smaller set of properties
		animations[element.sscItemData.sscItem] = {
			element,
			animatedElements: [element],
			state: 'init',
			animationEnter: elementOptions.animationEnter || undefined,
			animationLeave: elementOptions.animationLeave || undefined,
			delay: Number(elementOptions.delay) || 0,
			duration: Number(elementOptions.duration) || 1000,
		} as AnimationEl;
		if (elementOptions && elementOptions.duration) {
			element.style.setProperty(
				'--animate-duration',
				(Number(elementOptions.duration) || 5000) + 'ms'
			);
		}
	}
};

/**
 * Animate Element using Anime.css when the element is in the viewport
 *
 * @module handleAnimation
 *
 * @param {SscElement} element
 */
export const handleAnimation = (element: SscElement) => {
	// Initialize if isn't yet stored in "animations" object
	if (!animations[element.sscItemData.sscItem]) {
		initAnimation(element);
	}

	// children doesn't need to be animated since the parent container fires the action
	if (element.isChildren) {
		return;
	}

	// Get the animation element instance
	const el = animations[element.sscItemData.sscItem] as AnimationEl;

	// update the element position
	el.updatePosition();

	// Check if the element is the area that trigger the next animation
	let animation: 'enter' | 'leave' | '' = '';

	if (isInView(el.position, el.intersection) && el.state !== 'enter') {
		animation = 'enter';
	} else if (
		!isInView(el.position, el.intersection) &&
		el.state !== 'leave'
	) {
		animation = 'leave';
	} else {
		console.log('No animation', el.state);
	}

	/**
	 * when the element has to be animated
	 */
	if (!el.lock && animation !== '') {
		// lock the item to avoid multiple animations at the same time
		el.lock = true;
		delay(el.delay).then(() => {
			// wait the animation has been completed before unlock the element
			return new Promise((resolve) => {
				// fire the animation
				if (el.state && animation) el.animateItem(animation);
				setTimeout(() => {
					el.lock = false;
					el.state = animation;
					resolve(el);
					handleAnimation(element);
				}, el.duration);
			});
		});
	}

	if (el.state !== 'leave') {
		// will catch any animated item that isn't inside the view or hasn't triggered the previous code
		if (isInView(el.position)) {
			delay(100).then(() => {
				handleAnimation(element);
			});
		} else {
			// el.animateItem('leave');
			el.lock = false;
			el.state = 'leave';
		}
	}
};

export default handleAnimation;

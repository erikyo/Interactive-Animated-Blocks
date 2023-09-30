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
	lastAction?: string;
	/**
	 * The element methods
	 */
	initElement: () => void;
	updatePosition: () => void;
	animateItem: (action: string) => void;
	applyAnimation: (target: SscElement, action: string) => void;
	addCssClass: (item: SscElement, className: string) => void;
	removeCssClass: (item: SscElement, className: string) => void;
	applyChildAnimation: (item: AnimationEl, className: string) => void;
}

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
		lastAction: undefined,
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
		animateItem(action: string) {
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
						if (child.sscItemOpts) {
							this.applyChildAnimation(child, action);
						} else {
							this.applyAnimation(child, action);
						}
						// wait the animation has been completed before unlock the element
						new Promise(() => {
							setTimeout(() => {
								child.lock = false;
								this.lastAction =
									this.lastAction === 'enter'
										? 'leave'
										: 'enter';
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
			// we need to set the opposite of the next action
			// eg. enter to trigger the leave animation
			this.lastAction = isInView(this.position, this.intersection)
				? 'enter'
				: 'leave';

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
				// collect item childs
				const childElements = element.querySelectorAll('.ssc-animated');
				this.animatedElements = [...childElements] as SscElement[];
				// if scc animated items aren't found use item childs
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
					this.removeCssClass(el.element, this.animationLeave);
				if (this?.animationEnter)
					this.addCssClass(el.element, this.animationEnter);
				return;
			}
			if (this?.animationEnter)
				this.removeCssClass(el.element, this.animationEnter);
			if (this?.animationLeave)
				this.addCssClass(el.element, this.animationLeave);
		},
	};
}

/**
 * Get the animations collection
 */
export const getAnimatedItem = (): AnimationEl[] => {
	return animations;
};

/**
 * Animate Element using Anime.css when the element is in the viewport
 *
 * @module handleAnimation
 *
 * @param {SscElement} element
 */
export const handleAnimation = (element: SscElement) => {
	// if the animation isn't yet stored in "animations" object
	if (!animations[element.sscItemData.sscItem]) {
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
			// this.animations[ element.sscItemData.sscItem ].animateItem( this.lastAction );
		} else {
			// the animation childrens hold a smaller set of properties
			animations[element.sscItemData.sscItem] = {
				element,
				animatedElements: [element],
				lastAction: undefined,
				animationEnter: elementOptions.animationEnter || undefined,
				animationLeave: elementOptions.animationLeave || undefined,
				delay: parseInt(elementOptions.delay, 10) || 0,
				duration: parseInt(elementOptions.duration, 10) || 1000,
			} as AnimationEl;
			if (elementOptions && elementOptions.duration) {
				element.style.setProperty(
					'--animate-duration',
					(parseInt(elementOptions.duration, 10) || 5000) + 'ms'
				);
			}
		}
	}

	// childrens aren't animated independently
	// since the parent container fires the action
	if (element.isChildren) {
		return;
	}

	// get all the animation data stored
	const el = animations[element.sscItemData.sscItem] as AnimationEl;

	if (
		!el.lock &&
		el.position &&
		(el.lastAction === 'enter'
			? isInView(el.position, el.intersection)
			: !isInView(el.position, el.intersection))
	) {
		// lock the item to avoid multiple animations at the same time
		el.lock = true;
		delay(el.delay).then(() => {
			if (el.lastAction) el.animateItem(el.lastAction);
			// wait the animation has been completed before unlock the element
			new Promise((resolve) => {
				setTimeout(() => {
					el.lock = false;
					el.lastAction =
						el.lastAction === 'enter' ? 'leave' : 'enter';
					resolve(el);
				}, el.duration);
			}).then(() => {
				if (!isPartiallyVisible(el.element)) {
					el.animateItem('leave');
				}
			});
		});
	}

	// will catch any animated item that isn't inside the view or hasn't triggered the previous code
	if (!isInView(el.position, 0)) {
		delay(100).then(() => {
			handleAnimation(element);
		});
	} else {
		animations[element.sscItemData.sscItem].lock = false;
		animations[element.sscItemData.sscItem].animateItem('leave');
	}
};

export default handleAnimation;

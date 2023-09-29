import { delay, isInView, isPartiallyVisible } from '../../utils/utils';
import type {
	SSCAnimationTypeAnimation,
	SscElement,
	SscPositionYDef,
} from '../../types.d.ts';

export const animations: AnimationEl[] = [];

interface AnimationEl extends SscElement {
	animatedElements: AnimationEl[];
	animationEnter: string | undefined;
	animationLeave: string | undefined;
	stagger: string;
	position: SscPositionYDef;
	delay: number;
	duration: number;
	easing: string;
	locked: boolean;
	intersection: number;
	lastAction?: string;
	/**
	 * The element methods
	 */
	initElement: () => void;
	updatePosition: () => void;
	animateItem: (action: string) => void;
	applyAnimation: (target: AnimationEl, action: string) => void;
	addCssClass: (item: AnimationEl, className: string) => void;
	removeCssClass: (item: AnimationEl, className: string) => void;
	applyChildAnimation: (item: SscElementChild, className: string) => void;
}

export interface SscElementChild extends AnimationEl {
	delay: number;
	lastAction: string;
	duration: number;
}

export function prepareAnimatedItem(
	element: AnimationEl,
	options: SSCAnimationTypeAnimation
): AnimationEl {
	return {
		...element,
		animatedElements: [],
		animationEnter: options.animationEnter || undefined,
		animationLeave: options.animationLeave || undefined,
		stagger: options.stagger,
		position: {
			yTop: undefined,
			yBottom: undefined,
		},
		delay: Number(options.delay) ?? 0,
		duration: Number(options.duration) ?? 1000,
		easing: options.easing || 'EaseInOut',
		locked: false,
		intersection: Number(element.sscItemData.intersection) ?? 80,
		lastAction: undefined,
		/**
		 * The element methods
		 */
		updatePosition() {
			const targetRect = element.getBoundingClientRect();
			this.position = {
				yTop: window.scrollY + targetRect.top,
				yBottom: window.scrollY + targetRect.top + targetRect.height,
			};
		},
		animateItem(action: string) {
			// if the animated element is single
			if (this.animatedElements && this.animatedElements.length === 1) {
				// check if the action needed is "enter" and if the element is in viewport
				return this.applyAnimation(this.animatedElements[0], action);
			}
			// otherwise for each item of the collection fire the animation
			Object.values(this.animatedElements as SscElementChild[]).forEach(
				(child, index: number) => {
					const childOptions =
						child.sscItemOpts as SSCAnimationTypeAnimation;
					const animationDelay = child.sscItemOpts
						? Number(options.delay)
						: this.duration * index * 0.1;

					child.delay = animationDelay;

					child.locked = true;

					delay(animationDelay).then(() => {
						if (child.sscItemOpts) {
							this.applyChildAnimation(child, action);
						} else {
							this.applyAnimation(child, action);
						}
						// wait the animation has been completed before unlock the element
						new Promise(() => {
							setTimeout(() => {
								child.locked = false;
								child.lastAction =
									child.lastAction === 'enter'
										? 'leave'
										: 'enter';
							}, child.duration);
						});
					});
				}
			);
		},
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
				this.animatedElements = [...childElements] as AnimationEl[];
				// if scc animated items aren't found use item childs
				if (this.animatedElements.length === 0) {
					this.animatedElements = [
						...element.children,
					] as AnimationEl[];
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
		addCssClass(item, cssClass = 'false') {
			if (cssClass !== 'false') {
				const animation = item?.animationEnter
					? item.animationEnter
					: cssClass;
				item.classList.add(
					'animate__animated',
					'animate__' + animation
				);
			}
			return this;
		},
		removeCssClass(item, cssClass = 'false') {
			if (cssClass !== 'false') {
				const animation = item.animationLeave
					? item.animationLeave
					: cssClass;
				item.classList.remove(
					'animate__animated',
					'animate__' + animation
				);
			}
			return this;
		},
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

export const getAnimatedItem = () => {
	return animations;
};

/**
 * Animate Element using Anime.css when the element is in the viewport
 *
 * @module handleAnimation
 *
 * @param {SscElement} element
 */
export const handleAnimation = (element: AnimationEl) => {
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
				...element,
				animatedElements: [element],
				lastAction: undefined,
				animationEnter: elementOptions.animationEnter || undefined,
				animationLeave: elementOptions.animationLeave || undefined,
				delay: parseInt(elementOptions.delay, 10) || 0,
				duration: parseInt(elementOptions.duration, 10) || 1000,
			};
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
		!el.locked &&
		el.position &&
		(el.lastAction === 'enter'
			? isInView(el.position, el.intersection)
			: !isInView(el.position, el.intersection))
	) {
		// lock the item to avoid multiple animations at the same time
		el.locked = true;
		delay(el.delay)
			.then(() => {
				if (el.lastAction) el.animateItem(el.lastAction);
				// wait the animation has been completed before unlock the element
				new Promise((resolve) => {
					setTimeout(() => {
						el.locked = false;
						el.lastAction =
							el.lastAction === 'enter' ? 'leave' : 'enter';
						resolve(el);
					}, el.duration);
				});
			})
			.then(() => {
				if (!isPartiallyVisible(element)) {
					el.animateItem('leave');
				}
			});
	}

	// will catch any animated item that isn't inside the view or hasn't triggered the previous code
	if (!isInView(el.position, 0)) {
		delay(100).then(() => {
			handleAnimation(el);
		});
	} else {
		animations[element.sscItemData.sscItem].locked = false;
		animations[element.sscItemData.sscItem].animateItem('leave');
	}
};

export default handleAnimation;

import { delay, isInView, isPartiallyVisible } from '../../utils/utils';

/**
 * Animate Element using Anime.css when the element is in the viewport
 *
 * @module handleAnimation
 *
 * @param {IntersectionObserverEntry} entry
 */
export function handleAnimation( entry ) {
	// if the animation isn't yet stored in "animations" object
	if ( ! this.animations[ entry.target.sscItemData.sscItem ] ) {
		if ( ! entry.target.isChildren ) {
			const elRect = entry.target.getBoundingClientRect();

			/**
			 * @property {Object} animations - the animations collection
			 */
			this.animations[ entry.target.sscItemData.sscItem ] = {
				target: entry.target,
				animatedElements: [],
				animationEnter: entry.target.sscItemOpts.animationEnter,
				animationLeave: entry.target.sscItemOpts.animationLeave,
				stagger: entry.target.sscItemOpts.stagger,
				position: {
					yTop: false,
					yBottom: false,
				},
				delay: parseInt( entry.target.sscItemOpts.delay, 10 ) || 0,
				duration:
					parseInt( entry.target.sscItemOpts.duration, 10 ) || 1000,
				easing: entry.target.sscItemOpts.easing || 'EaseInOut',
				locked: false,
				intersection:
					parseInt( entry.target.sscItemOpts.intersection, 10 ) || 80,
				lastAction: false,
				/**
				 * The element methods
				 */
				updatePosition() {
					return {
						yTop: parseInt( window.scrollY + elRect.top ),
						yBottom: parseInt(
							window.scrollY + elRect.top + elRect.height
						),
					};
				},
				animateItem( action ) {
					// if the animated element is single
					if (
						this.animatedElements &&
            this.animatedElements.nodeType
					) {
						// check if the action needed is "enter" and if the element is in viewport
						return this.applyAnimation(
							this.animatedElements,
							action
						);
					}
					// otherwise for each item of the collection fire the animation
					Object.values( this.animatedElements ).forEach(
						( child, index ) => {
							const animationDelay = child.sscItemOpts
								? parseInt( child.sscItemOpts.delay, 10 )
								: this.duration * index * 0.1;
							setTimeout(
								() =>
									child.sscItemOpts
										? this.applyChildAnimation(
											child,
											action
										)
										: this.applyAnimation( child, action ),
								animationDelay
							);
						}
					);
				},
				initElement() {
					// stores the current element position (top Y and bottom Y)
					this.position = this.updatePosition();
					// we need to set the opposite of the next action
					// eg. enter to trigger the leave animation
					this.lastAction = isInView(
						this.position,
						this.intersection
					)
						? 'enter'
						: 'leave';

					// set the custom props used by animate.css
					if ( this.duration ) {
						entry.target.style.setProperty(
							'--animate-duration',
							this.duration + 'ms'
						);
					}
					if ( this.easing ) {
						entry.target.style.setProperty(
							'transition-timing-function',
							this.easing
						);
					}

					// check if the item is a single animation
					if ( this.stagger !== 'none' ) {
						// collect item childs
						this.animatedElements =
							entry.target.querySelectorAll( '.ssc-animated' );
						// if scc animated items aren't found use item childs
						if ( this.animatedElements.length === 0 ) {
							this.animatedElements = entry.target.children;
						}
						// init each childrens
						Object.values( this.animatedElements ).forEach( ( child ) => {
							child.classList.add( 'ssc-animation-child' );
							child.isChildren = true;
						} );
					} else {
						this.animatedElements = entry.target;
					}
					return this;
				},
				addCssClass( item = this.target, cssClass = 'false' ) {
					if ( cssClass !== 'false' ) {
						const animation = item.animationEnter
							? item.animationEnter
							: cssClass;
						item.classList.add(
							'animate__animated',
							'animate__' + animation
						);
					}
					return this;
				},
				removeCssClass( item = this.target, cssClass = 'false' ) {
					if ( cssClass !== 'false' ) {
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
				applyAnimation( element, action ) {
					return action === 'enter'
						? this.removeCssClass(
							element,
							this.animationLeave
						).addCssClass( element, this.animationEnter )
						: this.removeCssClass(
							element,
							this.animationEnter
						).addCssClass( element, this.animationLeave );
				},
				applyChildAnimation( element, action ) {
					return action === 'enter'
						? this.removeCssClass(
							element,
							element.sscItemOpts.animationLeave
						).addCssClass(
							element,
							element.sscItemOpts.animationEnter
						)
						: this.removeCssClass(
							element,
							element.sscItemOpts.animationEnter
						).addCssClass(
							element,
							element.sscItemOpts.animationLeave
						);
				},
			};

			this.animations[ entry.target.sscItemData.sscItem ].initElement();
			this.animations[ entry.target.sscItemData.sscItem ].animateItem( this.lastAction );
		} else {
			// the animation childrens hold a smaller set of properties
			this.animations[ entry.target.sscItemData.sscItem ] = {
				target: entry.target,
				animatedElements: entry.target,
				lastAction: null,
				animationEnter: entry.target.sscItemOpts.animationEnter || null,
				animationLeave: entry.target.sscItemOpts.animationLeave || null,
				delay: parseInt( entry.target.sscItemOpts.delay, 10 ) || 0,
				duration:
					parseInt( entry.target.sscItemOpts.duration, 10 ) || 1000,
			};
			if ( entry.target.sscItemOpts && entry.target.sscItemOpts.duration ) {
				entry.target.style.setProperty(
					'--animate-duration',
					( parseInt( entry.target.sscItemOpts.duration, 10 ) ||
						5000 ) + 'ms'
				);
			}
		}
	}

	// childrens aren't animated independently
	// since the parent container fires the action
	if ( entry.target.isChildren ) {
		return;
	}

	// get all the animation data stored
	const el = this.animations[ entry.target.sscItemData.sscItem ];

	if (
		! el.locked &&
		( el.lastAction === 'enter'
			? isInView( el.position, el.intersection )
			: ! isInView( el.position, el.intersection ) )
	) {
		// lock the item to avoid multiple animations at the same time
		el.locked = true;
		delay( el.delay )
			.then( () => {
				el.animateItem( el.lastAction );
				// wait the animation has been completed before unlock the element
				new Promise( ( resolve ) => {
					setTimeout( function() {
						el.locked = false;
						el.lastAction =
							el.lastAction === 'enter' ? 'leave' : 'enter';
						resolve();
					}, el.duration );
				} );
			} )
			.then( () => {
				if ( ! isPartiallyVisible( el.target ) ) {
					el.animateItem( 'leave' );
				}
			} );
	}

	// will catch any animated item that isn't inside the view or hasn't triggered the previous code
	if ( ! isInView( el.position, 0 ) ) {
		delay( 100 ).then( () => {
			this.handleAnimation( entry );
		} );
	} else {
		this.animations[ entry.target.sscItemData.sscItem ].locked = false;
		this.animations[ entry.target.sscItemData.sscItem ].animateItem(
			'leave'
		);
	}
}

export default handleAnimation;

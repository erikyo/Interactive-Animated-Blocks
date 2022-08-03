/*!
 * SSC 0.0.1
 * The javascript frontend script of ssc
 * 2022
 * Project Website: http://codekraft.it
 *
 * @version 0.0.1
 * @license GPLv3.
 * @author Erik
 *
 * @file The scc animation frontend scripts.
 */

import anime from 'animejs';
import ScrollMagic from 'scrollmagic';
import { ScrollMagicPluginIndicator } from 'scrollmagic-plugins';

// UTILITY
import { sscOptions } from '../ssc';
import { getElelementData, loDashToCapital } from '../utils/fn';
import {
	delay,
	scrollDirection,
	isPartiallyVisible,
	isFullyVisible,
	isActiveArea,
	hasMouseOver,
	isCrossing,
	isInView,
	isBetween,
	touchstartEvent,
	ontouchmoveEvent,
} from '../utils/utils';

// MODULES
import video360Controller from './modules/image360';
import jumpToScreen from './modules/screenJumper';
import imageScaleController from './modules/imageScale';
import videoWheelController from './modules/videoWheel';
import videoFocusPlay from './modules/videoFocus';
import scrollJacking from './modules/scrollJacking';
import textStagger from './modules/textStagger';
import textAnimated from './modules/textEffects';
import animationSvgPath from './modules/svgPath';
import {
	itemParallaxed,
	parallax,
	parallaxController,
} from './modules/itemParallax';

// TODO: enable only for admins
ScrollMagicPluginIndicator( ScrollMagic );

// on load and on hashchange (usually on history back/forward)
const jumpToHash = () => {
	if ( typeof window.location.hash !== 'undefined' ) {
		//GOTO
		console.log( window.location.hash );
	}
};
window.addEventListener( 'load', jumpToHash );
window.addEventListener( 'hashchange', jumpToHash );

/**
 * @class _ssc
 *
 */
class _ssc {
	/**
	 * @function Object() { [native code] } - screen control
	 * @param {{page: Element}} options
	 */
	constructor( options ) {
		this.page = options.page || document.body;
		this.scrollDirection = scrollDirection.bind( this );
		this.updateScreenSize = this.updateScreenSize.bind( this );

		/**
		 * This object holds the window data to avoid unnecessary calculations
		 * and has 2 properties: viewHeight and lastScrollPosition.
		 *
		 * @typedef {Object} windowData
		 * @property {number} viewHeight         - window.innerHeight alias
		 * @property {number} lastScrollPosition - window.scrollY alias
		 */
		this.windowData = {
			viewHeight: window.innerHeight,
			lastScrollPosition: window.scrollY,
		};

		/**
		 * Store the touch position
		 *
		 * @typedef {Object} touchPos
		 * @property {number} x - the touch start x position
		 * @property {number} y - the touch start y position
		 */
		this.touchPos = {
			x: false,
			y: false,
		};

		this.page.ontouchstart = touchstartEvent.bind( this );
		this.page.ontouchmove = ontouchmoveEvent.bind( this );

		// the ssc enabled elements found in this page it's not an array but a nodelist (anyhow we can iterate with foreach so at the moment is fine)
		this.collected = [];

		// will hold the intersection observer
		this.initMutationObserver = this.initMutationObserver.bind( this );
		this.observer = [];

		this.animations = [];

		this.scrollMagic = new ScrollMagic.Controller();
		this.timelines = [];

		// MODULES
		this.video360Controller = video360Controller;
		this.jumpToScreen = jumpToScreen;
		this.imageScaleController = imageScaleController;
		this.videoWheelController = videoWheelController;
		this.videoFocusPlay = videoFocusPlay;
		this.textStagger = textStagger;
		this.textAnimated = textAnimated;
		this.animationSvgPath = animationSvgPath;

		// The standard animation (animate.css)
		this.handleAnimation = this.handleAnimation.bind( this );

		// scrolljacking - evil as eval :)
		this.scrollJacking = scrollJacking.bind( this );

		this.videoParallaxed = [];
		this.lastVideoScrollPosition = 0;
		this.parallaxVideo = this.parallaxVideo.bind( this );
		this.videoParallaxController =
			this.videoParallaxController.bind( this );

		this.itemParallaxed = itemParallaxed;
		this.parallax = parallax.bind( this );
		this.parallaxController = parallaxController.bind( this );

		this.init();
	}

	/**
	 * It waits 250 milliseconds for resize to be completely done,
	 * then updates the windowData object with the current window height and scroll position
	 */
	updateScreenSize() {
		( async () =>
			await ( () =>
				console.warn( 'Old Screensize', this.windowData ) ) )()
			.then( () => {
				return delay( 250 );
			} )
			.then( () => {
				this.windowData.viewHeight = window.innerHeight;
				this.windowData.lastScrollPosition = window.scrollY;
				console.warn( 'New Screensize', this.windowData );
				return this.windowData;
			} );
	}

	// Detach an element from screen control
	unmount = ( el ) => {
		el.unWatch();
	};

	// this will position with fixed an element for X scrolled pixels
	scrollTimeline = ( el ) => {
		el.classList.add( 'ssc-timeline' );
		el.style.maxWidth = '100%';

		// Add timeline for each element
		const timeline = anime.timeline( { autoplay: false } );

		el.querySelectorAll( '.ssc-timeline-scene' ).forEach( ( scenes ) => {
			const sceneData = JSON.parse( scenes.sscItemData.scene );
			const sceneOpts = scenes.sscItemOpts;
			sceneOpts.duration = parseInt( sceneOpts.duration, 10 );
			sceneOpts.delay = parseInt( sceneOpts.delay, 10 );

			const offset = parseInt( sceneOpts.offset, 10 );
			const sceneOffset =
				// eslint-disable-next-line no-nested-ternary
				offset !== 0
					? offset > 0
						? '+=' + offset
						: '-=' + offset
					: false;

			// loop foreach object of the json (each object is a scene of the element timeline)
			Object.values( sceneData ).forEach( ( scene ) => {
				timeline.add(
					{
						targets: scenes,
						duration: sceneOpts.duration,
						delay: sceneOpts.delay,
						easing: scenes.sscItemOpts.easing,
						...scene,
					},
					sceneOffset
				);
			} );
		} );

		/**
		 * Create a scene
		 *
		 * @module ScrollMagic
		 * @function ScrollMagic.Scene
		 */
		this.timelines[ el.sscItemData.sscItem ] = new ScrollMagic.Scene( {
			triggerElement: el,
			duration: el.sscItemOpts.duration,
			triggerHook: el.sscItemOpts.triggerHook || 0.25,
		} )
			// Add debug indicators
			.addIndicators()
			// Trigger animation timeline
			/*.on("enter", function (event) {
        tl1.play();
      })*/
			.on( 'progress', function ( event ) {
				timeline.seek( timeline.duration * event.progress );
			} )
			.setPin( el )
			.addTo( this.scrollMagic );
	};

	addMetaToCollected = ( el, index ) => {
		// add a class to acknowledge about initialization
		el.dataset.sscItem = index;

		el.unWatch = () => this.observer.unobserve( el );

		el.sscItemData = el.dataset;

		el.sscItemOpts = el.dataset.sscProps
			? getElelementData( el.dataset.sscProps, 'data' )
			: null;

		el.sscSequence =
			el.dataset && el.dataset.sscSequence
				? getElelementData( el.dataset.sscSequence, 'style' )
				: null;

		el.sscScene =
			el.dataset && el.dataset.sscSequence && el.dataset.sscSequence.scene
				? el.dataset.sscSequence.scene
				: null;

		// scroll animated video needs custom settings
		if (
			[ 'sscVideoParallax', 'sscVideoScroll', 'ssc360' ].includes(
				el.sscItemData.sscAnimation
			)
		) {
			const videoEl = el.querySelector( 'video' );
			if ( videoEl ) {
				videoEl.autoplay = false;
				videoEl.controls = false;
				videoEl.loop = false;
				videoEl.muted = true;
				videoEl.playsinline = true;
				videoEl.preload = 'auto';
				videoEl.pause();
			}
			el.classList.add( 'ssc-video' );
		}

		switch ( el.sscItemData.sscAnimation ) {
			case 'sscScrollJacking':
				el.style.minHeight = 'calc(100vh + 30px)';
				el.style.padding = 0;
				el.style.margin = 0;
				break;
			case 'sscParallax':
				this.itemParallaxed[ el.sscItemData.sscItem ] = el;
				break;
			case 'sscScrollTimeline':
				el.querySelectorAll( '.ssc' ).forEach( ( timelineChild ) => {
					timelineChild.classList.add( 'ssc-timeline-child' );
					timelineChild.dataset.timelineDuration =
						el.sscItemOpts.duration;
				} );
				break;
			case 'sscTimelineChild': // init ScrollMagic scene
				el.classList.add( 'ssc-timeline-scene' );
				break;
		}
	};

	// Main.js
	// Screen Control Initialization
	init = () => {
		if ( 'IntersectionObserver' in window ) {
			/** this is mandatory because animation could exit from left or right*/
			document.body.style.overflowX = 'hidden';

			this.collected = this.page.querySelectorAll( '.ssc' );

			this.updateScreenSize();
			console.log( 'SSC ready' );

			this.observer = new window.IntersectionObserver(
				this.screenControl,
				{
					root: null,
					rootMargin: sscOptions.rootMargin,
					threshold: sscOptions.threshold,
				}
			);

			// Let's start the intersection observer
			this.collected.forEach( function ( el, index ) {
				this.addMetaToCollected( el, index );

				if ( el.sscItemData.sscAnimation === 'sscScrollTimeline' ) {
					// init ScrollMagic
					this.timelines[ el.sscItemData.sscItem ] = el;
				} else {
					// watch the elements to detect the screen margins intersection
					this.observer.observe( el );
				}
			}, this );

			// start parallax
			this.parallax();

			// start timelines
			this.timelines.forEach( ( el ) => this.scrollTimeline( el ) );

			this.jumpToScreen(
				document.querySelectorAll( '.ssc-screen-jumper' )
			);

			// watch for new objects added to the DOM
			this.interceptor( this.page );

			/**
			 * inject the animate.css stylesheet if needed
			 * maybe it may seem like an unconventional method but
			 * this way this (quite heavy) file is loaded only there is a need
			 */
			const hasAnimate = Object.values( this.collected ).filter(
				( observed ) =>
					observed.sscItemData.sscAnimation === 'sscAnimation'
			);
			if ( hasAnimate ) {
				const animateCSS = document.createElement( 'link' );
				animateCSS.rel = 'stylesheet';
				animateCSS.id = 'ssc_animate-css';
				animateCSS.href =
					'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
				document.head.appendChild( animateCSS );
			}

			// update the screen size if necessary
			window.addEventListener( 'resize', this.updateScreenSize );
		} else {
			console.warn( 'IntersectionObserver could not enabled' );
		}
	};

	sscAnimation = ( entry ) => {
		// this item is entering the view
		if ( entry.target.action ) {
			switch ( entry.target.sscItemData.sscAnimation ) {
				case 'sscParallax':
					this.parallaxController( entry ); // yup
					break;
				case 'sscAnimation':
					this.handleAnimation( entry );
					break;
				case 'sscSequence':
					this.animationSequence( entry, entry.target.action );
					break;
				case 'sscSvgPath':
					this.animationSvgPath( entry, entry.target.action ); // yup (missing some options)
					break;
				case 'sscScrollJacking':
					this.scrollJacking( entry );
					break;
				case 'sscCounter':
					this.textAnimated( entry );
					break;
				case 'sscVideoFocusPlay':
					this.videoFocusPlay( entry ); // yup, but needs to be inline and muted
					break;
				case 'sscVideoParallax':
					this.videoParallaxController( entry );
					break;
				case 'sscVideoScroll':
					this.videoWheelController( entry );
					break;
				case 'ssc360':
					this.video360Controller( entry );
					break;
				case 'sscImageZoom':
					this.imageScaleController( entry ); // NO
					break;
				case 'sscTextStagger':
					this.textStagger( entry );
					break;
				default:
					// 😓
					break;
			}
		}
	};

	screenControl = ( entries ) => {
		// update the last scroll position
		this.windowData.lastScrollPosition = window.scrollY;

		// store the scroll direction into body
		this.scrollDirection();

		entries.forEach( ( entry ) => {
			if ( entry.target.dataset.lock ) {
				return true;
			}

			// stores the direction from which the element appeared
			entry.target.dataset.intersection =
				this.windowData.viewHeight / 2 > entry.boundingClientRect.top
					? 'up'
					: 'down';

			// check if the current "is Intersecting" has been changed, eg if was visible and now it isn't the element has left the screen
			if ( entry.isIntersecting !== entry.target.dataset.visible ) {
				if ( typeof entry.target.dataset.visible === 'undefined' ) {
					entry.target.action = 'enter';
				} else {
					entry.target.action = entry.isIntersecting
						? 'enter'
						: 'leave';
				}
			} else {
				entry.target.action = '';
			}

			// is colliding with borders // used next loop to detect if the object is inside the screen
			entry.target.dataset.visible = entry.isIntersecting
				? 'true'
				: 'false';

			this.sscAnimation( entry );
		} );
	};

	initMutationObserver( mutationsList, mutationObserver ) {
		//for every mutation
		mutationsList.forEach( function ( mutation ) {
			//for every added element
			mutation.addedNodes.forEach( function ( node ) {
				// Check if we appended a node type that isn't
				// an element that we can search for images inside,
				// like a text node.
				if ( typeof node.getElementsByTagName !== 'function' ) {
					return;
				}

				const objCollection = node.querySelectorAll( '.ssc' );

				if ( objCollection.length ) {
					objCollection.forEach( function ( el ) {
						this.addMetaToCollected( el, this.collected.length );

						// watch the elements to detect the screen margins intersection
						return this.observer.observe( el );
					} );
				}
			} );
		} );
	}

	/**
	 * Create an observer instance linked to the callback function,
	 * then start observing the target node for configured mutations.
	 *
	 * The first line of the function creates an instance of the MutationObserver class, which is a built-in JavaScript class.
	 * The second line of the function starts observing the target node for configured mutations
	 *
	 * @param {HTMLElement} content - The element to watch for changes.
	 */
	interceptor( content ) {
		// Create an observer instance linked to the callback function
		this.mutationObserver = new window.MutationObserver(
			this.initMutationObserver
		);

		// Start observing the target node for configured mutations
		this.mutationObserver.observe( content, {
			attributes: false,
			childList: true,
			subtree: true,
		} );
	}

	// BELOW THIS HAS TO BE REMOVED
	/**
	 * Animate Element using Anime.css when the element is in the viewport
	 *
	 * @param {Object} entry
	 */
	handleAnimation = ( entry ) => {
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
						parseInt( entry.target.sscItemOpts.duration, 10 ) ||
						1000,
					easing: entry.target.sscItemOpts.easing || 'EaseInOut',
					locked: false,
					intersection:
						parseInt( entry.target.sscItemOpts.intersection, 10 ) ||
						25,
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
					initElement() {
						// stores the current element position (top Y and bottom Y)
						this.position = this.updatePosition();
						// we need to set the opposite of the next action
						// eg. enter to trigger the leave animation
						this.lastAction = isInView(
							this.position,
							this.intersection
						)
							? 'leave'
							: 'enter';

						// set the custom props used by animate.css
						if ( this.duration )
							entry.target.style.setProperty(
								'--animate-duration',
								this.duration + 'ms'
							);
						if ( this.easing )
							entry.target.style.setProperty(
								'transition-timing-function',
								this.easing
							);

						// check if the item is a single animation
						if ( this.stagger !== 'none' ) {
							// collect item childs
							this.animatedElements =
								entry.target.querySelectorAll( '.ssc' );
							// if scc animated items aren't found use item childs
							if ( this.animatedElements.length === 0 ) {
								this.animatedElements =
									entry.target.querySelectorAll( '*' );
							}
							// init each childrens
							this.animatedElements.forEach( ( child ) => {
								child.classList.add( 'ssc-animation-child' );
								child.isChildren = true;
							} );
						} else {
							this.animatedElements = entry.target;
						}
						this.animateItem( this.lastAction );
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
											: this.applyAnimation(
													child,
													action
											  ),
									animationDelay
								);
							}
						);
					},
				};

				this.animations[
					entry.target.sscItemData.sscItem
				].initElement();
			} else {
				// the animation childrens hold a smaller set of properties
				this.animations[ entry.target.sscItemData.sscItem ] = {
					target: entry.target,
					animatedElements: entry.target,
					lastAction: null,
					animationEnter:
						entry.target.sscItemOpts.animationEnter || null,
					animationLeave:
						entry.target.sscItemOpts.animationLeave || null,
					delay: parseInt( entry.target.sscItemOpts.delay, 10 ) || 0,
					duration:
						parseInt( entry.target.sscItemOpts.duration, 10 ) ||
						1000,
				};
				if (
					entry.target.sscItemOpts &&
					entry.target.sscItemOpts.duration
				)
					entry.target.style.setProperty(
						'--animate-duration',
						( parseInt( entry.target.sscItemOpts.duration, 10 ) ||
							5000 ) + 'ms'
					);
			}
		}

		// childrens aren't animated independently
		// since the parent container fires the action
		if ( entry.target.isChildren ) return;

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
						setTimeout( function () {
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
	};

	animationSequence = ( entry, action ) => {
		const animation = entry.target.sscSequence || {};

		// build the animation if isn't already stored
		if ( ! this.animations[ entry.target.sscItemData.sscItem ] ) {
			let i = 0;
			const currentStep = {};

			// loop into animation object in order to create the animation timeline
			Object.entries( animation ).forEach( ( step ) => {
				// we use the duration as a "marker" for the next step
				if ( step[ 1 ].property === 'duration' ) {
					currentStep[ i ] = {
						...currentStep[ i ],
						duration: step[ 1 ].value + 'ms',
					};
					i++;
				} else {
					// otherwise store the step and continue the loop
					currentStep[ i ] = {
						...currentStep[ i ],
						[ step[ 1 ].property ]: step[ 1 ].value,
					};
				}
			} );

			if ( currentStep[ 0 ] ) {
				// creates the animation initializer
				const a = anime.timeline( {
					targets: entry.target,
					autoplay: false,
					delay: entry.target.sscItemOpts.delay,
					duration: entry.target.sscItemOpts.duration,
					easing: entry.target.sscItemOpts.easing, // Can be inherited
					direction: 'normal', // Is not inherited
					complete( anim ) {
						console.log( anim );
						entry.target.removeAttribute( 'data-ssc-lock' );
					},
				} );

				// loop into the rest of the actions adding the timelines step to sequence
				Object.entries( currentStep ).forEach( ( step ) => {
					a.add( step[ 1 ] );
				} );
				this.animations[ entry.target.sscItemData.sscItem ] = a;
			}
		}

		// The Enter animation sequence
		if ( this.animations[ entry.target.sscItemData.sscItem ] ) {
			if ( action === 'enter' && isActiveArea( entry.target, 75 ) ) {
				action = 'leave';
				this.animations[ entry.target.sscItemData.sscItem ].play();
			} else if (
				action === 'leave' &&
				! isActiveArea( entry.target, 75 )
			) {
				action = 'enter';
				this.animations[ entry.target.sscItemData.sscItem ].pause();
			}
		}
		if ( isPartiallyVisible( entry.target ) ) {
			delay( 100 ).then( () => {
				this.animationSequence( entry, action );
			} );
		}
	};

	parallaxVideo() {
		if ( window.scrollY === this.windowData.lastVideoScrollPosition ) {
			// callback the animationFrame and exit the current loop
			return window.requestAnimationFrame( this.parallaxVideo );
		}

		// Store the last position
		this.windowData.lastVideoScrollPosition = window.scrollY;

		this.videoParallaxed.forEach( ( video ) => {
			const rect = video.item.getBoundingClientRect();
			if ( video.hasExtraTimeline ) {
				console.log(
					'scrolling timeline',
					( window.scrollY -
						video.distanceTop +
						rect.top +
						rect.height ) /
						video.hasExtraTimeline,
					'regular timeline',
					1 - ( rect.top + rect.height ) / video.hasExtraTimeline
				);
				// the common behaviour
				video.item.currentTime = (
					( ( window.scrollY - video.distanceTop ) /
						video.hasExtraTimeline +
						( 1 -
							( rect.top + rect.height ) /
								video.hasExtraTimeline ) ) *
					video.videoDuration *
					video.playbackRatio
				).toFixed( 5 );
			} else {
				// the common behaviour
				video.item.currentTime = (
					( 1 - ( rect.top + rect.height ) / video.timelineLength ) *
					video.videoDuration *
					video.playbackRatio
				).toFixed( 5 );
			}
		} );

		return window.requestAnimationFrame( this.parallaxVideo );
	}

	videoParallaxController( entry ) {
		const videoEl = entry.target.querySelector( 'video' );
		if (
			videoEl &&
			! this.videoParallaxed[ entry.target.sscItemData.sscItem ]
		) {
			if ( isPartiallyVisible( videoEl ) ) {
				const rect = entry.target.getBoundingClientRect();
				let timelineDuration =
					parseInt( entry.target.sscItemData.timelineDuration, 10 ) ||
					0;
				timelineDuration =
					entry.target.sscItemData.intersection === 'down'
						? timelineDuration
						: timelineDuration * -1;
				const duration =
					rect.height + window.innerHeight + timelineDuration;
				this.videoParallaxed[ entry.target.sscItemData.sscItem ] = {
					item: videoEl,
					videoDuration: videoEl.duration,
					sscItemData: entry.target.sscItemData,
					hasExtraTimeline: timelineDuration,
					timelineLength: duration,
					distanceTop: rect.height + rect.top + window.scrollY,
					playbackRatio: parseFloat(
						entry.target.sscItemOpts.playbackRatio
					).toFixed( 2 ),
				};
			}
			this.parallaxVideo();
		}

		if ( entry.target.action === 'leave' ) {
			return ( this.videoParallaxed = this.videoParallaxed.filter(
				( item ) =>
					item.sscItemData.sscItem !==
					entry.target.sscItemData.sscItem
			) );
		}
	}
}

export default _ssc;

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

// UTILITY
import { sscOptions } from '../ssc';
import { getElelementData } from '../utils/fn';
import {
	delay,
	scrollDirection,
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
import handleAnimation from './modules/itemAnimate';
import {
	itemParallaxed,
	parallax,
	parallaxController,
} from './modules/itemParallax';
import animationSequence from './modules/itemCustomAnimation';
import videoParallaxController from './modules/videoParallax';
import { addToTimeline, initTimeline } from './modules/timeline';

// on load and on hashchange (usually on history back/forward)
const jumpToHash = () => {
	if ( typeof window.location.hash !== 'undefined' ) {
		// GOTO
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
		this.observer = [];
		this.initMutationObserver = this.initMutationObserver.bind( this );

		// MODULES
		this.video360Controller = video360Controller;
		this.jumpToScreen = jumpToScreen;
		this.imageScaleController = imageScaleController;
		this.videoWheelController = videoWheelController;
		this.videoFocusPlay = videoFocusPlay;
		this.textStagger = textStagger;
		this.textAnimated = textAnimated;
		this.animationSvgPath = animationSvgPath;
		this.animationSequence = animationSequence;
		this.initTimeline = initTimeline;

		// The standard animation (animate.css)
		this.animations = [];
		this.handleAnimation = handleAnimation.bind( this );

		// Screen jacking - evil as eval
		this.scrollJacking = scrollJacking.bind( this );

		// Video playback controlled by scroll Y position
		this.videoParallaxController = videoParallaxController.bind( this );

		// Parallax Items
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

	/**
	 * Detach an element from screen control
	 *
	 * @param {IntersectionObserverEntry} el - the element to unmount
	 */
	unmount = ( el ) => {
		el.unWatch();
	};

	/**
	 * Inject the animate.css stylesheet if needed
	 * maybe it may seem like an unconventional method but
	 * this way this (quite heavy) file is loaded only there is a need
	 *
	 * @param {{[p: string]: T}} collected - the object with the collection of animated items
	 */
	applyAnimateCssStylesheet = ( collected ) => {
		const hasAnimate = Object.values( collected ).filter(
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
	};

	/**
	 * After collecting all the animation-enabled elements
	 * this function prepares them by applying css styles and classes
	 *
	 * @param    {HTMLElement} el
	 * @param    {number}      index
	 *
	 * @typedef el - the ssc item
	 * @property {dataset}     dataset                   - The item dataset (used to store animation options)
	 * @property {number}      dataset.sscItem           - add the sscItem property to each item
	 * @property {string}      dataset.sscProps          - the item options
	 * @property {string}      dataset.sscSequence       - the scc animation used for the "itemCustomAnimation"
	 * @property {?string}     dataset.sscSequence.scene - the scene sequence data
	 * @property {?string}     dataset.sscScene          - the scene sequence data
	 * @property {Function}    unWatch                   - remove from observed items
	 * @property {Object}      sscItemData               - a copy of the dataset
	 * @property {Object}      sscItemOpts               - the scc general animation parameters
	 * @property {?Object}     sscScene                  - the scc animation used for the "timeline"
	 */
	addMetaToCollected = ( el, index ) => {
		// add data-ssc-item="n" to each item
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
			/** @property {HTMLVideoElement} videoEL - Video element inside a "video-animated" block */
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
				Object.assign( el.style, {
					minHeight: 'calc(100vh + 30px)',
					width: '100%',
					padding: 0,
					margin: 0,
				} );
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

			/**
			 * Animated items - Let's start the intersection observer
			 *
			 * @typedef {this.collected} - the collection of animated elements
			 */
			this.collected.forEach(
				function( el, index ) {
			 this.addMetaToCollected( el, index );

					if ( el.sscItemData.sscAnimation === 'sscScrollTimeline' ) {
					// init ScrollMagic
						addToTimeline( el );
					} else {
					// watch the elements to detect the screen margins intersection
						this.observer.observe( el );
					}
				}, this );

			this.initTimeline();

			// start parallax
			this.parallax();

			this.jumpToScreen(
				document.querySelectorAll( '.ssc-screen-jumper' )
			);

			// watch for new objects added to the DOM
			this.interceptor( this.page );

			this.applyAnimateCssStylesheet( this.collected );

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
		mutationsList.forEach( function( mutation ) {
			//for every added element
			mutation.addedNodes.forEach( function( node ) {
				// Check if we appended a node type that isn't
				// an element that we can search for images inside,
				// like a text node.
				if ( typeof node.getElementsByTagName !== 'function' ) {
					return;
				}

				const objCollection = node.querySelectorAll( '.ssc' );

				if ( objCollection.length ) {
					objCollection.forEach( function( el ) {
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
}

export default _ssc;

/*!
 * SSC 0.1.0
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
import { getElementData, getElementStyle } from '../utils/fn';
import { delay, scrollDirection, screenBodyClass } from '../utils/utils';
import type {
	SSCAnimationTypeTimelineChild,
	SscElement,
	SscElementData,
	SscOptions,
	WindowProps,
	Coords,
} from '../types.d.ts';

// MODULES
import video360Controller from './modules/image360';
import jumpToScreen from './modules/screenJumper';
import imageScaleController from './modules/imageScale';
import videoWheelController from './modules/videoWheel';
import videoFocusPlay from './modules/videoPlayOnFocus';
import scrollJacking from './modules/scrollJacking';
import textStagger from './modules/textStagger';
import textAnimated from './modules/textEffects';
import animationSvgPath from './modules/itemAnimateSvgPath';
import handleAnimation, { getAnimatedItem } from './modules/itemAnimate';
import animationSequence from './modules/itemAnimationCustom';
import scrollNavigator from './modules/scrollNavigator';
import { addToParallaxed, parallaxController } from './modules/itemParallax';
import videoParallaxController from './modules/videoParallax';
import {
	addToTimeline,
	initTimeline,
	enableScrollMagicIndicators,
} from './modules/timeline';
import { AnimateCssUrl, WAITFOR } from './constants';

/**
 * This object holds the window data to avoid unnecessary calculations
 * and has 2 properties: viewHeight and lastScrollPosition.
 *
 * @typedef {Object} windowProps
 * @property {number} viewHeight         - window.innerHeight alias
 * @property {number} lastScrollPosition - window.scrollY alias
 * @property {string} direction          - the scroll direction (up|down)
 */
export const windowProps: WindowProps = {
	viewHeight: window.innerHeight,
	pageHeight: document.body.scrollHeight,
	lastScrollPosition: window.scrollY,
	direction: undefined,
	touchPos: {
		x: undefined,
		y: undefined,
	},
};

/**
 * on load and on hashchange (usually on history back/forward)
 */
export const jumpToHash = () => {
	if (typeof window.location.hash !== 'undefined') {
		// TODO: GO to the location hash instead
		// eslint-disable-next-line no-console
		console.log(window.location.hash);
	}
};
window.addEventListener('load', jumpToHash);
window.addEventListener('hashchange', jumpToHash);

export const logScreenSize = () => {
	// eslint-disable-next-line no-console
	console.info('New Screen size:', windowProps);
};

/**
 * It waits 250 milliseconds for resize to be completely done,
 * then updates the windowData object with the current window height and scroll position
 *
 * @param {number} waitFor
 */
export const updateScreenSize = (waitFor: number = WAITFOR) => {
	delay(waitFor)
		.then(() => {
			windowProps.viewHeight = window.innerHeight;
			windowProps.lastScrollPosition = window.scrollY;
			updateAnimationPosition();
		})
		.then(() => logScreenSize());
};

/**
 * Updates the position of the animated item.
 * if the item has not the position it's a child, and it doesn't need to be updated
 */
export const updateAnimationPosition = () =>
	getAnimatedItem().forEach((item) =>
		item.position ? item.updatePosition() : null
	);

/**
 * The main frontend plugin script
 * collects all the elements with the class "ssc" and applies the animation to them
 *
 */
export default class _ssc {
	private observer: IntersectionObserver | undefined;
	private mutationObserver!: MutationObserver | undefined;

	// Plugin options and variables
	options: SscOptions;
	collected: NodeListOf<SscElement> | [];
	touchPos: Coords;

	// Modules
	video360Controller: (sscElement: SscElement) => void;
	imageScaleController: (entry: SscElement) => void;
	jumpToScreen: (jumpers: NodeListOf<HTMLElement>) => void;
	videoWheelController: (el: SscElement) => void;
	videoFocusPlay: (entry: SscElement) => void;
	textStagger: (entry: SscElement) => void;
	textAnimated: (element: SscElement) => true | undefined;
	animationSvgPath: (
		element: SscElement,
		animationInstance?: boolean
	) => void;
	initTimeline: () => void;
	navigator: (element: SscElement) => void;
	scrollJacking: (element: SscElement) => any;
	sequenceAnimations: any[];
	animationSequence: (element: SscElement) => void;
	handleAnimation: (element: SscElement) => void;
	videoParallaxController: (element: SscElement) => any[] | undefined;
	parallaxController: (element: SscElement) => void;

	constructor(options: SscOptions) {
		/**
		 * The plugin options
		 */
		this.options = options;

		/**
		 * Store the touch position
		 */
		this.touchPos = {
			x: undefined,
			y: undefined,
		};

		// the ssc enabled elements found in this page it's not an array but a nodelist (anyhow we can iterate with foreach so at the moment is fine)
		this.collected = [];

		// will hold the intersection observer
		this.observer = undefined;
		this.initMutationObserver = this.initMutationObserver.bind(this);

		// MODULES
		this.video360Controller = video360Controller;
		this.jumpToScreen = jumpToScreen;
		this.imageScaleController = imageScaleController;
		this.videoWheelController = videoWheelController;
		this.videoFocusPlay = videoFocusPlay;
		this.textStagger = textStagger;
		this.textAnimated = textAnimated;
		this.animationSvgPath = animationSvgPath;
		this.initTimeline = initTimeline;
		this.navigator = scrollNavigator;

		// Screen jacking - evil as eval
		this.scrollJacking = scrollJacking;

		this.sequenceAnimations = [];
		this.animationSequence = animationSequence;

		// The standard animation (animate.css)
		this.handleAnimation = handleAnimation.bind(this);

		// Video playback controlled by scroll Y position
		this.videoParallaxController = videoParallaxController.bind(this);

		// Parallax Items
		this.parallaxController = parallaxController.bind(this);

		this.init();
	}

	/**
	 * Detach an element from screen control
	 *
	 * @param {IntersectionObserverEntry} el - the element to unmount
	 */
	static unmount = (el: SscElement) => el.unWatch;

	/**
	 * Inject the animate.css stylesheet if needed
	 * maybe it may seem like an unconventional method but
	 * this way this (quite heavy) file is loaded only there is a need
	 *
	 * @param {HTMLCollection} collected - the object with the collection of animated items
	 */
	applyAnimateCssStylesheet = (collected: NodeListOf<SscElement>) => {
		const hasAnimate = Object.values(collected).find(
			(observed) => observed.sscItemData?.sscAnimation === 'sscAnimation'
		);
		if (hasAnimate) {
			const animateCSS = document.createElement('link');
			animateCSS.rel = 'stylesheet';
			animateCSS.id = 'ssc_animate-css';
			animateCSS.href = AnimateCssUrl;
			document.head.appendChild(animateCSS);
		}
	};

	/**
	 * After collecting all the animation-enabled elements
	 * this function prepares them by applying css styles and classes
	 *
	 * @param el                           - the ssc item
	 * @param el.dataset                   - The item dataset (used to store animation options)
	 * @param el.dataset.sscItem           - add the sscItem property to each item
	 * @param el.dataset.sscProps          - the item options
	 * @param el.dataset.sscSequence       - the scc animation used for the "itemCustomAnimation"
	 * @param el.dataset.sscSequence.scene - the scene sequence data
	 * @param el.unWatch                   - remove from observed items
	 * @param el.sscItemData               - a copy of the dataset
	 * @param el.sscItemData.sscAnimation
	 * @param el.sscItemData.sscItem       - the ssc id
	 * @param el.sscItemOpts               - the scc general animation options
	 * @param el.sscSequence               - the scc animation used for the "timeline"
	 * @param index                        - the index
	 */
	initializeItem = (el: SscElement, index: number) => {
		// add data-ssc-item="n" to each item
		el.dataset.sscItem = index.toString();

		el.unWatch = () => this.observer?.unobserve(el);

		el.sscItemData = el.dataset as any as SscElementData;

		el.sscItemOpts = el.dataset.sscProps
			? getElementData(el.dataset.sscProps)
			: undefined;

		el.sscItemData.sscSequence =
			el.dataset && el.dataset.sscSequence
				? getElementStyle(el.dataset.sscSequence)
				: undefined;

		// scroll animated video needs custom settings
		if (
			[
				'sscVideoParallax',
				'sscVideoScroll',
				'sscVideoFocusPlay',
				'ssc360',
			].includes(el.sscItemData.sscAnimation)
		) {
			/** @property {HTMLVideoElement} videoEL - Video element inside a "video-animated" block */
			const videoEl = el.querySelector('video') as HTMLVideoElement;
			if (videoEl) {
				videoEl.autoplay = false;
				videoEl.controls = false;
				videoEl.loop = false;
				videoEl.muted = true;
				videoEl.playsInline = true;
				videoEl.preload = 'auto';
				videoEl.pause();
			}
			el.classList.add('ssc-video');
		}

		switch (el.sscItemData.sscAnimation) {
			case 'sscScrollJacking':
				Object.assign(el.style, {
					minHeight: 'calc(100vh + 2px)',
					width: '100%',
					paddingTop: 0,
					paddingBottom: 0,
					margin: 0,
				});
				break;
			case 'sscParallax':
				addToParallaxed(el);
				break;
			case 'sscScrollTimeline':
				const sscItems: NodeListOf<SscElement> =
					el.querySelectorAll('.ssc');
				sscItems.forEach((timelineChild) => {
					timelineChild.classList.add('ssc-timeline-child');
					timelineChild.dataset.timelineDuration = String(
						(el.sscItemOpts as SSCAnimationTypeTimelineChild)
							?.duration ?? 0
					);
				});
				break;
			case 'sscTimelineChild': // init ScrollMagic scene
				el.classList.add('ssc-timeline-scene');
				break;
			case 'sscAnimation': // init ScrollMagic scene
				el.classList.add('ssc-animated');
				break;
		}
	};

	/**
	 * Screen Control Initialization
	 */
	init = () => {
		if ('IntersectionObserver' in window) {
			/**
			 *  This will avoid problems with the width of the screen, as some animations may come out from the left or right by widening the page
			 */
			document.body.style.overflowX = 'hidden';

			/**
			 * This element is the wrapper of all the ssc elements available
			 *
			 * @param options
			 */
			const page = this.options.container || document.body;

			/**
			 * get all SSC elements
			 */
			this.collected = page.querySelectorAll('.ssc');

			// eslint-disable-next-line no-console
			console.log(
				'SSC ready using ',
				page,
				'as container and ',
				this.collected,
				' as items'
			);

			/**
			 * Init the intersection observer
			 */
			this.observer = new window.IntersectionObserver(
				this.screenControl as IntersectionObserverCallback,
				{
					root: null,
					rootMargin: this.options.rootMargin,
					threshold: this.options.threshold,
				}
			);

			/**
			 * Add the collected items to intersection observer
			 */
			this.collected.forEach((el: SscElement, index: number) => {
				this.initializeItem(el, index);

				if (el.sscItemData?.sscAnimation === 'sscScrollTimeline') {
					// init ScrollMagic
					addToTimeline(el);
				} else {
					// watch the elements to detect the screen margins intersection
					this.observer?.observe(el);
				}
			}, this);

			/**
			 * Watch for new objects added to the DOM with the mutation observer
			 */
			if (this.observer) {
				this.interceptor(this.options.container);
			}

			/**
			 * Animate.css stuff
			 * if at least one element need animate.css stylesheet inject it
			 */
			this.applyAnimateCssStylesheet(
				this.collected as NodeListOf<SscElement>
			);

			/**
			 * ScrollMagic Stuff
			 * whenever is the admin user show the scroll magic indicators
			 */
			const isAdmin = document.body.classList.contains('logged-in');
			if (isAdmin) {
				enableScrollMagicIndicators();
			}
			this.initTimeline();

			/**
			 * Collect items for smooth link scrolling
			 */
			// if the window has in the page url an anchor scroll target, get it then jump to that element
			if (window.location.hash) {
				const destination = window.location.hash.substring(1);
				const destinationEl = document.getElementById(destination);
				// scroll to the element
				window.scrollTo({
					top: destinationEl?.offsetTop || 0,
					behavior: 'smooth',
				});
			}

			this.jumpToScreen(document.querySelectorAll('.ssc-screen-jumper'));

			/**
			 * Update the stored screensize then set a callback to update the stored window stored data
			 */
			updateScreenSize();
			window.addEventListener('resize', () => updateScreenSize());

			// update the screen size if necessary
			window.addEventListener('resize', screenBodyClass);
			window.addEventListener('scroll', screenBodyClass);
		} else {
			throw new Error('IntersectionObserver could not enabled');
		}
	};

	sscAnimation = (entry: IntersectionObserverEntry) => {
		const sscElement = entry.target as SscElement;
		// this item is entering or leaving the view
		if (sscElement.action) {
			switch (sscElement.sscItemData.sscAnimation) {
				case 'sscParallax':
					this.parallaxController(sscElement);
					break;
				case 'sscAnimation':
					this.handleAnimation(sscElement);
					break;
				case 'sscSequence':
					this.animationSequence(sscElement);
					break;
				case 'sscSvgPath':
					this.animationSvgPath(sscElement);
					break;
				case 'sscScrollJacking':
					this.scrollJacking(sscElement);
					break;
				case 'sscNavigator':
					this.navigator(sscElement);
					break;
				case 'sscCounter':
					this.textAnimated(sscElement);
					break;
				case 'sscVideoFocusPlay':
					this.videoFocusPlay(sscElement);
					break;
				case 'sscVideoParallax':
					this.videoParallaxController(sscElement);
					break;
				case 'sscVideoScroll':
					this.videoWheelController(sscElement);
					break;
				case 'ssc360':
					this.video360Controller(sscElement);
					break;
				case 'sscImageZoom':
					this.imageScaleController(sscElement);
					break;
				case 'sscTextStagger':
					this.textStagger(sscElement);
					break;
				default:
					// 🥱 miss
					break;
			}
		}
	};

	updateItemData = (el: IntersectionObserverEntry) => {
		const sscElement = el.target as SscElement;
		const elBBox = sscElement.getBoundingClientRect();
		const elCenter = (elBBox.top + elBBox.bottom) / 2;

		// stores the direction from which the element appeared
		sscElement.dataset.intersection =
			windowProps.viewHeight / 2 > elCenter ? 'up' : 'down';

		if (el.isIntersecting) {
			// we need to check if the element was already visible before entering the viewport
			if (typeof sscElement.dataset.visible === 'undefined') {
				sscElement.dataset.action = 'enter';
			} else {
				sscElement.action =
					sscElement.dataset.visible !== 'true' ? 'enter' : 'leave';
			}
			// then set the visibility
			sscElement.dataset.visible = 'true';
		} else {
			sscElement.dataset.visible = 'false';
			sscElement.action = 'leave';
		}
		sscElement.dataset.action = sscElement.action;

		// If the item contains the class "ssc-focused", add a class to the body element when the element is in view.
		// Will be useful to show and hide the "back to top" button or show/hide the header.
		if (sscElement.classList.contains('ssc-focused')) {
			if (el.isIntersecting) {
				document.body.classList.add('ssc-focus-' + sscElement.id);
			} else {
				document.body.classList.remove('ssc-focus-' + sscElement.id);
			}
		}
	};

	/**
	 * The intersection observer callback function
	 *
	 * @param {IntersectionObserverEntry[]} entries - the Intersection observer item collection
	 */
	screenControl = (entries: IntersectionObserverEntry[]) => {
		// set the scroll direction to body dataset
		scrollDirection(true);

		entries.forEach((entry) => {
			if ((entry.target as SscElement).dataset.lock) {
				return true;
			}

			this.updateItemData(entry);

			this.sscAnimation(entry);
		});

		screenBodyClass();
	};

	initMutationObserver(mutationsList: MutationRecord[]) {
		//for every mutation
		mutationsList.forEach((mutation) => {
			//for every added element
			mutation.addedNodes.forEach((node) => {
				// Check if we appended a node type that isn't
				// an element that we can search for images inside,
				// like a text node.
				if (node.nodeType !== 1) {
					return;
				}

				const objCollection = (node as SscElement).querySelectorAll(
					'.ssc'
				);

				if (objCollection.length) {
					objCollection.forEach((el: Element) => {
						this.initializeItem(
							el as SscElement,
							this.collected.length
						);

						// watch the elements to detect the screen margins intersection
						this.observer?.observe(el);
					});
				}
			});
		});
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
	interceptor(content: HTMLElement) {
		if ('mutationObserver' in window) {
			// Create an observer instance linked to the callback function
			this.mutationObserver = new window.MutationObserver(
				this.initMutationObserver as MutationCallback
			);

			// Start observing the target node for configured mutations
			this.mutationObserver.observe(content, {
				attributes: false,
				childList: true,
				subtree: true,
			});
		}
	}
}

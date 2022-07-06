import { textStaggerPresets } from '../utils/data';
import { getElelementData, mouseWheel } from '../utils/fn';
import anime from 'animejs';

import { sscOptions } from '../ssc';

export default class _ssc {
	constructor( options ) {
		this.page = options.page || document.body;

		// store the touch position
		this.touchPos = false;

		//screen stuff
		this.updateScreenSize = this.updateScreenSize.bind( this );

		// will hold the intersection observer
		this.observer = [];

		// the ssc enabled elements found in this page it's not an array but a nodelist (anyhow we can iterate with foreach so at the moment is fine)
		this.collected = [];

		this.scheduledAnimationFrame = false;

		// parallax handler
		this.parallaxed = [];
		this.parallax = this.parallax.bind( this );

		this.videoParallaxed = [];
		this.parallaxVideo = this.parallaxVideo.bind( this );

		this.animations = [];
		this.staggerPresets = textStaggerPresets;

		// avoid scrolling before the page has been loaded
		this.hasScrolling = false;
		this.isScrolling = Date.now() + 2000;

		this.windowData = {
			viewHeight: window.innerHeight,
			lastScrollPosition: window.pageYOffset,
		};

		this.page.ontouchstart = this.touchstartEvent.bind( this );
		this.page.ontouchmove = this.ontouchmoveEvent.bind( this );

		this.init();
	}

	// store the touching position at the start of each touch
	touchstartEvent( e ) {
		this.touchPos = e.changedTouches[ 0 ].clientY;
	}

	// detect weather the "old" touchPos is
	// greater or smaller than the newTouchPos
	ontouchmoveEvent( e ) {
		const newTouchPos = e.changedTouches[ 0 ].clientY;
		if ( newTouchPos > this.touchPos ) {
			console.log( 'finger moving down' );
		}
		if ( newTouchPos < this.touchPos ) {
			console.log( 'finger moving up' );
		}
	}

	// UTILS.js

	// delay util function
	delay = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );

	// wait for resize to be completely done
	updateScreenSize() {
		( async () =>
			await ( () => console.log( 'Old Screensize', this.windowData ) ) )()
			.then( () => {
				return this.delay( 250 );
			} )
			.then( () => {
				this.windowData = {
					viewHeight: window.innerHeight,
					lastScrollPosition: window.pageYOffset,
				};
				console.warn( 'New Screensize', this.windowData );
			} );
	}

	checkVisibility( el, state = 'crossing', position = 100 ) {
		const rect = el.getBoundingClientRect();
		switch ( state ) {
			case 'partiallyVisible':
				return this.isPartiallyVisible( rect );
			case 'visible':
				return this.isFullyVisible( rect );
			case 'crossing':
				return this.isCrossing( rect, position );
			case 'between':
				return this.isBeetween( rect, position );
		}
	}

	isPartiallyVisible( rect ) {
		return rect.top < this.windowData.viewHeight && rect.bottom > 0;
	}

	isFullyVisible( rect ) {
		return rect.top >= 0 && rect.bottom <= this.windowData.viewHeight;
	}

	isCrossing( rect, rangePosition ) {
		const center = this.windowData.viewHeight * ( rangePosition * 0.01 );
		return rect.top < center && rect.bottom > center;
	}

	isBeetween( rect, rangePosition ) {
		const limit = this.windowData.viewHeight * ( rangePosition * 0.005 ); // 20% of 1000px is 100px from top and 100px from bottom
		const elementCenter = rect.top + rect.height * 0.5;
		return (
			elementCenter > limit &&
			elementCenter < this.windowData.viewHeight - limit
		);
	}

	hasMouseOver( e ) {
		const mouseX = e;
		const mouseY = e;
		const rect = e.target.getBoundingClientRect();

		return (
			rect.left < mouseX < rect.right && rect.top < mouseY < rect.bottom
		);
	}

	// Detach an element from screen control
	unmount = ( el ) => {
		el.unWatch();
	};

	scrollDirection() {
		if ( this.windowData.lastScrollPosition < window.pageYOffset ) {
			document.body.dataset.direction = 'down';
		} else if ( this.windowData.lastScrollPosition > window.pageYOffset ) {
			document.body.dataset.direction = 'up';
		}
	}

	// Parallax.js
	// The parallax function
	parallax() {
		if (
			typeof this.parallaxed !== 'undefined' &&
			this.parallaxed.length
		) {
			// if last position is the same as current
			if ( window.pageYOffset === this.windowData.lastScrollPosition ) {
				// callback the animationFrame and exit the current loop
				window.requestAnimationFrame( this.parallax );
				return;
			}
			this.parallaxed.forEach( ( element ) => {
				// apply the parallax style (use the element get getBoundingClientRect since we need updated data)
				const motion =
					this.windowData.viewHeight -
					element.getBoundingClientRect().top;
				if ( motion > 0 ) {
					const styleValue =
						element.sscItemOpts.speed *
						element.sscItemOpts.level *
						motion *
						-0.2;
					element.style.transform =
						'translate3d(' +
						( element.sscItemOpts.direction === 'Y'
							? '0,' + styleValue + 'px'
							: styleValue + 'px,0' ) +
						',0)';
				}

				// requestAnimationFrame callback
				window.requestAnimationFrame( this.parallax );

				// Store the last position
				this.windowData.lastScrollPosition = window.pageYOffset;
			} );
		}
		return false;
	}

	parallaxController = ( entry ) => {
		// add this object to the watched list
		this.parallaxed[ entry.target.sscItemData.sscItem ] = entry.target;
		// if the parallax function wasn't running before so we need to start it
		if ( this.parallaxed.length ) {
			this.parallax();
		}
		if ( entry.target.action === 'leave' ) {
			// remove the animated item from the watched list
			this.parallaxed = this.parallaxed.filter(
				( item ) =>
					item.sscItemData.sscItem !==
					entry.target.sscItemData.sscItem
			);
			console.log(
				`ssc-${ entry.target.sscItemData.sscItem } will be unwatched. current list`,
				this.parallaxed
			);
		}
	};

	// Main.js
	// Screen Control Initialization
	init = () => {
		//this.page.style.overflow = 'auto';
		this.collected = this.page.querySelectorAll( '.ssc' );

		this.updateScreenSize();

		console.log( 'SSC ready' );

		if ( 'IntersectionObserver' in window ) {
			this.observer = new IntersectionObserver( this.screenControl, {
				root: null,
				rootMargin: sscOptions.rootMargin,
				threshold: sscOptions.threshold,
			} );

			// Let's start the intersection observer
			this.collected.forEach( function ( el, index ) {
				// add a class to acknowledge about initialization
				el.dataset.sscItem = index;

				el.unWatch = this.observer.unobserve( el );

				el.sscItemData = el.dataset;

				el.sscItemOpts = el.dataset.sscProps
					? getElelementData( el.dataset.sscProps, 'data' )
					: null;

				el.sscSequence =
					el.dataset && el.dataset.sscSequence
						? getElelementData( el.dataset.sscSequence, 'style' )
						: null;

				// watch the elements to detect the screen margins intersection
				this.observer.observe( el );
			}, this );

			// maybe it may seem like an unconventional method but this way this (quite heavy) file is loaded only there is a need
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

			this.parallax();

			// watch for new objects added to the DOM
			this.interceptor( this.page );

			// setup the page variables
			window.addEventListener( 'resize', this.updateScreenSize );
		} else {
			console.warn( 'IntersectionObserver could not enabled' );
		}
	};

	screenControl = ( entries, observer ) => {
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
			// eslint-disable-next-line no-nested-ternary
			entry.target.action =
				entry.isIntersecting !== entry.target.dataset.visible
					? entry.isIntersecting
						? 'enter'
						: 'leave'
					: '';

			// is colliding with borders
			entry.target.dataset.visible = entry.isIntersecting
				? 'true'
				: 'false';

			// this item is entering the view
			if ( entry.target.action ) {
				// console.log( `SSC: ${ entry.target.sscItemData.sscItem } is entering with args `, entry.target.sscItemOpts );

				switch ( entry.target.sscItemData.sscAnimation ) {
					case 'sscParallax':
						this.parallaxController( entry ); // yup
						break;
					case 'sscAnimation':
						this.handleAnimation( entry, entry.target.action );
						break;
					case 'sscSequence':
						this.animationSequence( entry, entry.target.action );
						break;
					case 'sscSvgPath':
						entry.target.style.opacity = 0;
						entry.target.style.transition = '350ms';
						this.animationSvgPath( entry, entry.target.action ); // yup (missing some options)
						break;
					case 'sscScrollJacking':
						entry.target.style.minHeight = 'calc(100vh + 2px)';
						entry.target.style.margin = 0;
						this.scrollJacking( entry );
						break;
					case 'sscCounter':
						this.animateCount( entry );
						break;
					case 'sscVideoFocusPlay':
						this.videoFocusPlay( entry ); // yup, but needs to be inline and muted
						break;
					case 'sscVideoControl':
						this.parallaxVideoController( entry );
						break;
					case 'sscVideoScroll':
						this.videoWheelController( entry );
						break;
					case 'ssc360':
						this.video360Controller( entry );
						break;
					case 'sscLevitate':
						this.itemLevition( entry ); // NO
						break;
					case 'sscImageZoom':
						this.imageScaleController( entry ); // NO
						break;
					case 'sscTextStagger':
						this.textStagger( entry );
						break;
					default:
						// err
						console.log(
							`JS action ${ entry.target.sscItemData.sscAnimation } missing for ${ entry.target.sscItemData.sscItem }`
						);
						break;
				}
			}
		} );

		// store the last scroll position
		this.windowData.lastScrollPosition = window.pageYOffset;
	};

	// handleRefreshInterval() {}

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
						this.observer.observe( el );
					} );
				}
			} );
		} );
	}

	// the page mutation observer
	interceptor( content ) {
		// Create an observer instance linked to the callback function
		this.mutationObserver = new MutationObserver(
			this.initMutationObserver
		);

		// Start observing the target node for configured mutations
		this.mutationObserver.observe( content, {
			attributes: false,
			childList: true,
			subtree: true,
		} );
	}

	// ACTIONS.js
	// video playback

	// VIDEO
	videoFocusPlay = ( entry ) => {
		const video = entry.target.querySelector( 'video' );
		if ( entry.target.dataset.visible === 'true' ) {
			return this.playVideo( video );
		}
		if ( ! video.ended ) {
			return video.pause();
		}
		return this.stopVideo( video );
	};

	playVideo = ( el ) => el.play();

	stopVideo = ( el ) => {
		el.pause();
		el.currentTime = 0;
	};

	/**
	 * Animate Element using Anime.css
	 *
	 * @param {Object} el     Element to animate.
	 * @param          entry
	 * @param          action
	 */
	handleAnimation = ( entry, action ) => {
		// applies custom style if needed
		function setMeta() {
			if ( entry.target.sscItemOpts.duration !== '0' )
				entry.target.style.setProperty(
					'--animate-duration',
					entry.target.sscItemOpts.duration + 'ms'
				);
			if ( entry.target.sscItemOpts.delay !== '0' )
				entry.target.style.setProperty(
					'--animate-delay',
					entry.target.sscItemOpts.delay + 'ms'
				);
		}

		if (
			action === 'enter' &&
			! entry.target.dataset.animationLock &&
			this.checkVisibility(
				entry.target,
				'between',
				parseInt( entry.target.sscItemOpts.intersection, 10 )
			)
		) {
			setMeta();
			entry.target.dataset.sscLock = 'true';
			// check if the action needed is enter and if the element is in the range
			// trigger to enter animation
			entry.target.classList.remove(
				'animate__animated',
				'animate__' + entry.target.sscItemOpts.animationExit
			);
			entry.target.classList.add(
				'animate__animated',
				'animate__' + entry.target.sscItemOpts.animationEnter
			);
			this.delay( entry.target.sscItemOpts.duration ).then( () => {
				entry.target.removeAttribute( 'data-ssc-lock' );
			} );
			action = 'leave';
		} else if (
			action === 'leave' &&
			! entry.target.dataset.sscLock &&
			! this.checkVisibility(
				entry.target,
				'between',
				parseInt( entry.target.sscItemOpts.intersection, 10 )
			)
		) {
			setMeta();
			entry.target.dataset.sscLock = 'true';
			// check if the action needed is the leave animation and if the element is outside the range
			// trigger the exit animation
			entry.target.classList.remove(
				'animate__animated',
				'animate__' + entry.target.sscItemOpts.animationEnter
			);
			if ( entry.target.sscItemOpts.animationExit ) {
				entry.target.classList.add(
					'animate__animated',
					'animate__' + entry.target.sscItemOpts.animationExit
				);
				this.delay( entry.target.sscItemOpts.duration ).then( () => {
					entry.target.removeAttribute( 'data-ssc-lock' );
				} );
			}
			action = 'enter';
		}

		// if none of the previous condition is met but the element is still in the viewport delay this function
		if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
			this.delay( 100 ).then( () => {
				this.handleAnimation( entry, action );
			} );
		}
	};

	/**
	 * Animate Numbers
	 *
	 * @param {Object} el Element to animate.
	 */
	animateCount( el ) {
		if ( el.target.dataset.sscCount ) {
			return true;
		}
		el.target.dataset.sscCount = 'true';

		anime( {
			targets: el.target || el.target.lastChild,
			textContent: [ 0, parseInt( el.target.lastChild.textContent, 10 ) ],
			round: 1,
			duration: el.target.sscItemOpts.duration || 5000,
			delay: el.target.sscItemOpts.delay || 500,
			easing: el.target.sscItemOpts.easing,
			complete: () => el.target.removeAttribute( 'data-ssc-count' ),
		} );
	}

	textStagger( entry ) {
		const item = entry.target;

		if (
			item.action === 'enter' &&
			this.checkVisibility( entry.target, 'between', 25 )
		) {
			const preset = item.sscItemOpts.preset;
			const duration = item.sscItemOpts.duration;
			const delay = item.sscItemOpts.delay;
			const easing = item.sscItemOpts.easing;
			const splitBy = item.sscItemOpts.splitBy || 'letter';
			const splitByRegex = splitBy === 'word' ? /\w+ |\S+/g : /\S/g;
			const replaced = item.lastChild.textContent.replace(
				splitByRegex,
				`<span class="${ item.sscItemOpts.splitBy }">$&</span>`
			);

			if ( item.lastChild.innerHTML ) {
				item.lastChild.innerHTML = replaced;
			} else {
				item.innerHTML = replaced;
			}

			item.style.position = 'relative';

			const anim = anime.timeline( {
				loop: false,
				autoplay: false,
				delay,
			} );

			this.staggerPresets[ preset ].forEach( ( data, index ) => {
				switch ( index ) {
					case 0:
						anim.add( {
							...textStaggerPresets[ preset ][ index ],
							targets: item.querySelectorAll( '.' + splitBy ),
							duration: duration * 0.75,
							easing,
							delay: ( el, i ) => duration * i * 0.05,
							...data,
						} );
						break;
					case 1:
						anim.add( {
							...( textStaggerPresets[ preset ][ index ] ||
								null ),
							targets: item,
							easing,
							duration,
							delay: duration,
							...data,
						} );
						break;
					default:
						anim.add( {
							...( textStaggerPresets[ preset ][ index ] ||
								null ),
							targets: item,
							easing,
							...data,
						} );
						break;
				}
			} );

			return anim.play();
		}

		this.delay( 200 ).then( () => this.textStagger( entry ) );
	}

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
					// otherwise store the step and contiue the loop
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
					easing: 'easeOutExpo', // Can be inherited
					direction: 'normal', // Is not inherited
					complete( anim ) {
						console.log( anim );
						entry.target.removeAttribute( 'data-visible' );
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
		if (
			action === 'enter' &&
			this.checkVisibility( entry.target, 'between', 25 )
		) {
			action = 'leave';
			this.animations[ entry.target.sscItemData.sscItem ].play();
		} else if (
			action === 'leave' &&
			! this.checkVisibility( entry.target, 'between', 25 )
		) {
			action = 'enter';
			this.animations[ entry.target.sscItemData.sscItem ].pause();
		}
		if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
			this.delay( 100 ).then( () => {
				this.animationSequence( entry, action );
			} );
		}
	};

	animationSvgPath = ( entry, action, animationInstance = false ) => {
		let animation = animationInstance ? animationInstance : anime;
		const path = entry.target.querySelectorAll( 'path' );
		if (
			action === 'enter' &&
			this.checkVisibility( entry.target, 'between', 25 )
		) {
			entry.target.style.opacity = 1;
			action = 'leave';
			if ( animation.began && animation.currentTime !== 0 ) {
				animation.reverse();
			} else {
				animation = anime( {
					targets: path,
					strokeDashoffset: [ anime.setDashoffset, 0 ],
					easing: 'easeInOutSine',
					duration: entry.target.sscItemOpts.duration || 5000,
					delay( el, i ) {
						return (
							( i * entry.target.sscItemOpts.duration ) /
							path.length
						);
					},
					direction: 'normal',
				} );
			}
		} else if (
			action === 'leave' &&
			! this.checkVisibility( entry.target, 'between', 25 )
		) {
			action = 'enter';
			if (
				! animation.completed &&
				typeof animation.reverse === 'function'
			) {
				animation.reverse();
			} else {
				animation = anime( {
					targets: path,
					strokeDashoffset: [ anime.setDashoffset, 0 ],
					easing: 'easeInOutSine',
					duration: entry.target.sscItemOpts.duration,
					delay( el, i ) {
						return (
							( i * entry.target.sscItemOpts.duration ) /
							path.length
						);
					},
					direction: 'reverse',
					complete: () => {
						if ( action === 'leave' ) {
							return ( entry.target.style.opacity = 0 );
						}
					},
				} );
			}
		}
		if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
			this.delay( 100 ).then( () => {
				this.animationSvgPath( entry, action, animation );
			} );
		}
	};

	// this will position with fixed an element for X scrolled pixels
	itemLevition = ( el ) => ( el.target.style.backgroundColor = 'red' );

	// ScrollTo
	scrollJacking = ( entry ) => {
		// if there aren't any defined target, store this one
		if ( entry.target.action === 'enter' && this.hasScrolling === false ) {
			this.hasScrolling = entry.target.sscItemOpts.sscItem;
		}

		// after leaving remove the flag to re-enable the scrolljack
		if ( entry.target.action === 'leave' ) {
			this.delay( 500 ).then( () => {
				entry.target.classList.remove( 'sscLastScrolled' );
			} );
		}

		const disableWheel = ( e ) => {
			e.preventDefault();
		};

		const screenJackTo = ( el ) => {
			if (
				this.isScrolling > Date.now() ||
				this.checkVisibility(
					el.target,
					'between',
					el.target.sscItemOpts.intersection
				)
			)
				return;

			// disable the mouse wheel during scrolling to avoid flickering
			window.addEventListener( mouseWheel, disableWheel, {
				passive: false,
			} );

			const duration = parseInt( el.target.sscItemOpts.duration, 10 );

			// stores the last scrolling time in order to avoid consequent jumps (that's the reason for the extra 100ms too)
			this.isScrolling = Date.now() + duration + 100;

			// add a flag to avoid a back jump into this element
			el.target.classList.add( 'sscLastScrolled' );

			// remove any previous animation
			anime.remove();
			anime( {
				targets: [
					window.document.scrollingElement ||
						window.document.body ||
						window.document.documentElement,
				],
				scrollTop: el.target.offsetTop + 1,
				easing: el.target.sscItemOpts.easing || 'linear',
				duration: duration || 700,
				delay: parseInt( el.target.sscItemOpts.delay, 10 ) || 0,
				complete: () => {
					window.removeEventListener( mouseWheel, disableWheel, {
						passive: false,
					} );
					window.scroll( 0, el.target.offsetTop );
					// this.windowData.lastScrollPosition = window.pageYOffset;
					// window.pageYOffset = el.target.offsetTop;
					this.hasScrolling = false;
				},
			} );
		};

		if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
			screenJackTo( entry );
		}
	};

	parallaxVideo() {
		if (
			typeof this.videoParallaxed !== 'undefined' ||
			Object.keys( this.videoParallaxed ).length
		) {
			if ( window.pageYOffset === this.windowData.lastScrollPosition ) {
				// callback the animationFrame and exit the current loop
				window.requestAnimationFrame( this.parallaxVideo );
				return;
			}

			// Store the last position
			this.windowData.lastScrollPosition = window.pageYOffset;

			this.videoParallaxed.forEach( ( video ) => {
				// TODO: tween playback with current_frame = (previous value + new_value) in Arduino style
				const rect = video.getBoundingClientRect();
				video.currentTime = (
					( 1 +
						-( rect.top + this.windowData.viewHeight ) /
							( this.windowData.viewHeight * 2 ) ) *
					video.videoLenght
				).toString();

				return window.requestAnimationFrame( this.parallaxVideo );
			} );
		}
		return false;
	}

	parallaxVideoController( entry ) {
		const videoEl = entry.target.querySelector( 'video' );
		if ( entry.target.action === 'enter' ) {
			this.videoParallaxed[ entry.target.sscItemData.sscItem ] = videoEl;
			this.videoParallaxed[
				entry.target.sscItemData.sscItem
			].videoLenght = videoEl.duration;
			this.videoParallaxed[
				entry.target.sscItemData.sscItem
			].sscItemData = entry.target.sscItemData;
			this.parallaxVideo();
		} else if ( entry.target.action === 'leave' ) {
			this.videoParallaxed = this.videoParallaxed.filter(
				( item ) =>
					item.sscItemData.sscItem !==
					entry.target.sscItemData.sscItem
			);
		}
	}

	videoOnWheel = ( event ) => {
		event.preventDefault();

		const videoEl = event.target;

		if (
			( videoEl.currentTime <= 0 && event.deltaY < 0 ) ||
			( videoEl.currentTime === videoEl.duration && event.deltaY > 0 )
		) {
			console.log( 'unlocked' );
			videoEl.removeEventListener( mouseWheel, this.videoOnWheel );
			return true;
		}
		window.requestAnimationFrame( () => {
			// set the current frame
			const Offset = event.deltaY > 0 ? 1 / 29.7 : ( 1 / 29.7 ) * -1; // e.deltaY is the direction
			videoEl.currentTime =
				videoEl.currentTime + Offset * event.target.playbackRatio;
		} );
	};

	// Listens mouse scroll wheel
	videoWheelController( el ) {
		const videoEl = el.target.querySelector( 'video' );
		videoEl.playbackRatio = el.target.sscItemOpts.playbackRatio;
		videoEl.controls = false;
		videoEl.muted = true;
		videoEl.pause();
		videoEl.addEventListener( mouseWheel, this.videoOnWheel );
	}

	imageScale = ( event ) => {
		event.preventDefault();
		window.requestAnimationFrame( () => {
			let scale = parseFloat( event.target.dataset.sscZoom ) || 1;
			scale += event.deltaY * -0.001;

			// Restrict scale
			// TODO: options
			scale = Math.min( Math.max( 1, scale ), 4 );

			event.target.dataset.sscZoom = scale;

			// Apply scale transform
			event.target.style.transform = `scale(${ scale })`;
		} );
	};

	imageScaleController( entry ) {
		const imageEl = entry.target.querySelector( 'img' );
		if ( entry.target.action === 'enter' ) {
			imageEl.addEventListener( mouseWheel, this.imageScale );
		} else if ( entry.target.action === 'leave' ) {
			imageEl.removeEventListener( mouseWheel, this.imageScale );
		}
	}

	handleVideo360( e ) {
		const video = e.target;

		function changeAngle() {
			const rect = video.getBoundingClientRect();
			if ( video.readyState > 2 ) {
				video.currentTime =
					( ( e.clientX - rect.left ) / rect.width ) *
					video.duration *
					video.spinRatio;
			}
		}

		window.requestAnimationFrame( changeAngle );
	}

	video360Controller( entry ) {
		const videoEl = entry.target.querySelector( 'video' );
		videoEl.spinRatio = entry.target.sscItemOpts.spinRatio;
		if ( entry.target.action === 'enter' ) {
			videoEl.onmousemove = this.handleVideo360;
		} else if ( entry.target.action === 'leave' ) {
			videoEl.onmousemove = null;
		}
	}
}

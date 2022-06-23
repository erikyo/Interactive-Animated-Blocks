'use strict';

import anime from 'animejs/lib/anime.es.js';

const intersectionPrecision = 4;
const sscOptions = {
	rootMargin: '0px',
	ContainerMargin: '100px', // the IntersectionObserver root margin
	threshold: [ ...Array( intersectionPrecision + 1 ).keys() ].map( ( x ) => x / intersectionPrecision ), // 1-100 the precision of intersections (higher number increase cpu usage - use with care!)
};

// detect available wheel event
const mouseWheel = 'onwheel' in document.createElement( 'div' ) ? 'wheel' // Modern browsers support "wheel"
	: document.onmousewheel !== undefined ? 'mousewheel' // Webkit and IE support at least "mousewheel"
		: 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

// delay util function
Promise.prototype.delay = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );

// How long you want the animation to take, in ms
const animationDuration = 20000;
// Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second
const frameDuration = 1000 / 60;
// Use that to calculate how many frames we need to complete the animation
const totalFrames = Math.round( animationDuration / frameDuration );
// An ease-out function that slows the count as it progresses
const easeOutQuad = ( t ) => t * ( 2 - t );

class _ssc {
	constructor( options ) {
		this.page = options.page || document.body;
		// will hold the intersection observer
		this.observer = [];
		this.collected = []; // it's not an array but a nodelist (anyhow we can iterate with foreach so at the moment is fine)
		this.parallaxed = [];
		this.parallax = this.parallax.bind( this );

		this.refreshIntervalID = 0;

		this.scheduledAnimationFrame = false;
		this.resizeTimer = false;
		this.frameID;

		this.windowData = {
			viewHeight: 0,
			lastScrollPosition: 0,
		};
		this.init();
	}

	// UTILS.js
	getElelementData = ( opts, type = 'data' ) => {
		if ( opts ) {
			const rawArgs = opts.split( ';' );
			let parsedArgs = [];
			parsedArgs = rawArgs.map( ( arg ) => arg.split( ':' ) );
			const args = {};
			parsedArgs.forEach( ( el, index ) => {
				if ( type === 'style' ) {
					( args[ index ] = { property: el[ 0 ], value: el[ 1 ] } );
				} else {
					( args[ el[ 0 ] ] = el[ 1 ] );
				}
			} );
			return args;
		}
		return false;
	};

	// wait for resize to be completely done
	updateScreenSize() {
		( async () => await ( () => console.log( 'Old Screensize', this.windowData ) ) )()
			// .delay( 250 )
			.then( () => {
				this.windowData = {
					viewHeight: window.innerHeight,
				};
				console.log( 'New Screensize', this.windowData );
			} );
	}

	// MAIN.js
	// The parallax function
	parallax() {
		if ( typeof this.parallaxed !== 'undefined' && this.parallaxed.length ) {
			// if last position if the same than the curent one
			if ( window.pageYOffset === this.windowData.lastScrollPosition ) {
				// callback the animationFrame and exit the current loop
				this.frameID = window.requestAnimationFrame( this.parallax );
				return;
			}
			this.parallaxed.forEach( ( element ) => {
				if ( ! element.dataset.parallaxLock ) {
					// apply the parallax style
					const motion = this.windowData.viewHeight - element.getBoundingClientRect().top;
					if ( motion > 0 ) {
						const styleValue = ( element.itemDataOpts.speed * element.itemDataOpts.level * motion ) * -0.2;
						element.style.transform = 'translate3d(' + ( element.itemDataOpts.direction === 'Y' ? '0,' + styleValue + 'px' : styleValue + 'px,0' ) + ',0)';
					}

					// requestAnimationFrame callback
					this.frameID = window.requestAnimationFrame( this.parallax );

					// Store the last position
					this.windowData.lastScrollPosition = window.pageYOffset;
				}
			} );
		}
		return false;
	}

	// Screen Control Initialization
	init = () => {
		this.page.style.overflow = 'auto';
		this.collected = this.page.querySelectorAll( '.ssc' );

		this.updateScreenSize();

		console.log( 'SSC ready' );

		if ( 'IntersectionObserver' in window ) {
			this.observer = new IntersectionObserver(
				this.screenControl,
				{
					root: null,
					threshold: sscOptions.threshold,
				}
			);

			// Let's start the intersection observer
			this.collected.forEach( function( obj, index ) {
				// add a class to acknowledge about initialization
				obj.dataset.sscItem = index;

				obj.unWatch = this.observer.unobserve( obj );

				// watch the objects to detect the screen margins intersection
				this.observer.observe( obj );
			}, this );

			this.parallax();

			// watch for new objects added to the DOM
			// this.interceptor( this.page );

			// update content
			// this.refreshIntervalID = window.setInterval( this.handleRefreshInterval.bind( this ), 1000 );

			// setup the page variables
			window.addEventListener( 'resize', this.updateScreenSize );
		} else {
			console.warn( 'IntersectionObserver could not enabled' );
		}
	};

	screenControl = ( entries, observer ) => {
		entries.forEach( ( entry ) => {
			const sscElement = entry.target;

			// this item is entering the view
			if ( entry.isIntersecting && ! sscElement.dataset.lock ) {
				sscElement.itemClasses = sscElement.classList;
				sscElement.itemData = sscElement.dataset;
				sscElement.itemDataOpts = this.getElelementData( sscElement.dataset.sscProps, sscElement.itemData.sscAnimation === 'sscSequence' ? 'style' : 'data' );
				// sscElement.dataset.intersection = entry.intersectionRatio;

				console.log( `SSC: ${ sscElement.itemData.sscItem } is entering with args `, sscElement.itemDataOpts );

				// Add a flag to indicate which way this element appeared
				if ( ( this.windowData.innerHeight / 2 ) < entry.boundingClientRect.top ) {
					entry.target.dataset.enter = 'bottom';
				} else {
					entry.target.dataset.enter = 'top';
				}

				switch ( sscElement.itemData.sscAnimation ) {
					case 'sscScreenJacker':
						this.screenJacker( entry );
						break;
					case 'sscSequence':
						this.animationSequence( entry );
						break;
					case 'sscVideoControl':
						this.videoWheelControlled( entry );
						break;
					case 'sscVideoFocusPlay':
						this.videoFocusPlay( entry );
						break;
					case 'sscParallax':
						this.imageParallax( entry );
						break;
					case 'sscCounter':
						this.animateCountUp( entry );
						break;
					case 'sscLevitate':
						this.itemLevition( entry );
						break;
					case 'sscAnimation':
						this.animation( entry );
						break;
					case 'ssc360':
						this.image360( entry );
						break;
					default:
						console.log( `JS action ${ sscElement.itemData.sscAnimation } missing for ${ sscElement.itemData.sscItem }` );
						break;
				}
			}

			if ( entry.intersectionRatio < 0.05 ) {
				console.log( 'is exiting', sscElement );
				sscElement.removeAttribute( 'data-lock' );
			}
		} );
	};

	handleRefreshInterval() {}

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
						this.observer.observe( el );
					} );
				}
			} );
		} );
	}

	// the page mutation observer
	interceptor( content ) {
		// Create an observer instance linked to the callback function
		this.mutationObserver = new MutationObserver( this.initMutationObserver );

		// Start observing the target node for configured mutations
		this.mutationObserver.observe( content, {
			attributes: false,
			childList: true,
			subtree: true,
		} );
	}

	unmount = ( el ) => {
		el.unWatch();
	};

	// ACTIONS.js
	// video playback
	videoFocusPlay = ( entry ) => {
		const video = entry.target.querySelector( 'video' );
		if ( entry.intersectionRatio > .8 ) {
			entry.target.dataset.lock = 'active';
			return this.playVideo( video );
		}
		return ( video.paused || video.ended ) ? false : this.stopVideo( video );
	};

	playVideo = ( el ) => el.play();

	stopVideo = ( el ) => {
		el.pause();
		el.currentTime = 0;
	};

	animationDelay = ( ms ) => {
		new Promise( ( resolve ) => setTimeout( resolve(), ms ) );
	};

	applyStyle = ( el, action ) => {
		new Promise( ( resolve ) => {
			// otherwise it's a common css style
			// convert all transform properties into the css transform props
			action[ 1 ].property = action[ 1 ].property.startsWith( 'transform' ) ? 'transform' : action[ 1 ].property;

			// then if is there is a transformation add the prop the current style
			if ( action[ 0 ] === 'transform' ) {
				el.style.transform = ( el.style.transform ) ? el.style.transform + ' ' + action[ 1 ].value : action[ 1 ].value;
			} else {
				el.style[ action[ 1 ].property ] = action[ 1 ].value;
			}

			resolve( el.dataset.sscAnimationStep + ' ' + action[ 1 ].property );
		} );
	};

	animationSequence = async ( entry ) => {
		if ( entry.intersectionRatio > .8 ) {
			const animation = entry.target.itemDataOpts;
			const el = entry.target;

			if ( animation !== null && ! el.dataset.sscAnimationStep ) {
				entry.target.itemData.originalCss = el.style.cssText;
				el.dataset.sscAnimationStep = 'init';
				// const promise = Promise.resolve( el.dataset.sscAnimationStep );

				const anim = anime.timeline( {
					targets: el,
					autoplay: true,
					direction: 'alternate',
					loop: true,
					easing: 'easeInOutSine',
					easing: 'linear',
				} );

				let currentAction = {};
				const currentindex = 0;

				Object.entries( el.itemDataOpts ).map( ( action, index ) => {
					// update the animation step value
					el.dataset.sscAnimationStep = index + '';

					// if it's a function
					if ( action[ 1 ].property === 'duration' ) {
						currentAction = { ...currentAction, duration: action[ 1 ].value + 'ms' };
						anim.add( currentAction );
						currentAction = {};
					}

					currentAction = { ...currentAction, [ action[ 1 ].property ]: action[ 1 ].value };
				} );

				anim.play();
			}
		} else {
			entry.target.removeAttribute( 'data-ssc-animation-step' );
			entry.style = entry.target.itemData.originalCss;
		}
	};

	// this will position with fixed an element for X scrolled pixels
	itemLevition = ( el ) => el.style.backgroundColor = 'red';

	// this will convert a gallery into a 360° viewer (fake spin around a product)
	image360 = ( el ) => el.style.backgroundColor = 'red';

	// ScrollTo
	screenJacker = ( el ) => {
		if ( typeof el.target.dataset.lock !== 'string' && el.intersectionRatio >= el.target.dataset.intersection / 100 ) {
			this.smoothScroll( el.target, {
				behavior: el.target.itemDataOpts.behavior || 'smooth',
			} );
		}
	};

	/**
	 * @param { Element }          elem    - An Element on which we'll call scrollIntoView
	 * @param {{behavior: string}} options - An optional scrollIntoViewOptions dictionary
	 * @return { Promise } (void) - Resolves when the scrolling ends
	 */
	smoothScroll( elem, options ) {
		elem.dataset.lock = 'active';
		this.screenLock( false, { disableWheel: true } );
		return new Promise( ( resolve ) => {
			if ( ! ( elem instanceof Element ) ) {
				throw new TypeError( 'Argument 1 must be an Element' );
			}
			let same = 0; // a counter
			let lastPos = null; // last known Y position

			const scrollOptions = ( { behavior: 'smooth' }, { ...options } );

			// this function will be called every painting frame
			// for the duration of the smooth scroll operation
			const check = () => {
				const newPos = elem.getBoundingClientRect().top;

				if ( newPos === lastPos ) { // same as previous
					if ( same++ > 2 ) {
						return resolve(); // we've come to a halt
					}
				} else {
					same = 0; // reset our counter
					lastPos = newPos; // remember our current position
				}
				// check again next painting frame
				window.requestAnimationFrame( check );
			};

			elem.scrollIntoView( scrollOptions );
			window.requestAnimationFrame( check );
		} ).then( () =>
			this.screenUnlock()
		);
	}

	/**
	 * Disable Page Scroll
	 *
	 * @param  element
	 * @param  options
	 */
	screenLock( element, options ) {
		this.options = {
			...this.options,
			...options,
		};

		const { disableKeys, disableScroll, disableWheel } = this.options;

		/* istanbul ignore else */
		if ( disableWheel ) {
			document.addEventListener( 'wheel', this.handleWheel, { passive: false } );
			document.addEventListener( 'touchmove', this.handleWheel, { passive: false } );
		}

		/* istanbul ignore else */
		if ( disableScroll ) {
			this.lockToScrollPos = [ element.scrollLeft ?? 0, element.scrollTop ?? 0 ];
			document.addEventListener( 'scroll', this.handleScroll, { passive: false } );
		}

		/* istanbul ignore else */
		if ( disableKeys ) {
			document.addEventListener( 'keydown', this.handleKeydown, { passive: false } );
		}
	}

	/**
	 * Re-enable page scrolls
	 */
	screenUnlock() {
		document.removeEventListener( 'wheel', this.handleWheel );
		document.removeEventListener( 'touchmove', this.handleWheel );
		document.removeEventListener( 'scroll', this.handleScroll );
		document.removeEventListener( 'keydown', this.handleKeydown );
	}

	handleWheel = ( e ) => {
		e.preventDefault();
	};

	handleScroll = () => {
		window.scrollTo( ...this.lockToScrollPos );
	};

	handleKeydown = ( e ) => {
		let keys = this.options.keyboardKeys;

		/* istanbul ignore else */
		if (
			[ 'INPUT', 'TEXTAREA' ].includes( ( e.target ).tagName )
		) {
			keys = keys.filter( ( key ) => ! this.options.authorizedInInputs.includes( key ) );
		}

		/* istanbul ignore else */
		if ( keys.includes( e.keyCode ) ) {
			e.preventDefault();
		}
	};

	imageParallax = ( event ) => {
		// if the object with the parallax prop enter in the screen
		if ( event.intersectionRatio > .25 ) {
			// remove the lock
			event.target.removeAttribute( 'data-parallax-lock' );
			// add this object to the watched list
			this.parallaxed[ event.target.itemData.sscItem ] = event.target;
			// if the parallax function wasn't running start it
			if ( this.parallaxed.length ) {
				this.parallax();
			}
		} else {
			// remove the animated item from the watched list
			this.parallaxed = this.parallaxed.filter( ( item ) => item.itemData.sscItem !== event.target.itemData.sscItem );
			console.log( `ssc-${ event.target.itemData.sscItem } will be unwatched. current list`, this.parallaxed );
			event.target.dataset.parallaxLock = 'active';
		}
	};

	animation = ( event ) => {
		if ( event.intersectionRatio > .75 ) {
			// trigger the enter animation
			if ( event.target.dataset.sscActive ) {
				return;
			}
			event.target.classList.remove(
				'animate__animated',
				'animate__' + event.target.itemDataOpts.animationExit,
			);
			event.target.classList.add( 'animate__animated', 'animate__' + event.target.itemDataOpts.animationEnter );
			event.target.dataset.sscActive = 'start';
		} else {
			// trigger the exit animation
			if ( event.target.dataset.sscActive ) {
				event.target.classList.remove(
					'animate__animated',
					'animate__' + event.target.itemDataOpts.animationEnter,
				);
				if ( event.target.itemDataOpts.animationExit ) {
					event.target.classList.add( 'animate__animated', 'animate__' + event.target.itemDataOpts.animationExit );
				}
				event.target.dataset.sscActive = 'exit';
			}

			event.target.removeAttribute( 'data-ssc-active' );
		}
	};

	/**
	 * Animate Numbers
	 *
	 * @param {Object} el Element to animate.
	 */
	animateCountUp( el ) {
		let frame = 0;

		const countTo = parseInt( el.target.lastChild.innerHTML, 10 ) || 100;

		if ( el.target.dataset.sscCount ) {
			return true;
		}

		el.target.dataset.sscCount = 'true';

		// Start the animation running 60 times per second.
		const counter = setInterval( () => {
			frame++;
			// Calculate our progress as a value between 0 and 1
			// Pass that value to our easing function to get our
			// progress on a curve
			const progress = easeOutQuad( frame / totalFrames );

			// Use the progress value to calculate the current count
			el.target.innerHTML = Math.round( countTo * progress );

			// If we’ve reached our last frame, stop the animation
			if ( frame === totalFrames ) {
				el.target.removeAttribute( 'data-ssc-count' );
				clearInterval( counter );
			}
		}, frameDuration );
	}

	onWheel = ( event ) => {
		const videoEl = event.target;

		if ( videoEl.dataset.sscLock ) {
			event.preventDefault();
		} else if ( videoEl.paused ) {
			videoEl.controls = false;
		}

		const targetOffset = 0;
		const videoCurrentTime = videoEl.currentTime;

		// Normally scrolling this should be a subtraction
		// not a sum but "I like it like this!"
		const Offset = targetOffset + event.deltaY > 0 ? ( 1 / 29.97 ) : ( 1 / 29.97 ) * -2; // e.deltaY is the direction

		// Prevent multiple rAF callbacks.
		if ( this.scheduledAnimationFrame ) {

		} else if ( videoEl.paused ) {
			this.scheduledAnimationFrame = true;

			if ( videoCurrentTime <= 0 && event.deltaY < 0 ) {
				videoEl.removeAttribute( 'data-ssc-lock' );
				console.log( 'start' );
			} else if ( videoCurrentTime >= videoEl.duration && event.deltaY > 0 ) {
				// ended
				videoEl.removeAttribute( 'data-ssc-lock' );
				console.log( 'end' );
			} else {
				videoEl.dataset.sscLock = 'true';

				console.log( videoEl.currentTime );

				videoEl.currentTime = videoEl.currentTime + Offset;

				requestAnimationFrame( () => {
					this.scheduledAnimationFrame = false;
				}
				);
			}
		}
	};

	// Listens mouse scroll wheel
	videoWheelControlled( el ) {
		const videoEl = el.target.querySelector( 'video' );

		videoEl.addEventListener( 'wheel', this.onWheel );
	}

	scaleImage = ( el ) => new Promise( ( f ) => {
		let scale = 1;

		el.onmousewheel = ( event ) => {
			event.preventDefault();

			scale += event.deltaY * -0.01;

			// Restrict scale
			scale = Math.min( Math.max( .125, scale ), 4 );

			// Apply scale transform
			el.style.transform = `scale(${ scale })`;
		};
		return f;
	} );

	scrollVideo = ( el ) => new Promise( ( f ) => {
		let scale = 1;

		el.onmousewheel = ( event ) => {
			event.preventDefault();

			scale += event.deltaY * -0.01;

			// Restrict scale
			scale = Math.min( Math.max( .125, scale ), 4 );

			// Apply scale transform
			el.style.transform = `scale(${ scale })`;

			if ( scale === el.target.sscAnimationOptions.times ) {
				return f;
			}
		};
	} );

	// move on the X direction the current div until the end
}

// THIS FILE.js
// on script load trigger immediately ssc
window.addEventListener( 'load', () => {
	// const content = document.getElementById( 'page' );
	const content = document.body;

	const options = {
		page: content,
	};

	 ( typeof window.screenControl )
		? window.screenControl = new _ssc( options )
		: console.low( 'unable to load multiple ssc instances' );
} );


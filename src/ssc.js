'use strict';

import anime from 'animejs/lib/anime.es.js';

const intersectionPrecision = 5;
const sscOptions = {
	rootMargin: '0px', // the IntersectionObserver root margin
	// threshold: [ ...Array( intersectionPrecision + 1 ).keys() ].map( ( x ) => x / intersectionPrecision ), // 1-100 the precision of intersections (higher number increase cpu usage - use with care!)
	threshold: [ 0 ],
};

// detect available wheel event
const mouseWheel = 'onwheel' in document.createElement( 'div' ) ? 'wheel' // Modern browsers support "wheel"
	: document.onmousewheel !== undefined ? 'mousewheel' // Webkit and IE support at least "mousewheel"
		: 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

// An ease-out function that slows the count as it progresses
const easeOutQuad = ( t ) => t * ( 2 - t );

class _ssc {
	constructor( options ) {
		this.page = options.page || document.body;

		// store the touch position
		this.touchPos;
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

		this.parallaxFrameID = 0;

		this.videoParallaxed = [];
		this.videoParallaxFrameID = 0;
		this.parallaxVideo = this.parallaxVideo.bind( this );

		this.animations = [];
		this.video360 = [];

		this.refreshIntervalID = 0;
		this.scrollAnim = 0;

		this.windowData = {
			viewHeight: window.screen.height,
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
	// parse data stored with wp editor into element dataset and transform into properties / style to provide a faster access
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

	// delay util function
	delay = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );

	// wait for resize to be completely done
	updateScreenSize() {
		( async () => await ( () => console.log( 'Old Screensize', this.windowData ) ) )()
			.then( () => {
				return this.delay( 250 );
			} )
			.then( () => {
				this.windowData = {
					viewHeight: window.screen.height,
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
		return (
			rect.top < this.windowData.viewHeight &&
      rect.bottom > 0
		);
	}

	isFullyVisible( rect ) {
		return (
			rect.top >= 0 &&
      rect.bottom <= this.windowData.viewHeight
		);
	}

	isCrossing( rect, rangePosition ) {
		const center = this.windowData.viewHeight * ( rangePosition * .01 );
		return (
			rect.top < center &&
      rect.bottom > center
		);
	}

	isBeetween( rect, rangePosition ) {
		const limit = this.windowData.viewHeight * ( rangePosition * .005 ); // 20% of 1000px is 100px from top and 100px from bottom
		const elementCenter = rect.top + ( rect.height * .5 );
		return (
			elementCenter > limit &&
      elementCenter < this.windowData.viewHeight - limit
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
		if ( typeof this.parallaxed !== 'undefined' && this.parallaxed.length ) {
			// if last position is the same as current
			if ( window.pageYOffset === this.windowData.lastScrollPosition ) {
				// callback the animationFrame and exit the current loop
				this.parallaxFrameID = window.requestAnimationFrame( this.parallax );
				return;
			}
			this.parallaxed.forEach( ( element ) => {
				// apply the parallax style (use the element get getBoundingClientRect since we need updated data)
				const motion = this.windowData.viewHeight - element.getBoundingClientRect().top;
				if ( motion > 0 ) {
					const styleValue = ( element.sscItemOpts.speed * element.sscItemOpts.level * motion ) * -0.2;
					element.style.transform = 'translate3d(' + ( element.sscItemOpts.direction === 'Y' ? '0,' + styleValue + 'px' : styleValue + 'px,0' ) + ',0)';
				}

				// requestAnimationFrame callback
				this.parallaxFrameID = window.requestAnimationFrame( this.parallax );

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
			this.parallaxed = this.parallaxed.filter( ( item ) => item.sscItemData.sscItem !== entry.target.sscItemData.sscItem );
			console.log( `ssc-${ entry.target.sscItemData.sscItem } will be unwatched. current list`, this.parallaxed );
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
			this.observer = new IntersectionObserver(
				this.screenControl,
				{
					root: null,
					rootMargin: sscOptions.rootMargin,
					threshold: sscOptions.threshold,
				}
			);

			// Let's start the intersection observer
			this.collected.forEach( function( obj, index ) {
				// add a class to acknowledge about initialization
				obj.dataset.sscItem = index;

				obj.unWatch = this.observer.unobserve( obj );

				obj.sscItemData = obj.dataset;
				obj.sscItemOpts = this.getElelementData( obj.dataset.sscProps, obj.sscItemData.sscAnimation === 'sscSequence' ? 'style' : 'data' );

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
		// store the scroll direction into body
		this.scrollDirection();

		entries.forEach( ( entry ) => {
			if ( entry.target.dataset.lock ) {
				return true;
			}

			// stores the direction from which the element appeared
			entry.target.dataset.intersection = ( ( this.windowData.viewHeight / 2 ) > entry.boundingClientRect.top )
				?	 'up'
				: 'down';

			// check if the current "is Intersecting" has been changed, eg if was visible and now it isn't the element has left the screen
			// eslint-disable-next-line no-nested-ternary
			entry.target.action = ( entry.isIntersecting !== entry.target.dataset.visible )
				? ( entry.isIntersecting ? 'enter' : 'leave' )
				: null;

			// is colliding with borders
			entry.target.dataset.visible = entry.isIntersecting ? 'true' : 'false';

			// this item is entering the view
			if ( entry.target.action ) {
				console.log( `SSC: ${ entry.target.sscItemData.sscItem } is entering with args `, entry.target.sscItemOpts );

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
					case 'sscScreenJacker':
						entry.target.style.minHeight = '100.5vh';
						entry.target.style.margin = 0;
						this.screenJacker( entry ); // yup
						break;
					case 'sscCounter':
						this.animateCountUp( entry ); // yup
						break;
					case 'sscVideoFocusPlay':
						this.videoFocusPlay( entry ); // yup, but needs to be inline and muted
						break;

					case 'sscVideoControl':
						this.parallaxVideoController( entry ); // yup
						break;
					case 'sscVideoScroll':
						this.videoWheelController( entry ); // NO
						break;
					case 'ssc360':
						this.video360Controller( entry ); // NO
						break;
					case 'sscLevitate':
						this.itemLevition( entry ); // NO
						break;
					default:
						// err
						console.log( `JS action ${ entry.target.sscItemData.sscAnimation } missing for ${ entry.target.sscItemData.sscItem }` );
						break;
				}
			}
		} );

		// store the last scroll position
		this.windowData.lastScrollPosition = window.pageYOffset;
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

	handleAnimation = ( entry, action ) => {
		if ( action === 'enter' && this.checkVisibility( entry.target, 'between', 50 ) ) {
			// check if the action needed is enter and if the element is in the range
			// trigger the enter animation
			entry.target.classList.remove(
				'animate__animated',
				'animate__' + entry.target.sscItemOpts.animationExit,
			);
			entry.target.classList.add( 'animate__animated', 'animate__' + entry.target.sscItemOpts.animationEnter );
			action = 'leave';
		} else if ( action === 'leave' && ! this.checkVisibility( entry.target, 'between', 50 ) ) {
			// check if the action needed is the leave animation and if the element is outside the range
			// trigger the exit animation
			entry.target.classList.remove(
				'animate__animated',
				'animate__' + entry.target.sscItemOpts.animationEnter,
			);
			if ( entry.target.sscItemOpts.animationExit ) {
				entry.target.classList.add( 'animate__animated', 'animate__' + entry.target.sscItemOpts.animationExit );
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
	animateCountUp( el ) {
		if ( el.target.dataset.sscCount ) {
			return true;
		}

		let frame = 0;

		// How long you want the animation to take, in ms
		const animationDuration = el.target.sscItemOpts.duration || 5000;
		// Calculate how long each ‘frame’ should last in order to update the animation 60 times per second (1000ms / 60fps)
		const frameDuration = 1000 / 60;

		const item = el.target.lastChild;

		const countTo = parseInt( item.innerHTML, 10 ) || 100;

		const totalFrames = Math.round( animationDuration / frameDuration );

		el.target.dataset.sscCount = 'true';

		// Start the animation running 60 times per second.
		const counter = setInterval( () => {
			frame++;
			// Calculate our progress as a value between 0 and 1
			// Pass that value to our easing function to get our
			// progress on a curve
			const progress = easeOutQuad( frame / totalFrames );

			// Use the progress value to calculate the current count
			item.innerHTML = Math.round( countTo * progress );

			// If we’ve reached our last frame, stop the animation
			if ( frame === totalFrames ) {
				el.target.removeAttribute( 'data-ssc-count' );
				clearInterval( counter );
			}
		}, frameDuration );
	}

	animationSequence = ( entry, action ) => {
		const animation = entry.target.sscItemOpts;

		// build the animation if isn't already stored
		if ( ! this.animations[ entry.target.sscItemData.sscItem ] ) {
			let i = 0;
			const currentStep = {};

			// loop into animation object in order to create the animation timeline
			Object.entries( animation ).forEach( ( step ) => {
				// we use the duration as a "marker" for the next step
				if ( step[ 1 ].property === 'duration' ) {
					currentStep[ i ] = { ...currentStep[ i ], duration: step[ 1 ].value + 'ms' };
					i++;
				} else {
					// otherwise store the step and contiue the loop
					currentStep[ i ] = { ...currentStep[ i ], [ step[ 1 ].property ]: step[ 1 ].value };
				}
			} );

			if ( currentStep[ 0 ] ) {
				// creates the animation initializer
				const a = anime.timeline( {
					targets: entry.target,
					autoplay: false,
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
		if ( action === 'enter' && this.checkVisibility( entry.target, 'between', 25 ) ) {
			action = 'leave';
			this.animations[ entry.target.sscItemData.sscItem ].play();
		} else if ( action === 'leave' && ! this.checkVisibility( entry.target, 'between', 25 ) ) {
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
		let animation = ( animationInstance ) ? animationInstance : anime;
		const path = entry.target.querySelectorAll( 'path' );
		if ( action === 'enter' && this.checkVisibility( entry.target, 'between', 25 ) ) {
			entry.target.style.opacity = 1;
			action = 'leave';
			if ( animation.began && animation.currentTime !== 0 ) {
				animation.reverse();
			} else {
				animation = anime( {
					targets: path,
					strokeDashoffset: [ anime.setDashoffset, 0 ],
					easing: 'easeInOutSine',
					duration: entry.target.sscItemOpts.duration,
					delay( el, i ) {
						return i * entry.target.sscItemOpts.duration / path.length;
					},
					direction: 'normal',
				} );
			}
		} else if ( action === 'leave' && ! this.checkVisibility( entry.target, 'between', 25 ) ) {
			action = 'enter';
			if ( ! animation.completed && typeof animation.reverse === 'function' ) {
				animation.reverse();
			} else {
				animation = anime( {
					targets: path,
					strokeDashoffset: [ anime.setDashoffset, 0 ],
					easing: 'easeInOutSine',
					duration: entry.target.sscItemOpts.duration,
					delay( el, i ) {
						return i * entry.target.sscItemOpts.duration / path.length;
					},
					direction: 'reverse',
					complete: () => {
						if ( action === 'leave' ) {
							return entry.target.style.opacity = 0;
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
	itemLevition = ( el ) => el.target.style.backgroundColor = 'red';

	// this will convert a gallery into a 360° viewer (fake spin around a product)
	image360 = ( el ) => el.target.style.backgroundColor = 'red';

	// ScrollTo
	screenJacker = ( entry ) => {
		if ( entry.target.action === 'enter' ) {
			if ( this.checkVisibility( entry.target, 'between', 10 ) ) {
				return this.scrollToElement( entry.target );
			}
			this.delay( 100 ).then( () => {
				this.screenJacker( entry );
			} );
		}
	};

	onScroll( action ) {
		let isTicking = false;
		let scrollY = 0;
		const body = document.body;
		const html = document.documentElement;
		const scrollHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
		function scroll() {
			scrollY = window.scrollY;
			if ( action ) {
				action( scrollY, scrollHeight );
			}
			getFrame();
		}
		function getFrame() {
			if ( ! isTicking ) {
				window.requestAnimationFrame( updateScroll );
			}
			isTicking = true;
		}
		function updateScroll() {
			isTicking = false;
			this.windowData.scrollOffset = scrollY;
		}
		scroll();
		window.onscroll = scroll;
	}

	// Scroll to element
	scrollToElement( el, offset ) {
		const off = offset || 0;
		const rect = el.getBoundingClientRect();
		const top = rect.top + off;
		if ( ( document.body.dataset.direction === 'down' && rect.top + window.scrollY > this.windowData.lastScrollPosition ) ||
    ( document.body.dataset.direction === 'up' && rect.top + window.scrollY < this.windowData.lastScrollPosition ) ) {
			anime( {
				targets: [ window.document.scrollingElement || window.document.body || window.document.documentElement ],
				scrollTop: '+=' + top,
				easing: 'easeInOutSine',
				duration: 1600,
			} );
		}
	}

	parallaxVideo() {
		if ( typeof this.videoParallaxed !== 'undefined' || Object.keys( this.videoParallaxed ).length ) {
			if ( window.pageYOffset === this.windowData.lastScrollPosition ) {
				// callback the animationFrame and exit the current loop
				this.videoParallaxFrameID = window.requestAnimationFrame( this.parallaxVideo );
				return;
			}

			// Store the last position
			this.windowData.lastScrollPosition = window.pageYOffset;

			this.videoParallaxed.forEach( ( video ) => {
				if ( video.readyState < 3 ) {
					return window.requestAnimationFrame( this.parallaxVideo );
				}
				const rect = video.getBoundingClientRect();
				// TODO: tween playback with current_frame = (previous value + new_value) in Arduino style
				video.currentTime = ( ( 1 + -( rect.top + this.windowData.viewHeight ) / ( this.windowData.viewHeight * 2 ) ) * video.videoLenght ).toFixed( 2 ).toString();
				this.videoParallaxFrameID = window.requestAnimationFrame( this.parallaxVideo );
			} );
		}
		return false;
	}

	parallaxVideoController( entry ) {
		const videoEl = entry.target.querySelector( 'video' );
		if ( entry.target.action === 'enter' ) {
			this.videoParallaxed[ entry.target.sscItemData.sscItem ] = videoEl;
			this.videoParallaxed[ entry.target.sscItemData.sscItem ].videoLenght = videoEl.duration;
			this.videoParallaxed[ entry.target.sscItemData.sscItem ].sscItemData = entry.target.sscItemData;
			this.parallaxVideo();
		} else if ( entry.target.action === 'leave' ) {
			this.videoParallaxed = this.videoParallaxed.filter( ( item ) => item.sscItemData.sscItem !== entry.target.sscItemData.sscItem );
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
		if ( videoEl.readyState >= 1 ) {
			window.requestAnimationFrame( () => {
			// set the current frame
				const Offset = event.deltaY > 0 ? ( 1 / 29.7 ) : ( 1 / 29.7 ) * -1; // e.deltaY is the direction
				videoEl.currentTime = videoEl.currentTime + Offset;
			} );
		}
	};

	hasMouseOver( e ) {
		const mouseX = e;
		const mouseY = e;
		const rect = e.target.getBoundingClientRect();

		return ( rect.left < mouseX < rect.right && rect.top < mouseY < rect.bottom );
	}

	// Listens mouse scroll wheel
	videoWheelController( el ) {
		const videoEl = el.target.querySelector( 'video' );
		videoEl.controls = false;
		videoEl.muted = true;
		videoEl.pause();
		videoEl.addEventListener( mouseWheel, this.videoOnWheel );
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

	handleVideo360( e ) {
		const video = e.target;

		function changeAngle() {
			const rect = video.getBoundingClientRect();
			if ( video.readyState > 1 ) {
				video.currentTime = ( ( e.clientX - rect.left ) / rect.width ) * video.duration;
			}
		}

		window.requestAnimationFrame( changeAngle );
	}

	video360Controller( entry ) {
		const videoEl = entry.target.querySelector( 'video' );
		if ( entry.target.action === 'enter' ) {
			videoEl.onmousemove = this.handleVideo360;
		} else if ( entry.target.action === 'leave' ) {
			videoEl.onmousemove = null;
		}
	}
}

// THIS FILE.js
// on script load trigger immediately ssc
window.addEventListener( 'load', () => {
	// const content = document.getElementById( 'page' );
	const content = document.querySelector( '.wp-site-blocks' );

	const options = {
		page: content,
	};

	 ( typeof window.screenControl )
		? window.screenControl = new _ssc( options )
		: console.low( 'unable to load multiple ssc instances' );
} );


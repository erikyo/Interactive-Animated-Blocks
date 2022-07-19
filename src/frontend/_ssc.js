import { textStaggerPresets } from '../utils/data';
import { mouseWheel } from '../utils/compat';
import { getElelementData } from '../utils/fn';
import anime from 'animejs';
import ScrollMagic from 'scrollmagic';
import { ScrollMagicPluginIndicator } from 'scrollmagic-plugins';

ScrollMagicPluginIndicator( ScrollMagic );

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
		this.initMutationObserver = this.initMutationObserver.bind( this );

		this.videoParallaxed = [];
		this.parallaxVideo = this.parallaxVideo.bind( this );

		this.handleAnimation = this.handleAnimation.bind( this );

		this.animations = [];
		this.staggerPresets = textStaggerPresets;

		this.scrollMagic = new ScrollMagic.Controller();

		this.timelines = [];

		// avoid scrolling before the page has been loaded
		this.hasScrolling = false;
		this.isScrolling = Date.now() + 100;

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
				return this.isBetween( rect, position );
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

	isBetween( rect, rangePosition ) {
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
						( element.sscItemOpts.direction === 'y'
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
		// if the parallax function wasn't running before we need to start it
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

		// create a scene
		this.timelines[ el.sscItemData.sscItem ] = new ScrollMagic.Scene( {
			triggerElement: el,
			duration: el.sscItemOpts.duration,
			easing: el.sscItemOpts.easing,
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

		el.unWatch = this.observer.unobserve( el );

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
			videoEl.autoplay = false;
			videoEl.controls = false;
			videoEl.loop = false;
			videoEl.muted = true;
			videoEl.playsinline = true;
			videoEl.preload = 'auto';
			videoEl.pause();
			el.classList.add( 'ssc-video' );
		}

		if ( el.sscItemData.sscAnimation === 'sscScrollJacking' ) {
			el.style.minHeight = 'calc(100vh + 30px)';
			el.style.padding = 0;
			el.style.margin = 0;
		}

		if ( el.sscItemData.sscAnimation === 'sscTimelineChild' ) {
			// init ScrollMagic scene
			el.classList.add( 'ssc-timeline-scene' );
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
				this.addMetaToCollected( el, index );

				if ( el.sscItemData.sscAnimation === 'sscScrollTimeline' ) {
					// init ScrollMagic
					this.timelines[ el.sscItemData.sscItem ] = el;
				} else {
					// watch the elements to detect the screen margins intersection
					this.observer.observe( el );
				}
			}, this );

			// start timelines
			this.timelines.forEach( ( el ) => this.scrollTimeline( el ) );

			// start parallax
			this.parallax();

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
						this.animateTextNode( entry );
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
						this.addMetaToCollected( el, this.collected.length );

						// watch the elements to detect the screen margins intersection
						return this.observer.observe( el );
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
	 * @param  entry
	 */
	handleAnimation = ( entry ) => {
		if ( ! this.animations[ entry.target.sscItemData.sscItem ] ) {
			if ( entry.target.action === 'leave' ) return true;
			const el = {
				targets: entry.target,
				action: entry.target.action,
				animationEnter: entry.target.sscItemOpts.animationEnter,
				animationLeave: entry.target.sscItemOpts.animationLeave,
				stagger: entry.target.sscItemOpts.stagger,
				delay: parseInt( entry.target.sscItemOpts.delay, 10 ) || 0,
				duration:
					parseInt( entry.target.sscItemOpts.duration, 10 ) || 1000,
				locked: false,
				intersection:
					parseInt( entry.target.sscItemOpts.intersection, 10 ) || 25,
				initElement() {
					// applies the custom props used by animate.css
					if ( this.duration )
						entry.target.style.setProperty(
							'--animate-duration',
							el.duration + 'ms'
						);
					this.targets =
						this.stagger === 'none'
							? entry.target
							: entry.target.children;
					this.container =
						this.stagger !== 'none' ? entry.target : null;
				},
				addCssClass( item, cssClass ) {
					if ( cssClass !== 'false' )
						item.classList.add(
							'animate__animated',
							'animate__' + cssClass
						);
					return this;
				},
				removeCssClass( item, cssClass ) {
					if ( cssClass !== 'false' ) {
						item.classList.remove(
							'animate__animated',
							'animate__' + cssClass
						);
					}
					return this;
				},
				animateItem( action ) {
					if ( this.stagger === 'none' ) {
						// check if the action needed is "enter" and if the element is in viewport
						return action === 'enter'
							? this.removeCssClass(
									this.targets,
									this.animationLeave
							  ).addCssClass( this.targets, this.animationEnter )
							: this.removeCssClass(
									this.targets,
									this.animationEnter
							  ).addCssClass(
									this.targets,
									this.animationLeave
							  );
					}
					Object.values( this.targets ).forEach(
						( target, index ) => {
							setTimeout(
								function () {
									return action === 'enter'
										? this.removeCssClass(
												target,
												this.animationLeave
										  ).addCssClass(
												target,
												this.animationEnter
										  )
										: this.removeCssClass(
												target,
												this.animationEnter
										  ).addCssClass(
												target,
												this.animationLeave
										  );
								}.bind( this ),
								this.duration * index * 0.1
							);
						}
					);
				},
			};

			el.initElement();

			this.animations[ entry.target.sscItemData.sscItem ] = el;
		}

		const el = this.animations[ entry.target.sscItemData.sscItem ];

		if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
			if (
				! el.locked &&
				el.action === entry.target.action &&
				el.action === 'enter'
					? this.checkVisibility(
							entry.target,
							'between',
							el.intersection
					  )
					: ! this.checkVisibility(
							entry.target,
							'between',
							el.intersection
					  )
			) {
				el.locked = true;
				return (
					this.delay( el.delay )
						.then( () => {
							return el.animateItem( el.action );
						} )
						// wait the animation has been completed before unlock the element
						.then(
							() =>
								new Promise( ( resolve ) => {
									setTimeout( function () {
										/*return this.handleAnimation( entry );*/
										el.locked = false;
										el.action =
											el.action === 'enter'
												? 'leave'
												: 'enter';
										resolve();
									}, el.duration );
								} )
						)
						.then( () =>
							this.checkVisibility(
								entry.target,
								'partiallyVisible'
							)
								? this.handleAnimation( entry )
								: el.animateItem( 'leave' )
						)
				);
			}
			this.delay( 100 ).then( () => {
				this.handleAnimation( entry );
			} );
		} else {
			if ( el.locked ) {
				this.delay( el.duration * 1 ).then( () => {
					el.locked = false;
				} );
			}
			el.animateItem( 'leave' );
		}
	};

	splitSentence( sentence, splitBy = 'word' ) {
		const words = sentence.split( ' ' );
		const result = words.map( ( word ) => {
			if ( splitBy === 'word' ) {
				return `<span class="word">${ word }</span>`;
			}
			return (
				'<span class="word">' +
				word.replace( /\S/g, `<span class="letter">$&</span>` ) +
				'</span>'
			);
		} );
		return result.join( ' ' );
	}

	animateWord = ( el ) => {
		const animateLetter = ( letter ) => {
			const alpha = [
				'!',
				'#',
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'A',
				'M',
				'T',
				'P',
				'W',
				'G',
				'E',
				'R',
				'I',
				'K',
			];

			letter.classList.add( 'changing' ); //change color of letter
			const original = letter.innerHTML; //get original letter for use later
			/*.letter{
        &.changing{
          color: lightgray;
        }
      }*/

			//loop through random letters
			let i = 0;
			const letterInterval = setInterval( function () {
				// Get random letter
				const randomLetter =
					alpha[ Math.floor( Math.random() * alpha.length ) ];
				letter.innerHTML = randomLetter;
				if ( i >= Math.random() * 100 || randomLetter === original ) {
					//if letter has changed around 10 times then stop
					clearInterval( letterInterval );
					letter.innerHTML = original; //set back to original letter
					letter.classList.remove( 'changing' ); //reset color
				}
				++i;
			}, 100 );
		};

		const letters = el.querySelectorAll( '.letter' );
		const shuffleDuration = el.sscItemOpts.duration;

		letters.forEach( function ( letter, index ) {
			//trigger animation for each letter in word
			setTimeout( function () {
				animateLetter( letter, shuffleDuration );
			}, 100 * index ); //small delay for each letter
		} );

		setTimeout( function () {
			el.removeAttribute( 'data-ssc-count' );
		}, shuffleDuration );
	};

	/**
	 * Animate Numbers
	 *
	 * @param {Object} el Element to animate.
	 */
	animateCount( el ) {
		anime( {
			targets: el.target || el.target.lastChild,
			textContent: [ 0, parseInt( el.target.lastChild.textContent, 10 ) ],
			round: 1,
			duration: parseInt( el.target.sscItemOpts.duration ) || 5000,
			delay: parseInt( el.target.sscItemOpts.delay ) || 500,
			easing: el.target.sscItemOpts.easing,
			complete: () => el.target.removeAttribute( 'data-ssc-count' ),
		} );
	}

	animateTextNode( el ) {
		if ( el.target.dataset.sscCount || el.target.action === 'leave' ) {
			return true;
		}
		el.target.dataset.sscCount = 'true';

		if ( el.target.sscItemOpts.target === 'number' ) {
			this.animateCount( el );
		} else {
			if ( ! el.target.dataset.init ) {
				const replaced = this.splitSentence(
					el.target.innerHTML,
					'letters'
				);

				if ( el.target.innerHTML ) {
					el.target.innerHTML = replaced;
				}
				el.target.dataset.init = 'true';
			}

			this.delay( el.target.sscItemOpts.delay ).then( () =>
				this.animateWord( el.target )
			);
		}
	}

	textStagger( entry ) {
		const item = entry.target;

		if (
			item.action === 'enter' &&
			this.checkVisibility( entry.target, 'between', 25 )
		) {
			const preset = item.sscItemOpts.preset;
			const duration = parseInt( item.sscItemOpts.duration, 10 );
			const delay = parseInt( item.sscItemOpts.delay, 10 );
			const easing = item.sscItemOpts.easing;
			const splitBy = item.sscItemOpts.splitBy || 'letter';

			const replaced = this.splitSentence(
				item.lastChild.textContent,
				splitBy
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
							delay: anime.stagger( duration * 0.05 ),
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
			this.checkVisibility(
				entry.target,
				'between',
				entry.target.sscItemOpts.intersection
			)
		) {
			action = 'leave';
			if ( animation.began && animation.currentTime !== 0 ) {
				animation.reverse();
			} else {
				animation = anime( {
					targets: path,
					direction: 'normal',
					strokeDashoffset: [ anime.setDashoffset, 0 ],
					easing: entry.target.sscItemOpts.easing || 'linear',
					duration: entry.target.sscItemOpts.duration || 5000,
					delay( el, i ) {
						return (
							( i * entry.target.sscItemOpts.duration ) /
							path.length
						);
					},
				} );
			}
		} else if (
			action === 'leave' &&
			! this.checkVisibility(
				entry.target,
				'between',
				entry.target.sscItemOpts.intersection
			)
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
					duration: entry.target.sscItemOpts.duration,
					delay( el, i ) {
						return (
							( i * entry.target.sscItemOpts.duration ) /
							path.length
						);
					},
					direction: 'reverse',
				} );
			}
		}
		if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
			this.delay( 100 ).then( () => {
				this.animationSvgPath( entry, action, animation );
			} );
		}
	};

	// ScrollTo
	scrollJacking = ( entry ) => {
		// if there aren't any defined target, store this one
		if ( entry.target.action !== 'enter' || this.hasScrolling !== false )
			return false;

		this.hasScrolling = entry.target.sscItemData.sscItem;

		const disableWheel = ( e ) => {
			e.preventDefault();
		};

		const screenJackTo = ( el ) => {
			// disable the mouse wheel during scrolling to avoid flickering
			window.addEventListener( mouseWheel, disableWheel, {
				passive: false,
			} );

			const duration = parseInt( el.target.sscItemOpts.duration, 10 );

			if ( el.target.id )
				window.history.pushState( null, null, '#' + el.target.id );

			// remove any previous animation
			anime.remove();
			anime( {
				targets: [
					window.document.scrollingElement ||
						window.document.body ||
						window.document.documentElement,
				],
				scrollTop: el.target.offsetTop + 10,
				easing: el.target.sscItemOpts.easing || 'linear',
				duration: duration || 700,
				delay: parseInt( el.target.sscItemOpts.delay, 10 ) || 0,
				complete: () => {
					this.delay( 200 ).then( () => {
						// this.windowData.lastScrollPosition = window.pageYOffset;
						// window.pageYOffset = el.target.offsetTop;
						this.hasScrolling = false;
						return window.removeEventListener(
							mouseWheel,
							disableWheel,
							{
								passive: false,
							}
						);
					} );
				},
			} );
		};

		if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
			screenJackTo( entry );
		}
	};

	parallaxVideo() {
		if ( window.pageYOffset === this.windowData.lastScrollPosition ) {
			// callback the animationFrame and exit the current loop
			return window.requestAnimationFrame( this.parallaxVideo );
		}

		// Store the last position
		this.windowData.lastScrollPosition = window.pageYOffset;

		this.videoParallaxed.forEach( ( video ) => {
			// TODO: tween playback with current_frame = (previous value + new_value) in Arduino style
			const rect = video.item.getBoundingClientRect();
			video.item.currentTime =
				( 1 +
					-( rect.top + this.windowData.viewHeight ) /
						( window.pageYOffset + rect.height ) ) *
				video.item.duration *
				video.playbackRatio;

			return window.requestAnimationFrame( this.parallaxVideo );
		} );
	}

	videoParallaxController( entry ) {
		const videoEl = entry.target.querySelector( 'video' );
		if ( entry.target.action === 'enter' ) {
			this.videoParallaxed[ entry.target.sscItemData.sscItem ] = {
				item: videoEl,
				videoDuration: videoEl.duration,
				sscItemData: entry.target.sscItemData,
				playbackRatio: entry.target.sscItemOpts.playbackRatio,
			};
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
			videoEl.removeEventListener( mouseWheel, this.videoOnWheel );
			return true;
		}
		window.requestAnimationFrame( () => {
			// set the current frame
			const Offset = event.deltaY > 0 ? 1 / 29.7 : ( 1 / 29.7 ) * -1; // e.deltaY is the direction
			videoEl.currentTime = (
				videoEl.currentTime +
				Offset * event.target.playbackRatio
			).toPrecision( 5 );
		} );
	};

	// Listens mouse scroll wheel
	videoWheelController( el ) {
		if ( el.target.action === 'enter' ) {
			const videoEl = el.target.querySelector( 'video' );
			videoEl.playbackRatio = parseFloat(
				el.target.sscItemOpts.playbackRatio
			);
			videoEl.addEventListener( mouseWheel, this.videoOnWheel );
		}
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
			if ( video.readyState > 1 ) {
				video.currentTime = (
					( ( e.clientX - rect.left ) / rect.width ) *
					video.duration *
					video.spinRatio
				).toPrecision( 5 );
			}
		}

		window.requestAnimationFrame( changeAngle );
	}

	video360Controller( entry ) {
		const videoEl = entry.target.querySelector( 'video' );
		videoEl.spinRatio = parseFloat( entry.target.sscItemOpts.spinRatio );
		if ( entry.target.action === 'enter' ) {
			videoEl.onmousemove = this.handleVideo360;
		} else if ( entry.target.action === 'leave' ) {
			videoEl.onmousemove = null;
		}
	}
}

// on load and on hashchange (usually on history back/forward)
const jumpToHash = () => {
	if ( typeof window.location.hash !== undefined ) {
		//GOTO
		console.log( window.location.hash );
	}
};
window.addEventListener( 'load', jumpToHash );
window.addEventListener( 'hashchange', jumpToHash );

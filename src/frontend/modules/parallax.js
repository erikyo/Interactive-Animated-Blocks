/**
 * The Parallax effect
 * Handles the Parallax effect for each item stored into "this.parallaxed" array
 *
 * If the last scroll position is the same as the current scroll position, then request an animation frame and exit the current loop.
 * Otherwise, apply the parallax style to each element and request an animation frame callback.
 *
 * The parallax function is called on the window's scroll event
 *
 */
export function handleParallax() {
	if ( typeof this.parallaxed !== 'undefined' && this.parallaxed.length ) {
		// if last position is the same as current
		if ( window.scrollY === this.windowData.lastScrollPosition ) {
			// callback the animationFrame and exit the current loop
			window.requestAnimationFrame( this.handleParallax );
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
					-0.2; // TODO: parallax movement constant
				element.style.transform =
					'translate3d(' +
					( element.sscItemOpts.direction === 'y'
						? '0,' + styleValue + 'px'
						: styleValue + 'px,0' ) +
					',0)';
			}

			// requestAnimationFrame callback
			window.requestAnimationFrame( this.handleParallax );

			// Store the last position
			this.windowData.lastScrollPosition = window.scrollY;
		} );
	}
}

/**
 * If the item is entering the viewport, add it to the watched list and start the parallax function.
 * If the item is leaving the viewport, remove it from the watched list
 *
 * @param {IntersectionObserverEntry} entry - the entry object that is passed to the callback function
 */
export function ItemParallaxController( entry ) {
	// add this object to the watched list
	this.parallaxed[ entry.target.sscItemData.sscItem ] = entry.target;
	// if the parallax function wasn't running before we need to start it
	if ( this.parallaxed.length ) {
		handleParallax();
	}
	if ( entry.target.action === 'leave' ) {
		// remove the animated item from the watched list
		this.parallaxed = this.parallaxed.filter(
			( item ) =>
				item.sscItemData.sscItem !== entry.target.sscItemData.sscItem
		);
		console.log(
			`ssc-${ entry.target.sscItemData.sscItem } will be unwatched. current list`,
			this.parallaxed
		);
	}
}

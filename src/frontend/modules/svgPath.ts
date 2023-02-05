import anime from 'animejs';
import { delay, isActiveArea, isPartiallyVisible } from '../../utils/utils';

/**
 * If the element is in the viewport, animate the SVG paths
 *
 * @todo - provide an option to "start hidden"
 *
 * @module animationSvgPath
 *
 * @param {IntersectionObserverEntry} entry                     - The IntersectionObserverEntry object.
 * @param {string}                    action                    - The action to be performed.
 * @param {SVGAnimateElement}         [animationInstance=false] - This is the instance of the animation. It's used to reverse the animation.
 *
 */
const animationSvgPath = ( entry, action, animationInstance = false ) => {
	let animation = animationInstance ? animationInstance : anime;
	const path = entry.target.querySelectorAll( 'path' );
	if (
		action === 'enter' &&
		isActiveArea( entry.target, entry.target.sscItemOpts.intersection )
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
						( i * entry.target.sscItemOpts.duration ) / path.length
					);
				},
			} );
		}
	} else if (
		action === 'leave' &&
		! isActiveArea( entry.target, entry.target.sscItemOpts.intersection )
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
						( i * entry.target.sscItemOpts.duration ) / path.length
					);
				},
				direction: 'reverse',
			} );
		}
	}
	if ( isPartiallyVisible( entry.target ) ) {
		delay( 100 ).then( () => {
			animationSvgPath( entry, action, animation );
		} );
	}
};

export default animationSvgPath;

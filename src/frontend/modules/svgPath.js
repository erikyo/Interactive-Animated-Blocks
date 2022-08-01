import anime from 'animejs';
import { delay } from '../../utils/utils';

const animationSvgPath = ( entry, action, animationInstance = false ) => {
	let animation = animationInstance ? animationInstance : anime;
	const path = entry.target.querySelectorAll( 'path' );
	if (
		action === 'enter' &&
		this.checkVisibility(
			entry.target,
			'inActiveArea',
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
						( i * entry.target.sscItemOpts.duration ) / path.length
					);
				},
			} );
		}
	} else if (
		action === 'leave' &&
		! this.checkVisibility(
			entry.target,
			'inActiveArea',
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
						( i * entry.target.sscItemOpts.duration ) / path.length
					);
				},
				direction: 'reverse',
			} );
		}
	}
	if ( this.checkVisibility( entry.target, 'partiallyVisible' ) ) {
		delay( 100 ).then( () => {
			this.animationSvgPath( entry, action, animation );
		} );
	}
};

export default animationSvgPath;

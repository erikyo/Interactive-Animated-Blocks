import anime from 'animejs';
import ScrollMagic from 'scrollmagic';

export const timelines = [];

function scrollTimeline( el ) {
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
	timelines[ el.sscItemData.sscItem ] = new ScrollMagic.Scene( {
		triggerElement: el,
		duration: el.sscItemOpts.duration,
		triggerHook: el.sscItemOpts.triggerHook || 0.25,
	} )
		// Add debug indicators
		.addIndicators()
		// bind animation timeline with anime.js animation progress
		.on( 'progress', function ( event ) {
			timeline.seek( timeline.duration * event.progress );
		} )
		.setPin( el )
		.addTo( this.scrollMagic );
}

export default scrollTimeline;

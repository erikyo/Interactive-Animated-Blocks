import { isPartiallyVisible } from '../../utils/utils';

/**
 * @typedef videoParallaxed - the array that contains parallax video collection
 *
 * @property {Element} videoParallaxed[Element] - a single instance of the settings of the parallaxed video
 */
let videoParallaxed = [];
let lastVideoScrollPosition = window.scrollY;

/**
 * It loops through all the videos that have been registered for parallaxing,
 * and sets their current time to a value that is calculated based on the video's position on the screen
 *
 * @return {Function} The function parallaxVideo is being returned.
 */
export function parallaxVideo() {
	if ( window.scrollY === lastVideoScrollPosition ) {
		// callback the animationFrame and exit the current loop
		return window.requestAnimationFrame( parallaxVideo );
	}

	// Store the last position
	lastVideoScrollPosition = window.scrollY;

	videoParallaxed.forEach( ( video ) => {
		const rect = video.item.getBoundingClientRect();
		if ( video.hasExtraTimeline ) {
			// the timeline behaviour
			// // ( ( window.scrollY - rect.top ) - video.distanceTop )
			// stands for the total height scrolled
			// // (window.innerHeight * 0.5) + rect.height
			// stands for the height of the item that is the real needed value
			// and, since I need to end the video before the edge, I've added a half of the total height of the page (anyway to be fully correct we need to remove this)
			video.item.currentTime = (
				( ( ( ( window.scrollY - rect.top ) - video.distanceTop ) + rect.height ) /
          ( video.timelineLength ) ) *
				video.videoDuration *
				video.playbackRatio
			).toFixed( 5 );
		} else {
			// the common behaviour
			video.item.currentTime = (
				( 1 - ( ( rect.top + rect.height ) / video.timelineLength ) ) *
				video.videoDuration *
				video.playbackRatio
			).toFixed( 5 );
		}
	} );

	return window.requestAnimationFrame( parallaxVideo );
}

/**
 * It checks if the video is partially visible, and if it is, it adds it to the `videoParallaxed` array
 *
 * @module videoParallaxController
 * @param {IntersectionObserverEntry} entry - The entry object returned by the Intersection Observer API.
 * @return {Array} the filtered array of videoParallaxed.
 */
function videoParallaxController( entry ) {
	const videoEl = entry.target.querySelector( 'video' );
	if ( videoEl && ! videoParallaxed[ entry.target.sscItemData.sscItem ] ) {
		if ( isPartiallyVisible( videoEl ) ) {
			const rect = entry.target.getBoundingClientRect();
			const timelineDuration =
				parseInt( entry.target.sscItemData.timelineDuration, 10 ) || 0;
			const duration =
				rect.height + window.innerHeight + timelineDuration;
			videoParallaxed[ entry.target.sscItemData.sscItem ] = {
				item: videoEl,
				videoDuration: videoEl.duration,
				sscItemData: entry.target.sscItemData,
				hasExtraTimeline: timelineDuration,
				timelineLength: duration,
				distanceTop: window.scrollY + rect.top,
				playbackRatio: parseFloat(
					entry.target.sscItemOpts.playbackRatio
				).toFixed( 2 ),
			};
		}
		parallaxVideo();
	}

	if ( entry.target.action === 'leave' ) {
		return ( videoParallaxed = videoParallaxed.filter(
			( item ) =>
				item.sscItemData.sscItem !== entry.target.sscItemData.sscItem
		) );
	}
}
export default videoParallaxController;

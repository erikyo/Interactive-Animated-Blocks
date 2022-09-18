import { isPartiallyVisible } from '../../utils/utils';

/**
 * @typedef videoParallaxed - the array that contains parallax video collection
 *
 * @property {Element} videoParallaxed[Element] - a single instance of the settings of the parallaxed video
 */
let videoParallaxed = [];
let lastVideoScrollPosition = 0;

/**
 * It calculates the current time of the video based on the scroll position
 *
 * @param {videoParallaxed}  video                  - the video object
 * @param {HTMLVideoElement} video.item             - the video item
 * @param {number}           video.videoDuration    - the video videoDuration
 * @param {Object}           video.sscItemData      - the video data props
 * @param {number}           video.hasExtraTimeline - the video hasExtraTimeline
 * @param {number}           video.timelineLength   - the video timelineLength
 * @param {number}           video.distanceTop      - the video distanceTop
 * @param {number}           video.playbackRatio    - the video playbackRatio
 */
function videoParallaxCallback( video ) {
	const rect = video.item.getBoundingClientRect();
	if ( video.hasExtraTimeline ) {
		// the timeline behaviour
		// // ( ( window.scrollY - rect.top ) - video.distanceTop )
		// stands for the total height scrolled
		// // + rect.height * video duration
		// stands for the height of the item that is the real needed value
		// 60% of a timeline of a video 10sec long -> (60 * 0.01) * 10
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
}

/**
 * It loops through all the videos that have been registered for parallaxing,
 * and sets their current time to a value that is calculated based on the video's position on the screen
 *
 * @return {Function} The function parallaxVideo is being returned.
 */
export function parallaxVideos() {
	if ( window.scrollY === lastVideoScrollPosition ) {
		// callback the animationFrame and exit the current loop
		return window.requestAnimationFrame( parallaxVideos );
	}

	// for each video inside the screen fire the update of the displayed frame
	videoParallaxed.forEach( ( video ) => videoParallaxCallback( video ) );

	// Store the last position
	lastVideoScrollPosition = window.scrollY;

	return window.requestAnimationFrame( parallaxVideos );
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
				distanceTop: window.scrollY + rect.top, // works 99% of the time but needs to be fixed in case of timeline-child (in this case we need to get the parent container Y)
				playbackRatio: parseFloat(
					entry.target.sscItemOpts.playbackRatio
				).toFixed( 5 ),
			};
		}
		parallaxVideos();
	}

	if ( entry.target.action === 'leave' ) {
		return ( videoParallaxed = videoParallaxed.filter(
			( item ) =>
				item.sscItemData.sscItem !== entry.target.sscItemData.sscItem
		) );
	}
}
export default videoParallaxController;

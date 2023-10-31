import { isPartiallyVisible } from '../../utils/';
import type { SSCAnimationTypeParallaxVideo, SscElement } from '../../types';

export interface VideoParallaxElement {
	element: HTMLVideoElement;
	elementId: number;
	options: SSCAnimationTypeParallaxVideo;
	videoDuration: number;
	hasExtraTimeline: number;
	timelineLength: number;
	currentTime?: number;
	distanceTop: number;
	playbackRatio: number;
}

/**
 * @typedef videoParallaxed - the array that contains parallax video collection
 *
 * @property {Element} videoParallaxed[Element] - a single instance of the settings of the parallaxed video
 */
let videoParallaxed: VideoParallaxElement[] = [];
let lastVideoScrollPosition = 0;

/**
 * It calculates the current time of the video based on the scroll position
 *
 * @param {videoParallaxed}  video                  - the video object
 * @param {HTMLVideoElement} video.element          - the video html element
 * @param {number}           video.videoDuration    - the video videoDuration
 * @param {Object}           video.sscItemData      - the video data props
 * @param {number}           video.hasExtraTimeline - the video hasExtraTimeline
 * @param {number}           video.timelineLength   - the video timelineLength
 * @param {number}           video.distanceTop      - the video distanceTop
 * @param {number}           video.playbackRatio    - the video playbackRatio
 */
function videoParallaxCallback(video: VideoParallaxElement) {
	const rect = video.element.getBoundingClientRect();
	if (video.element.readyState > 1) {
		if (video.hasExtraTimeline) {
			// the timeline behaviour
			// // ( ( window.scrollY - rect.top ) - video.distanceTop )
			// stands for the total height scrolled
			// // + rect.height * video duration
			// stands for the height of the item that is the real needed value
			// 60% of a timeline of a video 10sec long -> (60 * 0.01) * 10
			video.element.currentTime =
				((window.scrollY - rect.top - video.distanceTop + rect.height) /
					video.timelineLength) *
				video.videoDuration *
				video.playbackRatio;
		} else {
			// the common behaviour
			video.element.currentTime =
				(1 - (rect.top + rect.height) / video.timelineLength) *
				video.videoDuration *
				video.playbackRatio;
		}
	}
}

/**
 * It loops through all the videos that have been registered for parallaxing,
 * and sets their current time to a value that is calculated based on the video's position on the screen
 *
 * @return {Function} The function parallaxVideo is being returned.
 */
export function parallaxVideos() {
	if (window.scrollY === lastVideoScrollPosition) {
		// callback the animationFrame and exit the current loop
		return window.requestAnimationFrame(parallaxVideos);
	}

	// for each video inside the screen fire the update of the displayed frame
	videoParallaxed.forEach((video) => videoParallaxCallback(video));

	// Store the last position
	lastVideoScrollPosition = window.scrollY;

	return window.requestAnimationFrame(parallaxVideos);
}

/**
 * It checks if the video is partially visible, and if it is, it adds it to the `videoParallaxed` array
 *
 * @module videoParallaxController
 * @param  sscVideo - the video
 */
function videoParallaxController(sscVideo: SscElement) {
	// get the video element inside the video controller
	const videoEl = sscVideo.querySelector('video');

	if (!videoEl) return;

	// get the video options
	const videoElOptions =
		sscVideo.sscItemOpts as SSCAnimationTypeParallaxVideo;
	// check if the video exists in the video parallaxed array
	if (sscVideo && !videoParallaxed[sscVideo.sscItemData.sscItem]) {
		// check if the video is partially visible
		if (isPartiallyVisible(videoEl)) {
			const rect = sscVideo.getBoundingClientRect();
			const timelineDuration =
				Number(videoElOptions.timelineDuration) || 0;
			const duration =
				rect.height + window.innerHeight + timelineDuration;
			videoParallaxed[sscVideo.sscItemData.sscItem] = {
				element: videoEl,
				elementId: sscVideo.sscItemData.sscItem,
				videoDuration: videoEl.duration,
				options: videoElOptions,
				hasExtraTimeline: timelineDuration,
				timelineLength: duration,
				distanceTop: window.scrollY + rect.top, // works 99% of the time but needs to be fixed in case of timeline-child (in this case we need to get the parent container Y)
				playbackRatio: videoElOptions.playbackRatio,
			};
		}
		parallaxVideos();
	}

	if (sscVideo.action === 'leave') {
		return (videoParallaxed = videoParallaxed.filter(
			(item) => item.elementId !== sscVideo.sscItemData.sscItem
		));
	}
}
export default videoParallaxController;

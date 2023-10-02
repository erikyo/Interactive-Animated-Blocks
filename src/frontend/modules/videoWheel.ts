import { mouseWheel } from '../../utils/compat';
import type {
	SSCAnimationTypeParallaxVideo,
	SscElement,
} from '../../types.d.ts';

interface SscVideoElement extends HTMLVideoElement {
	element: HTMLVideoElement;
	elementId: number;
	options: SSCAnimationTypeParallaxVideo;
	videoDuration: number;
	hasExtraTimeline: number;
	timelineLength: number;
	currentTime: number;
	distanceTop: number;
}

/**
 * "If the video is not at the beginning or end, then move the video forward or backward by 1/29.7 of a second."
 *
 * The first thing we do is prevent the default behavior of the event. This is because we don't want the browser to scroll the page when the user scrolls the video
 *
 * @param {WheelEvent} event - the event object
 *
 * @return itself in order to loop until condition were met
 */
const videoOnWheel = (event: WheelEvent): void => {
	event.preventDefault();

	const videoEl = event.target as SscVideoElement;

	if (videoEl) {
		if (
			(videoEl.currentTime <= 0 && event.deltaY < 0) ||
			(videoEl.currentTime === videoEl.duration && event.deltaY > 0)
		) {
			videoEl.removeEventListener(mouseWheel, videoOnWheel);
		}
		window.requestAnimationFrame(() => {
			// set the current frame
			const Offset = event.deltaY > 0 ? 1 / 29.7 : (1 / 29.7) * -1; // e.deltaY is the direction
			videoEl.currentTime =
				videoEl.currentTime + Offset * videoEl.options.playbackRatio;
		});
	}
};

/**
 * It adds a mousewheel event listener to the video element, and when the mousewheel event is triggered, it changes the playback rate of the video
 *
 * @param {IntersectionObserverEntry} element - The element that the controller is attached to.
 */
function videoWheelController(element: SscElement) {
	const videoEl = element.querySelector('video') as SscVideoElement | null;
	if (!videoEl) return;
	// set the default playback rate to 1 and the current time to 0
	videoEl.options.playbackRatio = element.sscItemOpts.playbackRatio;
	videoEl.addEventListener(mouseWheel, videoOnWheel);
}

export default videoWheelController;

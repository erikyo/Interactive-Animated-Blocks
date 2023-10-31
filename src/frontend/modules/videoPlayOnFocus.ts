import { SscElement } from '../../types';

/**
 * The above code is a function handle the play state of the video and  is called when it is in viewport.
 *
 * @module videoFocusPlay
 * @param                             element
 *
 * @param {IntersectionObserverEntry} entry
 */
const videoPlayOnFocus = (element: SscElement) => {
	const video: HTMLVideoElement | null = element.querySelector('video');
	// return if the element is not a video
	if (!video) return;
	// play the video when it is in the viewport
	if (element.action === 'enter') {
		return video.play();
	}
	// pause the video when is ended
	if (!video.ended) {
		return video.pause();
	}
	// reset the video and stop it if no conditions are met
	video.pause();
	video.currentTime = 0;
};

export default videoPlayOnFocus;

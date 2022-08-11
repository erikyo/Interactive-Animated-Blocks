import { mouseWheel } from '../../utils/compat';

/**
 * "If the video is not at the beginning or end, then move the video forward or backward by 1/29.7 of a second."
 *
 * The first thing we do is prevent the default behavior of the event. This is because we don't want the browser to scroll the page when the user scrolls the video
 *
 * @param {WheelEvent} event - the event object
 *
 * @return {Function} itself in order to loop until condition were met
 */
const videoOnWheel = ( event ) => {
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

/**
 * It adds a mousewheel event listener to the video element, and when the mousewheel event is triggered, it changes the playback rate of the video
 *
 * @param {IntersectionObserverEntry} el - The element that the controller is attached to.
 */
function videoWheelController( el ) {
	const videoEl = el.target.querySelector( 'video' );
	videoEl.playbackRatio = parseFloat( el.target.sscItemOpts.playbackRatio );
	videoEl.addEventListener( mouseWheel, videoOnWheel );
}

export default videoWheelController;

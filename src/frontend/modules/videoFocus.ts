/**
 * The above code is a function handle the play state of the video and  is called when it is in viewport.
 *
 * @module videoFocusPlay
 *
 * @param {IntersectionObserverEntry} entry
 */
const videoFocusPlay = ( entry ) => {
	const video = entry.target.querySelector( 'video' );
	if ( entry.target.action === 'enter' ) {
		return video.play();
	}
	if ( ! video.ended ) {
		return video.pause();
	}
	video.pause();
	video.currentTime = 0;
};

export default videoFocusPlay;

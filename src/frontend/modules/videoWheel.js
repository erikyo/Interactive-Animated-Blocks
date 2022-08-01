import { mouseWheel } from '../../utils/compat';

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

// Listens mouse scroll wheel
function videoWheelController( el ) {
	const videoEl = el.target.querySelector( 'video' );
	videoEl.playbackRatio = parseFloat( el.target.sscItemOpts.playbackRatio );
	videoEl.addEventListener( mouseWheel, videoOnWheel );
}

export default videoWheelController;

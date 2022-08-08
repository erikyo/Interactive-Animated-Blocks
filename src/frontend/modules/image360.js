/**
 * It adds a mousemove event listener to the video element,
 * which updates the video's current time based on the mouse's position creating the image 360 effect
 *
 * @param {IntersectionObserverEntry} entry - The entry object passed to the callback function.
 */
const video360Controller = ( entry ) => {
	/** @constant {HTMLVideoElement} videoEl  */
	const videoEl = entry.target.querySelector( 'video' );

	videoEl.timeoutAutoplay = null;
	videoEl.style.cursor = 'ew-resize';
	videoEl.spinRatio = parseFloat( entry.target.sscItemOpts.spinRatio );
	videoEl.control = entry.target.sscItemOpts.control;
	videoEl.loop = true;
	videoEl.isPlaying = false;
	videoEl.currentAngle = 0.5; // the current angle displayed
	videoEl.startAngle = 0.5; // the event initial angle
	videoEl.currentTime = videoEl.duration * 0.5; // Set the center of view

	/**
	 * A function that takes the current angle (0-1) and returns the related video time
	 * 1 multiplied by the duration of the video is equal the total length of the video
	 * in addition we use the spin ratio to provide a control over the "rotation" speed
	 *
	 * @param {number} currentValue - a number from 0 to 1 that is the representing the progress of the video
	 */
	videoEl.angleToVideoTime = ( currentValue ) => {
		return currentValue * videoEl.duration * videoEl.spinRatio;
	};

	videoEl.currentVideoTimeToAngle = () => {
		return videoEl.currentTime / videoEl.duration;
	};

	videoEl.autoplayVideo = function() {
		return setTimeout( () => {
			return videoEl.play();
		}, 2000 );
	};

	videoEl.getAngle = ( video, pointerX ) => {
		const rect = video.getBoundingClientRect();
		return parseFloat( ( pointerX - rect.left ) / rect.width );
	};

	videoEl.setAngle = ( currentAngle ) => {
		if ( videoEl.readyState > 1 ) {
			// apply the calculated time to this video
			videoEl.nextTime = videoEl.angleToVideoTime(
				videoEl.currentAngle + ( currentAngle - videoEl.startAngle )
			);
			// if the current time is after the total time returns to the beginning to create the loop effect
			videoEl.currentTime =
				// eslint-disable-next-line no-nested-ternary
				videoEl.nextTime > videoEl.duration
					? videoEl.nextTime - videoEl.duration
					: videoEl.nextTime < 0
						? videoEl.nextTime + videoEl.duration
						: videoEl.nextTime;
			clearTimeout( videoEl.timeoutAutoplay );
		}
	};

	videoEl.handle360byPointerPosition = ( e ) => {
		window.requestAnimationFrame( () => {
			const currentAngle = e.target.getAngle( e.target, e.clientX );
			return e.target.setAngle( currentAngle );
		} );
	};

	videoEl.handle360byDrag = ( e ) => {
		const video = e.target;
		video.style.cursor = 'grab';
		// store the event initial position
		videoEl.currentAngle = videoEl.currentVideoTimeToAngle();
		videoEl.startAngle = video.getAngle( e.target, e.clientX );
		// on mouse move update the current angle
		video.onmousemove = ( ev ) => {
			window.requestAnimationFrame( () => {
				const currentAngle = video.getAngle( ev.target, ev.clientX );
				return video.setAngle( currentAngle );
			} );
		};
	};

	if ( entry.target.action === 'enter' ) {
		if ( entry.target.sscItemOpts.control === 'pointer' ) {
			videoEl.onmousemove = videoEl.handle360byPointerPosition;
		} else {
			videoEl.onmousedown = videoEl.handle360byDrag;
			videoEl.onmouseup = () => {
				videoEl.onmousemove = null;
				videoEl.style.cursor = 'ew-resize';
			};
		}

		videoEl.onmouseout = ( e ) => {
			e.target.pause();
			clearTimeout( e.target.timeoutAutoplay );
			videoEl.timeoutAutoplay = e.target.autoplayVideo();
		};

		videoEl.onmouseenter = ( e ) => {
			videoEl.pause();
			// store the event initial position
			videoEl.currentAngle = videoEl.currentVideoTimeToAngle();
			videoEl.startAngle = e.target.getAngle( e.target, e.clientX );
		};
	} else if ( entry.target.action === 'leave' ) {
		videoEl.onmousemove = null;
	}
};

export default video360Controller;

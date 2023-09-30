import type { SscElement, SscElementParallaxOpts } from '../../types';
import { SSCAnimation360 } from '../../types';

interface SscElementVideo extends HTMLVideoElement {
	timeoutAutoplay: number | undefined;
	nextTime: number;
	spinRatio: number;
	control: string;
	currentAngle: number;
	startAngle: number;
	currentVideoTimeToAngle: () => number;
	autoplayVideo: () => void;
	angleToVideoTime: (currentValue: number) => number;
	getAngle: (video: HTMLVideoElement, pointerX: number) => number;
	getTouchAngle: (video: HTMLVideoElement, pointerX: number) => number;
	setAngle: (currentAngle: number) => void;
	handle360byTouchPosition: (event: TouchEvent) => void;
	updateAngle: (currentAngle: number) => void;
	getVideoTime: (video: HTMLVideoElement) => number;
	getDuration: (video: HTMLVideoElement) => number;
	setVideoTime: (video: HTMLVideoElement, time: number) => void;
	seek: (video: HTMLVideoElement, time: number) => void;
	handle360byPointerPosition: (event: PointerEvent) => void;
	handle360Move: (event: MouseEvent) => void;
	handle360byDrag: (event: MouseEvent) => void;
	handle360byTouch: (event: TouchEvent) => void;
	isPlaying: boolean;
	currentTime: number;
	duration: number;
}

/**
 * It adds a mousemove event listener to the video element,
 * which updates the video's current time based on the mouse's position creating the image 360 effect
 *
 * @module video360Controller
 * @param  element - The entry object passed to the callback function.
 */
const video360Controller = (element: SscElement) => {
	/** @constant {HTMLVideoElement} videoEl  */
	const videoEl = element.querySelector('video') as SscElementVideo;
	const videoOptions = element.sscItemOpts as SSCAnimation360;

	videoEl.timeoutAutoplay = undefined;
	videoEl.style.cursor = 'grab';
	videoEl.spinRatio = Number(videoOptions.spinRatio);
	videoEl.control = videoOptions.control;
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
	videoEl.angleToVideoTime = (currentValue) => {
		return currentValue * videoEl.duration * videoEl.spinRatio;
	};

	videoEl.currentVideoTimeToAngle = () => {
		return videoEl.currentTime / videoEl.duration;
	};

	videoEl.autoplayVideo = function () {
		return setTimeout(() => {
			return videoEl.play();
		}, 2000);
	};

	videoEl.getAngle = (video, pointerX) => {
		const rect = video.getBoundingClientRect();
		return (pointerX - rect.left) / rect.width;
	};

	videoEl.getTouchAngle = (video, pointerX) => {
		const rect = video.getBoundingClientRect();
		return (pointerX - rect.left) / rect.width;
	};

	videoEl.setAngle = (currentAngle) => {
		if (videoEl.readyState > 1) {
			// apply the calculated time to this video
			videoEl.nextTime = videoEl.angleToVideoTime(
				videoEl.currentAngle + (currentAngle - videoEl.startAngle)
			);
			// if the current time is after the total time returns to the beginning to create the loop effect
			videoEl.currentTime =
				// eslint-disable-next-line no-nested-ternary
				videoEl.nextTime > videoEl.duration
					? videoEl.nextTime - videoEl.duration
					: videoEl.nextTime < 0
					? videoEl.nextTime + videoEl.duration
					: videoEl.nextTime;
			clearTimeout(videoEl.timeoutAutoplay);
		}
	};

	videoEl.handle360byPointerPosition = (e) => {
		window.requestAnimationFrame(() => {
			const currentVideo = e.target as SscElementVideo;
			const currentAngle = currentVideo.getAngle(currentVideo, e.clientX);
			return currentVideo.setAngle(currentAngle);
		});
	};

	videoEl.handle360byTouchPosition = (e) => {
		window.requestAnimationFrame(() => {
			const currentVideo = e.target as SscElementVideo;
			const currentAngle = currentVideo.getAngle(
				currentVideo,
				e.changedTouches[0].clientX
			);
			return currentVideo.setAngle(currentAngle);
		});
	};

	videoEl.handle360Move = (event: MouseEvent) => {
		window.requestAnimationFrame(() => {
			const currentVideo = event.target as SscElementVideo;
			const currentAngle = currentVideo.getAngle(
				currentVideo,
				event.clientX
			);
			return currentVideo.setAngle(currentAngle);
		});
	};

	videoEl.handle360byDrag = (e) => {
		const video = e.target as SscElementVideo;
		video.style.cursor = 'grab';
		// store the event initial position
		videoEl.currentAngle = videoEl.currentVideoTimeToAngle();
		videoEl.startAngle = video.getAngle(video, e.clientX);
		// on mouse move update the current angle
		video.onmousemove = (ev) => videoEl.handle360Move(ev);
	};

	videoEl.handle360byTouch = (e) => {
		const currentVideo = e.target as SscElementVideo;
		// store the event initial position
		videoEl.currentAngle = videoEl.currentVideoTimeToAngle();
		videoEl.startAngle = currentVideo.getTouchAngle(
			currentVideo,
			e.changedTouches[0].clientX
		);
		currentVideo.ontouchmove = (ev) => {
			window.requestAnimationFrame(() => {
				const currentAngle = currentVideo.getTouchAngle(
					currentVideo,
					ev.changedTouches[0].clientX
				);
				return currentVideo.setAngle(currentAngle);
			});
		};
	};

	if (element.action === 'enter') {
		if (videoOptions.control === 'pointer') {
			videoEl.onmousemove = videoEl.handle360byPointerPosition;
		} else if (videoOptions.control === 'drag') {
			videoEl.onmousedown = videoEl.handle360byDrag;
			videoEl.onmouseup = () => {
				videoEl.onmousemove = null;
				videoEl.style.cursor = 'grab';
			};
		}

		videoEl.ontouchstart = videoEl.handle360byTouch;

		videoEl.onmouseout = (e) => {
			const video = e.target as SscElementVideo;
			video.pause();
			clearTimeout(video.timeoutAutoplay);
			videoEl.timeoutAutoplay = video.autoplayVideo();
		};

		videoEl.onmouseenter = (e) => {
			videoEl.pause();
			// store the event initial position
			videoEl.currentAngle = videoEl.currentVideoTimeToAngle();
			videoEl.startAngle = e.target.getAngle(e.target, e.clientX);
		};
	} else if (element.action === 'leave') {
		videoEl.onmousemove = null;
	}
};

export default video360Controller;

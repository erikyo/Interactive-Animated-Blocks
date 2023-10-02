// Safe event definition
// detect available wheel event
export let mouseWheel: string | undefined;
if ('onwheel' in document.createElement('div')) {
	mouseWheel = 'wheel'; // new browsers
} else {
	mouseWheel =
		window.onmousewheel !== undefined
			? 'mousewheel' // Webkit and IE support at least "mousewheel"
			: 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox
}

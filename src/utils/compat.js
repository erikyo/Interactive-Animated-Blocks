// Safe event definition
// detect available wheel event
export const mouseWheel =
	'onwheel' in document.createElement( 'div' )
		? 'wheel' // Modern browsers support "wheel"
		: document.onmousewheel !== undefined
		? 'mousewheel' // Webkit and IE support at least "mousewheel"
		: 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

/**
 * It takes the click event, finds the target element, and scrolls to it
 *
 * @param {Event} e - The event object.
 */
const jumpTo = ( e ) => {
	e.preventDefault();
	const target = e.currentTarget.dataset.sscJumperTarget;
	let destinationY = null;
	if ( target !== 'none' ) {
		const link = e.currentTarget.querySelector( 'a' );
		const anchor = '#' + link.href.split( '#' ).pop();
		const destinationTarget = document.querySelector( anchor );
		destinationY =
			destinationTarget.getBoundingClientRect().top + window.scrollY;
	} else {
		destinationY = window.scrollY + window.innerHeight;
	}
	window.scrollTo( {
		top: destinationY,
		behavior: 'smooth',
	} );
};

/**
 * For each jumper, when clicked, jump to the screen.
 *
 * @module jumpToScreen
 *
 * @param {NodeList} jumpers - The array of elements that will be clicked to jump to the screen.
 */
const jumpToScreen = ( jumpers ) => {
	jumpers.forEach( ( jumper ) => {
		jumper.onclick = jumpTo;
	} );
};

export default jumpToScreen;

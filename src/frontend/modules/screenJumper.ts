/**
 * It takes the click event, finds the target element, and scrolls to it
 *
 * @param {Event} e - The event object.
 */
const jumpTo = (e: Event) => {
	e.preventDefault();
	const currentEl = e.currentTarget as HTMLElement;
	const target = currentEl.dataset.sscJumperTarget;
	let destination = {};
	if (target !== 'none') {
		const link: HTMLAnchorElement | null = currentEl.querySelector('a');
		if (link) {
			const anchor = '#' + link.href.split('#').pop();
			const destinationTarget = document.querySelector(anchor);
			if (destinationTarget) {
				destination = {
					top:
						destinationTarget.getBoundingClientRect().top +
						window.scrollY,
					behavior: 'smooth',
				};
			} else {
				console.warn(`The anchor ${anchor} was not found`);
			}
		} else {
			console.warn(`The anchor link ${link} was not found`);
		}
	} else {
		destination = {
			top: window.scrollY + window.innerHeight,
			behavior: 'smooth',
		};
	}
	// finally when the anchor is found, scroll to it
	if (destination) window.scrollTo(destination);
};

/**
 * For each jumper, when clicked, jump to the screen.
 *
 * @module jumpToScreen
 *
 * @param {NodeList} jumpers - The array of elements that will be clicked to jump to the screen.
 */
const jumpToScreen = (jumpers: NodeListOf<HTMLElement>) => {
	jumpers.forEach((jumper) => {
		jumper.onclick = jumpTo;
	});
};

export default jumpToScreen;

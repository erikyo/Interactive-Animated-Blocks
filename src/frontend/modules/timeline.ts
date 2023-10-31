/* The above code is defining an interface called "Coords" in TypeScript. This interface has four
properties: "x" and "y" which are of type number, "el" which is an optional property of type
HTMLElement, and "align" which is of type string. This interface can be used to define objects that
have these properties. */
import { delay } from '../../utils';

interface Coords {
	x: number;
	y: number;
	el?: HTMLElement;
	align: string;
}

/* The above code is defining a constant variable named LINECOLOR with the value
'var(--wp--preset--color--gray)'. This value is likely a CSS variable that represents a gray color. */
export const LINECOLOR = 'var(--wp--preset--color--gray)';
/* The above code is defining a constant variable named LINEWIDTH with a value of 2. The code is
written in TypeScript. */
export const LINEWIDTH = 2;
/* The above code is defining a constant variable named TIMELINETRIGGERZONE with a value of 0.75. This
constant is exported, which means it can be accessed and used in other modules or files. */
export const TIMELINETRIGGERZONE = 0.75;
/* The above code is defining a constant variable named TIMELINESTEPSHIFT and assigning it a value of
0. This constant can be exported and used in other parts of the code. */
export const TIMELINESTEPSHIFT = 0;
/* The above code is defining a constant variable named TIMELINESTEPCURVE and assigning it a value of
0. This code is written in TypeScript, a statically typed superset of JavaScript. */
export const TIMELINESTEPCURVE = 0;
/* The line `export const TIMELINE_ANIMATION_DURATION = 3000;` is defining a constant variable named
`TIMELINE_ANIMATION_DURATION` and assigning it the value `3000`. This constant is used to set the
duration of the timeline animation in milliseconds. It is exported so that it can be accessed and
used in other parts of the code. */
export const TIMELINE_ANIMATION_DURATION = 3000;
/* The line `export const TIMELINE_BREAKPOINT = 1023;` is defining a constant variable named
`TIMELINE_BREAKPOINT` and assigning it the value `1023`. This constant is used as a breakpoint value
in the code to determine the layout of the timeline based on the width of the page. It is exported
so that it can be accessed and used in other parts of the code. */
export const TIMELINE_BREAKPOINT = 1023;
/* The `export const LINECLASS = 'timeline-path';` statement is defining a constant variable named
`LINECLASS` and assigning it the value `'timeline-path'`. This constant is used as a class name for
the SVG path elements that represent the lines in the timeline. It is exported so that it can be
accessed and used in other parts of the code. */
export const LINECLASS = 'timeline-path';
/* The `LINEELEMENTS` constant is an array that contains the CSS selectors for the elements that will
be used as reference points for creating the timeline. In this case, it includes the selectors for
elements with the class "timeline-step", as well as "h1" and "h2" elements. These elements will be
used to determine the position of the timeline steps and create the curved lines between them. */
export const LINEELEMENTS = ['.timeline-step', 'h1', 'h2'];

/* The `TIMELINEDEFAULTS` constant is defining the default options for the timeline. In this case, it
sets the `xPosition` option to `'pageCenter'`, which means that the timeline steps will be
positioned at the center of the page horizontally. */
export const TIMELINEDEFAULTS = {
	xPosition: 'pageCenter',
};

/**
 * The function creates a div element with the id 'svg-container' and appends it to the body of the
 * document, returning the created element.
 *
 * @return The function `InitTimelineContainer` is returning the `svgContainer` element.
 */
const InitTimelineContainer = () => {
	const svgContainer = document.createElement('div');
	svgContainer.id = 'svg-container';
	svgContainer.style.position = 'absolute';
	svgContainer.style.top = '0';
	svgContainer.style.left = '0';
	svgContainer.style.width = '100%';
	svgContainer.style.height = '100%';
	svgContainer.style.pointerEvents = 'none';
	document.body.appendChild(svgContainer);
	return svgContainer;
};

/**
 * The function creates a curved line between two points on an SVG element.
 *
 * @param {Coords} startPoint - The starting point of the curved line. It is an object with two
 *                            properties: x and y, representing the coordinates of the starting point on the SVG canvas.
 * @param {Coords} endPoint   - The `endPoint` parameter is an object that represents the coordinates of
 *                            the end point of the curved line. It has the following properties:
 * @param {number} id         - The `id` parameter is a number that represents the unique identifier for the
 *                            curved line. It is used to assign a unique ID to the path element in the SVG.
 * @param {any}    svg        - The `svg` parameter is an object that represents the SVG element on the page. It
 *                            is used to create and manipulate SVG elements, such as paths, in the DOM.
 */
function createCurvedLine(
	startPoint: Coords,
	endPoint: Coords,
	id: number,
	svg: any
) {
	const pageMiddleX = window.innerWidth / 2;
	const updateLine = () => {
		const controlPoint: Coords = {
			x: startPoint.x,
			y: startPoint.y,
		};

		let path;

		if (TIMELINESTEPCURVE) {
			// Add a default curve if the start and end points have the same x-coordinate
			const curvature =
				startPoint.x > pageMiddleX
					? -TIMELINESTEPCURVE
					: TIMELINESTEPCURVE;
			path = svg.path(
				`M${startPoint.x},${startPoint.y - TIMELINESTEPSHIFT} Q${
					controlPoint.x
				},${controlPoint.y - TIMELINESTEPSHIFT} ${endPoint.x},${
					endPoint.y - TIMELINESTEPSHIFT
				}`
			);
		} else {
			path = svg.path(
				`M${startPoint.x},${startPoint.y - TIMELINESTEPSHIFT} ${
					endPoint.x
				},${endPoint.y - TIMELINESTEPSHIFT}`
			);
		}

		// Set the total length of the path as a data attribute to be used in animations
		const totalLength = path.length();
		path.attr('data-total-length', totalLength);

		// Set stroke-dasharray to the total length of the path
		path.attr('stroke-dasharray', totalLength);

		// Set stroke-dashoffset to the total length of the path to hide the line initially
		path.attr('stroke-dashoffset', totalLength);

		path.attr({
			stroke: LINECOLOR,
			class: `${LINECLASS} ${LINECLASS}-${id}`, // Add the class "timeline-path timeline-path-{ id }" for animation
			id: `timeline-step-${id}`, // Assign a unique ID to the path
			style: `animation-duration: ${totalLength}ms`,
		});

		return path;
	};

	// Call updateLine on initial load
	updateLine();
}

/**
 * The function `animatePath` adds a CSS class to an HTML element to animate the stroke of a path.
 *
 * @param {number} i                        - The parameter `i` is a number that represents the index of the timeline step. It
 *                                          is used to identify the specific element with the id `timeline-step-`.
 * @param          [className=animate-path] - The `className` parameter is a string that specifies the class
 *                                          name to be added to the `linePath` element. By default, it is set to `'animate-path'`.
 * @return the value of the variable `AnimationDuration`, which is the total length of the path.
 */
function animatePath(i: number, className = 'animate-path') {
	const linePath: HTMLElement | null = document.getElementById(
		`timeline-step-${i}`
	);

	if (linePath) {
		const AnimationDuration = Math.round(
			Number(linePath.getAttribute('data-total-length'))
		);

		// Set stroke-dashoffset to the total length of the path to hide the line initially
		if (className === 'animate-path-reverse') {
			linePath.setAttribute(
				'stroke-dashoffset',
				String(AnimationDuration * -1)
			);
		}

		linePath.classList.add(className); // Add the animate-path class for CSS animation

		return AnimationDuration;
	}
}

/**
 * The function `getElementYpos` calculates the vertical position of the center of an HTML element
 * relative to the top of the viewport.
 *
 * @param {HTMLElement} el - The `el` parameter is an `HTMLElement` object, which represents an element
 *                         in the HTML document. It can be any valid HTML element such as a `<div>`, `<p>`, `<span>`, etc.
 * @return the vertical position (Y-coordinate) of the center of the given HTML element (`el`).
 */
function getElementYpos(el: HTMLElement) {
	const currentElBBox = el?.getBoundingClientRect();

	return currentElBBox.top + window.scrollY + currentElBBox.height / 2;
}

/**
 * The `handleScroll` function handles the scrolling behavior of a timeline by updating the timeline
 * SVG image and adding timeline dots based on the current scroll position.
 *
 * @param {number}      [currentStep=0] - The current step in the timeline. It represents the index of the
 *                                      current step in the `timelineSteps` array.
 * @param {Coords[]}    timelineSteps   - An array of objects representing the steps in the timeline. Each
 *                                      object should have the following properties:
 * @param {any}         svg             - The `svg` parameter is the SVG element that will be used to draw the timeline
 *                                      line and dots.
 * @param {HTMLElement} svgContainer    - The `svgContainer` parameter is the HTML element that contains
 *                                      the SVG element. It is used to append the timeline dots to the SVG container.
 * @return a Promise that resolves to a number.
 */
async function handleScroll(
	currentStep: number = 0,
	timelineSteps: Coords[],
	svg: any,
	svgContainer: HTMLElement
): Promise<number> {
	const currentY = window.scrollY;

	if (
		timelineSteps[currentStep].y <
		currentY + window.innerHeight * TIMELINETRIGGERZONE
	) {
		// update the Y position since the current step could be calculated before image preload

		// paint the timeline svg image and add the timeline dots
		createCurvedLine(
			timelineSteps[currentStep],
			timelineSteps[currentStep + 1],
			currentStep,
			svg
		);

		addTimelinePoint(
			timelineSteps[currentStep + 1],
			svgContainer,
			currentStep
		);

		timelineSteps[currentStep].el?.parentElement?.classList.add(
			'timeline-animated'
		);

		const timeToComplete = animatePath(currentStep);

		// wait for the specified duration before moving to the next step
		await delay(timeToComplete ?? TIMELINE_ANIMATION_DURATION);
		return currentStep + 1;
	}

	return currentStep;
}

/**
 * The function `initTimeline` checks if the current element's Y position is in the viewport and fires
 * an animation if it is not.
 *
 * @param {Coords[]}    timelineSteps - An array of objects representing the coordinates of each step in
 *                                    the timeline. Each object should have a `y` property representing the Y position of the step.
 * @param {any}         svg           - The `svg` parameter is an object that represents the SVG element in the DOM. It
 *                                    is used to create and manipulate SVG elements and properties.
 * @param {HTMLElement} svgContainer  - The `svgContainer` parameter is an HTMLElement that represents
 *                                    the container element for the SVG (Scalable Vector Graphics) content. It is the element where the
 *                                    SVG elements will be appended or created.
 * @return the index `i` of the first timeline step that is not in the viewport. If all timeline steps
 * are in the viewport, it will return 0.
 */
function initTimeline(
	timelineSteps: Coords[],
	svg: any,
	svgContainer: HTMLElement
) {
	const currentY = window.scrollY;

	// check if the Y position of the current element is in the viewport otherwise fire the animation
	for (let i = 0; i < timelineSteps.length - 1; i++) {
		if (timelineSteps[i].y <= currentY) {
			// the path
			createCurvedLine(timelineSteps[i], timelineSteps[i + 1], i, svg);

			addTimelinePoint(timelineSteps[i + 1], svgContainer, i);

			animatePath(i, 'animate-path-reverse');
		} else {
			return i;
		}
	}
	return 0;
}

/**
 * The function updates the position of timeline dots and the SVG path for the line connecting the dots
 * based on the given timeline steps and SVG element.
 *
 * @param timelineSteps - An array of objects representing the coordinates of each step in the
 *                      timeline. Each object should have the properties `x` and `y`, representing the x and y coordinates
 *                      respectively.
 * @param svg           - The `svg` parameter is the SVG element that contains the timeline line and dots.
 * @param SVGmodule
 */
function updateLine(timelineSteps, svg, SVGmodule) {
	for (let i = 0; i < timelineSteps.length - 1; i++) {
		const startPoint = timelineSteps[i];
		const endPoint = timelineSteps[i + 1];

		// Get the SVG path element and the timeline dot for the current step
		const pathElement = SVGmodule.SVG(svg);
		const dotElement = document.getElementById(`timeline-dot-${i}`);

		if (pathElement && dotElement) {
			// Update the position of the timeline dot
			dotElement.style.top = `${Math.round(
				startPoint.y + TIMELINESTEPSHIFT
			)}px`;
			dotElement.style.left = `${Math.round(startPoint.x)}px`;

			// Update the SVG path for the line
			const pathData = `M${startPoint.x},${
				startPoint.y - TIMELINESTEPSHIFT
			} ${endPoint.x},${endPoint.y - TIMELINESTEPSHIFT}`;
			pathElement.node?.viewportElement?.children[i].setAttribute(
				'd',
				pathData
			);
		}
	}
}

/**
 * The function creates a pointer element and adds it to an SVG element at a specified position.
 *
 * @param {Coords} timelineStepEl - The `timelineStepEl` parameter is an object that represents the
 *                                coordinates of a timeline step. It has the following properties:
 * @param          svg            - The `svg` parameter is the SVG element to which the pointer element will be added.
 * @param          id             - The `id` parameter is a unique identifier for the timeline point. It is used to create a
 *                                unique ID for the pointer element.
 * @return the pointer element that was created.
 */
function addTimelinePoint(timelineStepEl: Coords, svg, id) {
	// create the pointer element
	const pointerElement = document.createElement('div');
	// add the pointer element base properties
	pointerElement.id = `timeline-dot-${id}`;
	pointerElement.className =
		'timeline-pointer has-align-' + timelineStepEl.align;
	pointerElement.style.top =
		String(Math.round(timelineStepEl.y + TIMELINESTEPSHIFT)) + 'px';
	pointerElement.style.left = String(Math.round(timelineStepEl.x)) + 'px';
	// append the pointer element before the current item
	svg.prepend(pointerElement);
	return pointerElement;
}

/**
 * The function returns the first child element of a timeline item that matches a specific selector, or
 * the timeline item itself if no matching element is found.
 *
 * @param {HTMLElement} timelineItem - An HTMLElement representing a single item in a timeline.
 * @return an HTMLElement.
 */
function getTimelineElement(timelineItem: HTMLElement): HTMLElement {
	return timelineItem.querySelector(LINEELEMENTS.join()) ?? timelineItem;
}

/**
 * The function `collectSteps` collects the x and y coordinates of timeline steps and their
 * corresponding elements based on their alignment and position on the page.
 *
 * @param timelineItems - A NodeList of HTMLElements representing the timeline items.
 * @param args          - The `args` parameter is an object that contains optional arguments for the
 *                      `collectSteps` function. It can have the following properties:
 * @return The function `collectSteps` returns an array of objects, where each object represents a
 * step in the timeline. Each object contains the x and y coordinates of the step, a reference to the
 * step's HTML element, and the alignment of the step.
 */
function collectSteps(timelineItems: NodeListOf<HTMLElement>, args: any) {
	args = { xPosition: 'item', ...args };
	const paginnerWidth = window.innerWidth;
	const pageMiddleX = paginnerWidth / 2;

	const timelineSteps: Coords[] = [];
	for (let i = 0; i < timelineItems.length; i++) {
		const currentStepEl: HTMLElement = getTimelineElement(timelineItems[i]);

		// Get the bounding box of the current step
		const currentElBBox = currentStepEl.getBoundingClientRect();

		// Get the x-coordinate of the current step
		let currentStepX;
		let align = 'left';
		if (paginnerWidth <= TIMELINE_BREAKPOINT) {
			currentStepX = currentElBBox.left - TIMELINESTEPSHIFT;
			align = 'left';
		} else if (args.xPosition === 'pageCenter') {
			currentStepX = pageMiddleX;
			align = 'page-center';
		} else if (currentStepEl.classList.contains('has-text-align-right')) {
			currentStepX = currentElBBox.right + TIMELINESTEPSHIFT;
			align = 'right';
		} else if (currentStepEl.classList.contains('has-text-align-center')) {
			currentStepX = currentElBBox.left + currentElBBox.width / 2;
			align = 'center';
		} else {
			currentStepX = currentElBBox.left - TIMELINESTEPSHIFT;
		}

		// Add the current step's x-coordinate to the timelineSteps array
		timelineSteps[i] = {
			x: currentStepX,
			y: currentElBBox.top + window.scrollY + currentElBBox.height / 2,
			el: currentStepEl,
			align,
		};
	}

	return timelineSteps;
}

/**
 * The `modulrTimelineController` function creates a timeline with curved lines connecting each pair of
 * timeline items and handles scrolling and resizing events to update the timeline accordingly.
 */
export async function modulrTimelineController() {
	const args = TIMELINEDEFAULTS;

	// Create curved lines for each pair of timeline items
	const timelineItems: NodeListOf<HTMLElement> = document.querySelectorAll(
		'.is-style-timeline, .is-style-timeline-photo'
	);

	// if no elements are found return immediately
	if (!timelineItems.length) {
		return;
	}

	// Import dynamically the necessary SVG.js modules
	const SVGmodule = await import('@svgdotjs/svg.js');

	// check the current Y position of the current element
	const svgContainer = InitTimelineContainer();

	// Create the SVG container.
	const svg = SVGmodule.SVG().addTo(svgContainer).size('100%', '100%');

	// Collect the timeline steps
	let timelineSteps: Coords[] = collectSteps(timelineItems, args);

	// Get the current step
	let currentStep: number = initTimeline(timelineSteps, svg, svgContainer);
	let waiting = false;

	// Add the starting pointer
	addTimelinePoint(timelineSteps[0], svgContainer, 0);

	async function timelineScrollHandler() {
		if (!waiting) {
			// delete this event listener if the timelineSteps doesn't exist
			if (!timelineSteps[currentStep + 1]) {
				return window.removeEventListener(
					'scroll',
					timelineScrollHandler
				);
			}

			// update next timeline step
			timelineSteps[currentStep + 1].y = getElementYpos(
				timelineSteps[currentStep + 1]?.el
			);

			// add the next step to the timeline
			setTimeout(() => {
				handleScroll(
					currentStep,
					timelineSteps,
					svg,
					svgContainer
				).then((step) => {
					currentStep = step;
					waiting = false;
				});
			}, 400);
			waiting = true;
		}
	}

	// Attach the scroll event listener
	window.addEventListener('scroll', timelineScrollHandler);

	window.addEventListener('resize', () => {
		// wait a bit to ensure that the window has been resized
		setTimeout(() => {
			// collect the timeline steps
			timelineSteps = collectSteps(timelineItems, args);

			// update the paths and the dot position
			updateLine(timelineSteps, svg, SVGmodule);
		}, 400);
	});
}

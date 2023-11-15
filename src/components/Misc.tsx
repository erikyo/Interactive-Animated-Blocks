import { createElement } from '@wordpress/element';
import { PointerSensor } from '@dnd-kit/core';

export const HandleIcon = createElement(
	'svg',
	{
		width: 20,
		height: 20,
		color: '#666',
	},
	createElement('path', {
		d: 'M7.542 16.667Q6.833 16.667 6.333 16.167Q5.833 15.667 5.833 14.958Q5.833 14.25 6.333 13.75Q6.833 13.25 7.542 13.25Q8.25 13.25 8.75 13.75Q9.25 14.25 9.25 14.958Q9.25 15.667 8.75 16.167Q8.25 16.667 7.542 16.667ZM7.542 11.708Q6.833 11.708 6.333 11.208Q5.833 10.708 5.833 10Q5.833 9.292 6.333 8.792Q6.833 8.292 7.542 8.292Q8.25 8.292 8.75 8.792Q9.25 9.292 9.25 10Q9.25 10.708 8.75 11.208Q8.25 11.708 7.542 11.708ZM7.542 6.75Q6.833 6.75 6.333 6.25Q5.833 5.75 5.833 5.042Q5.833 4.333 6.333 3.833Q6.833 3.333 7.542 3.333Q8.25 3.333 8.75 3.833Q9.25 4.333 9.25 5.042Q9.25 5.75 8.75 6.25Q8.25 6.75 7.542 6.75ZM12.458 6.75Q11.75 6.75 11.25 6.25Q10.75 5.75 10.75 5.042Q10.75 4.333 11.25 3.833Q11.75 3.333 12.458 3.333Q13.167 3.333 13.667 3.833Q14.167 4.333 14.167 5.042Q14.167 5.75 13.667 6.25Q13.167 6.75 12.458 6.75ZM12.458 11.708Q11.75 11.708 11.25 11.208Q10.75 10.708 10.75 10Q10.75 9.292 11.25 8.792Q11.75 8.292 12.458 8.292Q13.167 8.292 13.667 8.792Q14.167 9.292 14.167 10Q14.167 10.708 13.667 11.208Q13.167 11.708 12.458 11.708ZM12.458 16.667Q11.75 16.667 11.25 16.167Q10.75 15.667 10.75 14.958Q10.75 14.25 11.25 13.75Q11.75 13.25 12.458 13.25Q13.167 13.25 13.667 13.75Q14.167 14.25 14.167 14.958Q14.167 15.667 13.667 16.167Q13.167 16.667 12.458 16.667Z',
	})
);

export function isInteractiveElement(
	element: HTMLElement | null | undefined
): boolean {
	const interactiveElements = [
		'button',
		'input',
		'textarea',
		'select',
		'option',
		'span',
		'svg',
	];
	return !!(
		element?.tagName &&
		interactiveElements.includes(element.tagName.toLowerCase())
	);
}

export class sscPointerSensor extends PointerSensor {
	activators = [
		{
			eventName: 'onPointerDown',
			handler: ({
				nativeEvent: event,
			}: {
				nativeEvent: PointerEvent;
			}) => {
				return !(
					event.target !== null &&
					(!event.isPrimary ||
						event.button !== 0 ||
						isInteractiveElement(event.target as HTMLElement))
				);
			},
		},
	];
}

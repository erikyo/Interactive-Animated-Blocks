import {
	Button,
	Icon,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { createElement, useState } from '@wordpress/element';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	useSortable,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { actionsTemplate } from '../utils/data';
import { SSCAnimationScene, SSCAnimationSceneData } from '../types';

interface DndChangedProps {
	id: number;
	changed: string;
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

/**
 * Checks if the given element is an interactive element.
 *
 * @param {Element | null | undefined} element - The element to check.
 * @return {boolean} - True if the element is interactive, false otherwise.
 */
function isInteractiveElement(
	element: HTMLElement | null | undefined
): boolean {
	const interactiveElements = [
		'button',
		'input',
		'textarea',
		'select',
		'option',
		'span',
	];
	return !!(
		element?.tagName &&
		interactiveElements.includes(element.tagName.toLowerCase())
	);
}

const HandleIcon = createElement(
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

/**
 * Renders an ActionRow component.
 *
 * @param {Object}        props              - The props object.
 * @param {string}        props.id           - The ID of the ActionRow.
 * @param {string}        props.action       - The action of the ActionRow.
 * @param {Array}         props.actionList   - The list of action options for the ActionRow.
 * @param {Function}      props.handleChange - The change handler function for the ActionRow.
 * @param {string|number} props.value        - The value of the ActionRow.
 * @param {Function}      props.removeAction - The function to remove the ActionRow.
 *
 * @return {JSX.Element} The rendered ActionRow component.
 */
function ActionRow(props: {
	id: number;
	action: string;
	actionList: SSCAnimationScene[];
	handleChange: (
		arg0: string,
		arg1: { id: any; changed: string; action: any; value: any }
	) => void;
	value: string | undefined;
	removeAction: (arg0: any) => any;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		display: 'flex',
	};

	return (
		<div
			className={'ssc-row ' + props.action}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<Icon icon={HandleIcon} />
			<div className={'col'}>
				<SelectControl
					name={'action'}
					value={props.action}
					options={props.actionList}
					id={props.id + '-action'}
					onChange={(e) =>
						props.handleChange(e, {
							id: props.id,
							changed: 'action',
							action: props.action,
							value: props.value,
						})
					}
				></SelectControl>
				<TextControl
					name={'value'}
					value={props.value || ''}
					id={props.id + '-value'}
					onChange={(e) =>
						props.handleChange(e, {
							id: props.id,
							changed: 'value',
							action: props.action,
							value: props.value,
						})
					}
				/>
			</div>
			<Button
				icon={'remove'}
				onClick={() => props.removeAction(props.id)}
			/>
		</div>
	);
}

/**
 * Renders the ActionList component.
 *
 * @param {Object}   props        - The props object.
 * @param {Array}    props.data   - The data array.
 * @param {string}   props.type   - The type string.
 * @param {Function} props.onSave - The onSave function.
 * @return {JSX.Element} The rendered ActionList component.
 */
export function ActionList(props: {
	data: SSCAnimationSceneData[];
	type: string;
	onSave: (arg0: any[]) => void;
}): JSX.Element {
	const [animationProps, setAnimationProps] = useState(props.data);

	const sensors = useSensors(
		useSensor(sscPointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	/**
	 * Generates an array of SSCAnimationTypeDef objects based on the provided array,
	 * label, and value properties.
	 *
	 * @param {any[]}  array - The input array from which to generate the options.
	 * @param {string} label - The property name in each item of the input array to be used as the label for the option.
	 * @param {string} value - The property name in each item of the input array to be used as the value for the option.
	 * @return {SSCAnimationScene[]} An array of SSCAnimationTypeDef objects, where each object has a label and value property.
	 */
	const provideSelectOptions = (
		array: any[],
		label: string,
		value: string
	): SSCAnimationScene[] => {
		return array.map((item) => {
			return { label: item[label], value: item[value] };
		});
	};

	/**
	 * Handles the drag end event.
	 *
	 * @param {Object} event        - The drag end event object.
	 * @param {Object} event.active - The active drag item.
	 * @param {Object} event.over   - The item being dragged over.
	 * @return {void}
	 */
	function handleDragEnd(event: { active: any; over: any }) {
		const { active, over } = event;

		const newItems = (items: SSCAnimationSceneData[]) => {
			const oldIndex = items.map((o) => o.id).indexOf(active.id);
			const newIndex = items.map((x) => x.id).indexOf(over.id);
			return arrayMove(items, oldIndex, newIndex);
		};

		if (active.id !== over.id) {
			setAnimationProps(newItems);
			props.onSave(animationProps);
		}
	}
	/**
	 * Adds a new action to the animationProps array and calls onSave.
	 */
	const addAction = (): void => {
		const newID: number = animationProps.length
			? Math.max(...animationProps.map((x) => x.id)) + 1
			: 1;
		const newAnimationProps: SSCAnimationSceneData = {
			id: newID,
			key: newID,
			action: actionsTemplate[0].action,
			value: actionsTemplate[0].valueDefault,
		};
		setAnimationProps([...animationProps, newAnimationProps]);
		props.onSave(animationProps);
	};

	/**
	 * Removes an action from the animationProps array based on the given id.
	 *
	 * @param  id - The id of the action to be removed.
	 * @return {void} This function does not return anything.
	 */
	function removeAction(id: number): void {
		const selectedItem = animationProps
			.map((x: { id: number }) => x.id)
			.indexOf(id);

		const newAnimationProps = [
			...animationProps.slice(0, selectedItem),
			...animationProps.slice(selectedItem + 1),
		];
		setAnimationProps([...newAnimationProps]);
		props.onSave(newAnimationProps);
	}

	/**
	 * Handles the change event for the animation properties.
	 *
	 * @param {string}          ev   - The event string.
	 * @param {DndChangedProps} data - The changed props from Dnd.
	 */
	function handleChange(ev: string, data: DndChangedProps) {
		const newAnimationProps = animationProps;
		const selectedItem = animationProps
			.map((x: { id: number }) => x.id)
			.indexOf(data.id);
		if (data.changed === 'action') {
			newAnimationProps[selectedItem].action = ev;
			newAnimationProps[selectedItem].value =
				actionsTemplate.find((item) => item.action === ev)
					?.valueDefault || '';
		} else if (data.changed === 'value') {
			newAnimationProps[selectedItem].value = ev;
		}
		setAnimationProps([...newAnimationProps]);
		props.onSave(newAnimationProps);
	}

	return (
		<>
			<h5>Action Sequence</h5>
			<section
				className={'action-sequence'}
				style={{ margin: '24px 0', position: 'relative' }}
			>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={animationProps}
						strategy={verticalListSortingStrategy}
					>
						{animationProps.map((action) => (
							<ActionRow
								key={action.key}
								id={action.id}
								action={action.action}
								value={action.value || action.defaultValue}
								actionList={provideSelectOptions(
									actionsTemplate,
									'actionLabel',
									'action'
								)}
								removeAction={removeAction}
								handleChange={handleChange}
							/>
						))}
					</SortableContext>
				</DndContext>
				<Button
					onClick={addAction}
					icon={'insert'}
					variant={'secondary'}
					className={'add-new'}
				>
					Add action
				</Button>
			</section>
		</>
	);
}

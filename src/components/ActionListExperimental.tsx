/* eslint-disable no-console */
import {
	Button,
	Icon,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { createElement, useEffect, useState } from '@wordpress/element';
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
import { seqActionObjTemplate } from '../utils/data';
import type { Label } from '../types.d.ts';
import type {
	ActionRowProps,
	AnimBaseObj,
	SSCAction,
	SSCStep,
} from './actionList.d.ts';
import React from 'react';

//TODO
// AVOID USING STATE, NESTED STATE IS BAD!!!

interface propsType {
	type: string;
	data: SSCStep[];
	onSave: (data: SSCStep[]) => void;
}
interface SelectControlProps {
	label: string;
	value: string;
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
		'svg',
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

function Step(props: {
	id: number;
	actionOptions: SelectControlProps[];
	currentStep: SSCStep;
	parentProps: propsType;
	setParentState: React.Dispatch<React.SetStateAction<SSCStep[]>>;
	removeStep: (arg0: any) => any;
}): JSX.Element {
	const [animationActions, setAnimationActions] = useState(
		props.currentStep.actions
	);

	// const sensors = useSensors(
	// 	useSensor(sscPointerSensor, {
	// 		activationConstraint: { delay: 250, tolerance: 1 },
	// 	}),
	// 	useSensor(KeyboardSensor, {
	// 		coordinateGetter: sortableKeyboardCoordinates,
	// 	})
	// );
	function sortByIndex<T extends { id: number }>(
		arg: Array<T>,
		active: any,
		over: any
	) {
		const oldIndex = arg.map((o) => o.id).indexOf(active.id);
		const newIndex = arg.map((x) => x.id).indexOf(over.id);
		return arrayMove(arg, oldIndex, newIndex) as typeof arg;
	}

	const handleDragEnd = (event: { active: any; over: any }) => {
		const { active, over } = event;
		const sortedItems = sortByIndex(animationActions!, active, over);
		if (active.id !== over.id) {
			setAnimationActions(() => ({
				...animationActions!,
				action: sortedItems,
			}));
			props.setParentState(() => ({
				...props.currentStep,
				actions: sortedItems,
			}));
			props.onSave(() => ({
				...props.currentStep,
				actions: sortedItems,
			}));
		}
	};
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.currentStep.actions });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		display: 'flex',
	};

	const addAction = (): void => {
		const newID: number = animationActions!.length
			? Math.max(...animationActions!.map((x) => x.id)) + 1
			: 1;
		const newAction: SSCAction = {
			id: newID,
			key: newID + props.currentStep.key + props.currentStep.id,
			action: seqActionObjTemplate.opacity,
		} as unknown as SSCAction;

		setAnimationActions([...animationActions!, newAction]);

		const thisStep: SSCStep = {
			...props.currentStep,
			actions: animationActions,
		};
		console.log(props.currentStep.id);
		props.setParentState((prevState: SSCStep[]): SSCStep[] => {
			const updatedState: SSCStep[] = [
				...prevState, // Create a copy of the previous state
			];

			// Update the property using the currentStep.id
			updatedState[props.currentStep.id - 1].actions = animationActions;

			return updatedState;
		});
		console.log('fuuuuuuuuuck');
		console.log(props.parentProps);
	};
	function getKeyValue(anim: AnimBaseObj): string {
		return Object.keys(anim)[0];
	}

	// function handleActionChange(changed: string, data: SSCAction) {
	// 	const newAnimationSteps = animationActions.action;
	// 	const selectedItem = data;
	// 	if (changed === 'action') {
	// 		newAnimationSteps[selectedItem].action = e;
	// 		newAnimationSteps[selectedItem].value =
	// 			actionsTemplate.find((item) => item.action === e)
	// 				?.valueDefault || '';
	// 	} else if (changed === 'value') {
	// 		newAnimationSteps[selectedItem].value = e;
	// 	}
	// 	setAnimationSteps([...newAnimationSteps]);
	// 	props.onSave(newanimationSteps);
	// }

	function removeAction(id: number): void {
		const selectedItemIndex = animationActions!.findIndex(
			(step: { id: number }) => step.id === id
		);
		if (selectedItemIndex !== -1) {
			animationActions!.splice(selectedItemIndex, 1);
			setAnimationActions(animationActions);
			props.setParentState(() => ({
				...props.currentStep,
				actions: animationActions,
			}));
			props.onSave(() => ({
				...props.currentStep,
				actions: animationActions,
			}));
		}
	}

	function createHandleChange(actual: SSCAction, changed: string) {
		if (
			actual.action &&
			!!changed &&
			typeof actual.action.handleActionChange === 'function'
		) {
			//handleActionChange(changed, actual);
		} else {
			throw new Error('actual action is null');
		}
	}
	return (
		<SortableContext
			key={'ctx1' + props.currentStep.key + props.currentStep.id}
			items={props.currentStep.actions!.map((animation) => animation.id)}
			strategy={verticalListSortingStrategy}
		>
			{props.currentStep.actions &&
				props.currentStep.actions.map((act: SSCAction) => {
					return (
						<div
							className={'col'}
							key={act.id + act.key + '-action-col'}
							style={{ borderBlockColor: 'black' }}
						>
							<div
								id={act.id.toString()}
								key={act.id + act.key + '-action-row'}
								className={'ssc-row ' + act.action}
								style={style}
								{...attributes}
								{...listeners}
								ref={setNodeRef}
							>
								<Icon icon={HandleIcon} />
								<SelectControl
									name={'action'}
									//value={Object.keys(act.action)[0]}
									key={act.id + act.key + 'slctfasdfa'}
									options={props.actionOptions}
									id={act.id.toString()}
									onChange={(e) =>
										createHandleChange(act, 'action')
									}
								></SelectControl>
								<TextControl
									name={'value'}
									value={act[getKeyValue(act)].value || ''}
									key={act.id + act.key + '-value'}
									onChange={() =>
										createHandleChange(act, 'value')
									}
								/>
								<TextControl
									name={'duration'}
									value={act[getKeyValue(act)].duration || 0}
									key={act.id + act.key + '-duration'}
									onChange={() =>
										createHandleChange(act, 'duration')
									}
								/>
								<TextControl
									name={'easing'}
									value={act[getKeyValue(act)].duration || 0}
									key={act.id + act.key + '-easing'}
									onChange={() =>
										createHandleChange(act, 'duration')
									}
								/>
							</div>
						</div>
					);
				})}
			<Button
				key={props.currentStep.id + props.currentStep.key + 'remove'}
				icon={'remove'}
				onClick={() => removeAction(props.currentStep.id)}
			/>
			<Button
				key={props.currentStep.id + props.currentStep.key + 'add'}
				onClick={addAction}
				icon={'insert'}
				className={'add-action'}
			>
				Add Action
			</Button>
		</SortableContext>
	);
}

export function ActionListExperimental(props: propsType): JSX.Element {
	const [animationSteps, setAnimationSteps] = useState(props.data);
	console.log('this');
	console.log(props);
	//const [animationSteps,setAnimationSteps] = useReducer(reducer, { a: 1, b: 2})

	const sensors = useSensors(
		useSensor(sscPointerSensor, {
			activationConstraint: { delay: 250, tolerance: 1 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function handleDragEnd(event: { active: any; over: any }) {
		const { active, over } = event;

		const newItems = (items: SSCStep[]) => {
			const oldIndex = items.map((o) => o.id).indexOf(active.id);
			const newIndex = items.map((x) => x.id).indexOf(over.id);
			return arrayMove(items, oldIndex, newIndex);
		};

		if (active.id !== over.id) {
			setAnimationSteps(newItems);
			props.onSave(animationSteps);
		}
	}
	const provideSelectOptions = (
		stepActions: AnimBaseObj
	): SelectControlProps[] => {
		return Object.keys(stepActions).map((stepAction) => {
			const baseObj = stepActions[stepAction];
			return {
				label: stepAction,
				value: baseObj.value.toString(),
			};
		});
	};

	const addStep = (): void => {
		const newID: number = animationSteps.length
			? Math.max(...animationSteps.map((x) => x.id)) + 1
			: 1;

		const newAction: SSCAction = {
			id: 0,
			key: 0 + 'action-asfsaf' + newID,
			opacity: {
				value: 1,
				duration: 1000,
				easing: 'linear',
			},
		} as unknown as SSCAction;

		const newAnimationSteps: SSCStep = {
			id: newID,
			key: newID + 'stepsds',
			actions: [newAction],
		};
		setAnimationSteps([...animationSteps, newAnimationSteps]);
		props.onSave(animationSteps);
		console.log(animationSteps);
	};

	// const addAction = (): void => {
	// 	const newID: number = animationSteps.length
	// 		? Math.max(.. animationSteps.map((x) => x.id)) + 1
	// 		: 1;
	// 	const newAnimationProps: SSCStep = {
	// 		id: newID,
	// 		key: newID,
	// 		action: seqActionStepTemplate[1].action,
	// 		value: seqActionStepTemplate[1].valueDefault,
	// 		duration: 1000,
	// 	};
	// 	setAnimationSteps([.. animationSteps, newAnimationProps]);
	// 	props.onSave animationSteps);
	// };

	function removeStep(id: number): void {
		const selectedItemIndex = animationSteps.findIndex(
			(step: { id: number }) => step.id === id
		);
		if (selectedItemIndex !== -1) {
			animationSteps.splice(selectedItemIndex, 1);
			setAnimationSteps([...animationSteps]); // Trigger state update by creating a new reference
			props.onSave(animationSteps);
		}
	}

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.data. });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		display: 'flex',
	};
	// function removeAction(id: number): void {
	// 	const selectedItem = animationSteps
	// 		.map((x: { id: number }) => x.id)
	// 		.indexOf(id);

	// 	const newAnimationProps = [
	// 		.. animationSteps.slice(0, selectedItem),
	// 		.. animationSteps.slice(selectedItem + 1),
	// 	];
	// 	setAnimationSteps([...newAnimationProps]);
	// 	props.onSave(newAnimationProps);
	// }

	useEffect(() => {
		props.onSave(animationSteps);
	}, [animationSteps]);

	return (
		<section
			className={'step-sequence'}
			style={{ margin: '24px 0', position: 'relative' }}
		>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={animationSteps.map((step) => step.id)}
					strategy={verticalListSortingStrategy}
				>
					<div>
						{animationSteps.length &&
							animationSteps.map((step) => (
								<div
									key={'STEEPEPE' + step.id + step.key}
									style={style}
									{...attributes}
									{...listeners}
									ref={setNodeRef}
								>
									<Icon icon={HandleIcon} />
									<Step
										id={step.id}
										key={step.key + 'step-step'}
										currentStep={step}
										parentProps={props}
										actionOptions={provideSelectOptions(
											// TODO Here you add global delay / endDelay etc....
											seqActionObjTemplate
										)}
										setParentState={setAnimationSteps}
										removeStep={() => removeStep(step.id)}
									></Step>
								</div>
							))}
					</div>
				</SortableContext>
			</DndContext>
			<Button
				key={'add-step'}
				onClick={addStep}
				icon={'insert'}
				variant={'primary'}
				className={'add-step'}
			>
				Add Step
			</Button>
		</section>
	);
}

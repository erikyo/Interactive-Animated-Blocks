import {
	AnimBaseObj,
	SSCAction,
	SSCStep,
	propsType,
	ISSCAnimation,
} from './actionList';
import React, { useContext } from 'react';
import { useState } from '@wordpress/element';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { seqActionObjTemplate } from '../utils/data';
import {
	Button,
	Icon,
	SelectControl,
	TextControl,
} from '@wordpress/components';

import { SelectControlProps } from '@wordpress/components/build-types/select-control/types';
import { ActionSortable } from './ActionSortable';
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { HandleIcon, sscPointerSensor } from './Misc';
import { sortByIndex } from './utils';
import { SSCAnimationContext } from './ActionListExperimental';
export function StepSortable(): JSX.Element {
	//const [steps, setSteps] = useState(props.parentProps.data);

	const sensors = useSensors(
		useSensor(sscPointerSensor, {
			activationConstraint: { delay: 250, tolerance: 1 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const { sscSteps }: ISSCAnimation = useContext(SSCAnimationContext);

	// function handleDragEnd(event: { active: any; over: any }) {
	// 	const { active, over } = event;
	//
	// 	const newItems = (items: SSCStep[]) => {
	// 		const oldIndex = items.map((o) => o.id).indexOf(active.id);
	// 		const newIndex = items.map((x) => x.id).indexOf(over.id);
	// 		return arrayMove(items, oldIndex, newIndex);
	// 	};
	//
	// 	if (active.id !== over.id) {
	// 		setSteps(newItems);
	// 		props.parentProps.onSave(steps);
	// 	}
	// }
	//
	// function removeStep(id: number): void {
	// 	const selectedItemIndex = steps.findIndex(
	// 		(step: { id: number }) => step.id === id
	// 	);
	// 	if (selectedItemIndex !== -1) {
	// 		steps.splice(selectedItemIndex, 1);
	// 		setSteps([...steps]); // Trigger state update by creating a new reference
	// 		props.parentProps.onSave(steps);
	// 	}
	// }
	//
	// const handleDragEnd = (event: { active: any; over: any }) => {
	// 	const { active, over } = event;
	// 	const sortedItems = sortByIndex(steps!, active, over);
	// 	if (active.id !== over.id) {
	// 		setSteps(() => ({
	// 			...steps!,
	// 			action: sortedItems,
	// 		}));
	// 		props.setParentState(() => ({
	// 			...props.currentStep,
	// 			actions: sortedItems,
	// 		}));
	// 		props.onSave(() => ({
	// 			...props.currentStep,
	// 			actions: sortedItems,
	// 		}));
	// 	}
	// };
	//
	// const addAction = (): void => {
	// 	const newID: number = animationActions!.length
	// 		? Math.max(...animationActions!.map((x) => x.id)) + 1
	// 		: 1;
	// 	const newAction: SSCAction = {
	// 		id: newID,
	// 		key: newID + props.currentStep.key + props.currentStep.id,
	// 		action: seqActionObjTemplate.opacity,
	// 	} as unknown as SSCAction;
	//
	// 	setAnimationActions([...animationActions!, newAction]);
	//
	// 	const thisStep: SSCStep = {
	// 		...props.currentStep,
	// 		actions: animationActions,
	// 	};
	// 	console.log(props.currentStep.id);
	// 	props.setParentState((prevState: SSCStep[]): SSCStep[] => {
	// 		const updatedState: SSCStep[] = [
	// 			...prevState, // Create a copy of the previous state
	// 		];
	//
	// 		// Update the property using the currentStep.id
	// 		updatedState[props.currentStep.id - 1].actions = animationActions;
	//
	// 		return updatedState;
	// 	});
	// 	console.log('fuuuuuuuuuck');
	// 	console.log(props.parentProps);
	// };
	//
	// // function handleActionChange(changed: string, data: SSCAction) {
	// // 	const newAnimationSteps = animationActions.action;
	// // 	const selectedItem = data;
	// // 	if (changed === 'action') {
	// // 		newAnimationSteps[selectedItem].action = e;
	// // 		newAnimationSteps[selectedItem].value =
	// // 			actionsTemplate.find((item) => item.action === e)
	// // 				?.valueDefault || '';
	// // 	} else if (changed === 'value') {
	// // 		newAnimationSteps[selectedItem].value = e;
	// // 	}
	// // 	setAnimationSteps([...newAnimationSteps]);
	// // 	props.onSave(newanimationSteps);
	// // }
	//
	// function removeAction(id: number): void {
	// 	const selectedItemIndex = steps!.findIndex(
	// 		(step: { id: number }) => step.id === id
	// 	);
	// 	if (selectedItemIndex !== -1) {
	// 		steps!.splice(selectedItemIndex, 1);
	// 		setSteps(steps);
	// 		props.setParentState(() => ({
	// 			...props.parentProps.data,
	// 			actions: steps,
	// 		}));
	// 		props.parentProps.onSave(() => ({
	// 			...props.currentStep,
	// 			actions: steps,
	// 		}));
	// 	}
	// }
	//
	// const addStep = (): void => {
	//   const newID: number = animationSteps.length
	//     ? Math.max(...animationSteps.map((x) => x.id)) + 1
	//     : 1;
	//
	//   const newAction: SSCAction = {
	//     id: 0,
	//     key: 0 + 'action-asfsaf' + newID,
	//     opacity: {
	//       value: 1,
	//       duration: 1000,
	//       easing: 'linear',
	//     },
	//   } as unknown as SSCAction;
	//
	//   const newAnimationSteps: SSCStep = {
	//     id: newID,
	//     key: newID + 'stepsds',
	//     actions: [newAction],
	//   };
	//   setAnimationSteps([...animationSteps, newAnimationSteps]);
	//   props.onSave(animationSteps);
	//   console.log(animationSteps);
	// };

	function handleDragEnd() {}

	return (
		<div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={sscSteps.map((step: SSCStep) => step.id)}
					strategy={verticalListSortingStrategy}
				>
					<div>
						{sscSteps.length &&
							sscSteps.map((step: SSCStep) => (
								<Step key={} currentStep={step}></Step>
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
		</div>
	);
}
// check this link pls https://stackoverflow.com/questions/71830625/avoid-parent-component-re-rendering-when-child-component-updates-parent-state
function Step(currentStep: SSCStep): JSX.Element {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: currentStep.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			key={'STEEPEPE' + currentStep.id + currentStep.key}
			style={style}
			{...attributes}
			{...listeners}
			ref={setNodeRef}
		>
			<Icon icon={HandleIcon} />

			<ActionSortable
				parentStep={currentStep}
				actions={currentStep.actions!}
			></ActionSortable>
		</div>
	);
}

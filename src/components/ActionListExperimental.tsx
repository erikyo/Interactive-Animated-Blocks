/* eslint-disable no-console */
import {
	Button,
	Icon,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import {
	createContext,
	createElement,
	useEffect,
	useState,
} from '@wordpress/element';
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

import type { Label } from '../types.d.ts';
import type {
	ActionRowProps,
	AnimBaseObj,
	SSCAction,
	SSCStep,
	propsType,
	ISSCAnimation,
} from './actionList.d.ts';
import React from '@wordpress/block-editor'
import { StepSortable } from './StepSortable';
import { useSSCAnimation } from './useSSCAnimation';
//TODO
// AVOID USING STATE, NESTED STATE IS BAD!!!

interface SelectControlProps {
	label: string;
	value: string;
}

// @ts-ignore
export const SSCAnimationContext = createContext<ISSCAnimation>(null);

export function ActionListExperimental(props: propsType): JSX.Element {
	console.log('this');
	console.log(props);

	const sscAnimation: ISSCAnimation = useSSCAnimation(props);

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

	return (
		<section
			className={'step-sequence'}
			style={{ margin: '24px 0', position: 'relative' }}
		>
			<SSCAnimationContext.Provider value={sscAnimation}>
				<StepSortable></StepSortable>
			</SSCAnimationContext.Provider>
		</section>
	);
}

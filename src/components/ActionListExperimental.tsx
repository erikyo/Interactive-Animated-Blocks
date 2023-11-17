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
	useMemo,
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
import React from '@wordpress/block-editor';
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
	console.log(props);
	//TODO: Fix key
	const sscAnimation: ISSCAnimation = useSSCAnimation(props);

	const contextValue = useMemo(
		() => ({
			sscAnimation,
		}),
		[sscAnimation]
	);

	return (
		<section
			className={'step-sequence'}
			style={{ margin: '24px 0', position: 'relative' }}
		>
			<SSCAnimationContext.Provider value={contextValue.sscAnimation}>
				<StepSortable></StepSortable>
			</SSCAnimationContext.Provider>
		</section>
	);
}

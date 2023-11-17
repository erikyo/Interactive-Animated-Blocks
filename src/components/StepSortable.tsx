import type {
	AnimBaseObj,
	SSCAction,
	SSCStep,
	propsType,
	ISSCAnimation,
} from './actionList';
import { useCallback, useContext, useState } from '@wordpress/element';
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

	const { sscSteps, addSSCStep }: ISSCAnimation =
		useContext(SSCAnimationContext);

	function handleDragEnd() {}

	const addStep = useCallback(() => {
		addSSCStep();
	}, []);

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
								<Step
									key={'step-' + step.id}
									currentStep={step}
								></Step>
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
function Step(props: { currentStep: SSCStep }): JSX.Element {
	const { currentStep } = props;
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

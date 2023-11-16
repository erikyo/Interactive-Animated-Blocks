import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { AnimBaseObj, SSCAction, SSCStep } from './actionList.d.ts';
import {
	Button,
	Icon,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import React, { useContext, useEffect, useState } from '@wordpress/element';
import { HandleIcon, sscPointerSensor } from './Misc';
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
	getAnimBaseObj,
	getKeyValue,
	provideSelectOptions,
	setAnimBaseObj,
} from './utils';
import { SSCAnimationContext } from './ActionListExperimental';
import { seqActionObjTemplate } from '../utils/data';
import { key } from '@wordpress/icons';

export function ActionSortable(props: {
	parentStep: SSCStep;
	actions: SSCAction[];
}): JSX.Element {
	const { actions, parentStep } = props;
	const { addSSCAction } = useContext(SSCAnimationContext);

	const sensors = useSensors(
		useSensor(sscPointerSensor, {
			activationConstraint: { delay: 250, tolerance: 1 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function handleDragEnd() {}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				key={'ctx1' + parentStep.key + parentStep.id}
				items={actions.map((animation: SSCAction) => animation.id)}
				strategy={verticalListSortingStrategy}
			>
				{actions &&
					actions.map((action: SSCAction) => {
						return (
							<Action
								key={action.id + action.key + 'action'}
								currentAction={action}
								currentStep={parentStep}
							/>
						);
					})}
				<Button
					key={parentStep.id + parentStep.key + 'remove'}
					icon={'remove'}
					//onClick={() => parentStep(parentStep.id)}
				/>
				<Button
					key={parentStep.id + parentStep.key + 'add'}
					onClick={() => addSSCAction(parentStep.id)}
					icon={'insert'}
					className={'add-action'}
				>
					Add Action
				</Button>
			</SortableContext>
		</DndContext>
	);
}

enum ActionTypes {
	Action = 'action',
	Value = 'value',
	Duration = 'duration',
	Easing = 'easing',
	Delay = 'delay',
	EndDelay = 'endDelay',
}

function Action(props: { currentAction: SSCAction; currentStep: SSCStep }) {
	const { currentAction, currentStep } = props;
	const [animObj, setAnimObj] = useState<AnimBaseObj>(
		getAnimBaseObj(currentAction)
	);
	const { updateSSCAnimeBaseObject } = useContext(SSCAnimationContext);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.currentAction.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const options = provideSelectOptions();
	const animKey = { key: 'opacity' };

	useEffect(() => {
		animKey.key = getKeyValue(animObj);
		// @ts-ignore
		updateSSCAnimeBaseObject(currentAction, currentStep, animObj);
	}, [animObj]);

	return (
		<div
			className={'col'}
			key={currentAction.id + currentAction.key + '-action-col'}
			style={style}
			{...attributes}
			{...listeners}
			ref={setNodeRef}
		>
			<div
				id={currentAction.id.toString()}
				key={currentAction.id + currentAction.key + '-action-row'}
				className={'ssc-row ' + currentAction.action}
			>
				<Icon icon={HandleIcon} />

				<SelectControl
					name={ActionTypes.Action}
					//value={Object.keys(act.action)[0]}
					key={currentAction.id + currentAction.key + 'slctfasdfa'}
					options={options}
					id={currentAction.id.toString()}
					onChange={(e) => {
						setAnimObj(
							seqActionObjTemplate!.find((obj) => obj![e])!
						);
					}}
				></SelectControl>
				<TextControl
					name={ActionTypes.Value}
					value={
						currentAction[getKeyValue(currentAction)].value || ''
					}
					key={currentAction.id + currentAction.key + '-value'}
					onChange={(e) => {
						setAnimObj((prevState) => {
							let newObj = prevState[animKey.key];
							newObj = {
								...newObj,
								[ActionTypes.Value]: e,
							};
							return {
								...prevState,
								newObj,
							};
						});
					}}
				/>
				<TextControl
					name={ActionTypes.Duration}
					value={
						currentAction[getKeyValue(currentAction)].duration || 0
					}
					key={currentAction.id + currentAction.key + '-duration'}
					onChange={(e) => {
						setAnimObj((prevState) => {
							let newObj = prevState[animKey.key];
							newObj = {
								...newObj,
								[ActionTypes.Duration]: e,
							};
							return {
								...prevState,
								newObj,
							};
						});
					}}
				/>
				<TextControl
					name={ActionTypes.Easing}
					value={
						currentAction[getKeyValue(currentAction)][
							ActionTypes.Easing
						] || 0
					}
					key={currentAction.id + currentAction.key + '-easing'}
					onChange={(e) => {
						setAnimObj((prevState) => {
							let newObj = prevState[animKey.key];
							newObj = {
								...newObj,
								[ActionTypes.Easing]: e,
							};
							return {
								...prevState,
								newObj,
							};
						});
					}}
				/>
			</div>
		</div>
	);
}

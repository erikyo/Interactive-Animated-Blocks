import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { propsType, SSCAction, SSCStep, AnimBaseObj } from './actionList.d.ts';
import {
	Button,
	Icon,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import React, { useContext, useReducer } from '@wordpress/element';
import { HandleIcon, sscPointerSensor } from './Misc';
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { getKeyValue, provideSelectOptions } from './utils';
import { SSCAnimationContext } from './ActionListExperimental';
import { seqActionObjTemplate } from '../utils/data';
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
					onClick={addSSCAction}
					icon={'insert'}
					className={'add-action'}
				>
					Add Action
				</Button>
			</SortableContext>
		</DndContext>
	);
}

function actionReducer(state, action) {
  switch (action.type) {
    case 'action':
      return
    case 'value':

  }
  throw Error('Unknown action.');
}

function Action(props: { currentAction: SSCAction }) {
	const { currentAction } = props;
  const [state, dispatch] = useReducer<SSCAction>(actionReducer, currentAction);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.currentAction.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const options = provideSelectOptions();

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
					name={'action'}
					//value={Object.keys(act.action)[0]}
					key={currentAction.id + currentAction.key + 'slctfasdfa'}
					options={options}
					id={currentAction.id.toString()}
					onChange={(e) =>
            dispatch({ type: 'action' }))
					}
				></SelectControl>
				<TextControl
					name={'value'}
					value={
						currentAction[getKeyValue(currentAction)].value || ''
					}
					key={currentAction.id + currentAction.key + '-value'}
					onChange={() =>
            dispatch({ type: 'value' })
					}
				/>
				<TextControl
					name={'duration'}
					value={
						currentAction[getKeyValue(currentAction)].duration || 0
					}
					key={currentAction.id + currentAction.key + '-duration'}
					onChange={() =>
						props.createHandleChange(currentAction, 'duration')
					}
				/>
				<TextControl
					name={'easing'}
					value={
						currentAction[getKeyValue(currentAction)].duration || 0
					}
					key={currentAction.id + currentAction.key + '-easing'}
					onChange={() =>
						props.createHandleChange(currentAction, 'duration')
					}
				/>
			</div>
		</div>
	);
}

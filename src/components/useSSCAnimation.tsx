import { useCallback, useEffect, useState } from '@wordpress/element';
import type {
	propsType,
	SSCAction,
	SSCStep,
	ISSCAnimation,
	AnimBaseObj,
} from './actionList';
import { seqActionObjTemplate } from '../utils/data';
import { set } from 'animejs';
import { setAnimBaseObj } from './utils';
function createSSCStep(sscSteps: SSCStep[]): SSCStep {
	const newID: number = sscSteps.length + 1;
	const newKey: string = 'step-' + newID;
	const newSSCAction = Object.assign(
		{},
		createSSCAction(newID, newKey) as SSCAction
	);
	return {
		id: newID,
		key: newKey,
		actions: [newSSCAction],
	} as SSCStep;
}

function createSSCAction(actionId?: number, stepKey?: string): SSCAction {
	const nID: number = actionId ?? 1;
	const nKey: string = stepKey + '-action-' + nID;
	return {
		id: nID + 1,
		key: nKey,
		...setAnimBaseObj(seqActionObjTemplate[0], 'opacity'),

	} as SSCAction;
}
export const useSSCAnimation = (props: propsType): ISSCAnimation => {
	const [sscSteps, setSSCSteps] = useState<SSCStep[]>(props.data);

	const addSSCStep = () => {
		const newStep = { ...createSSCStep(sscSteps) } as SSCStep;
		setSSCSteps((prevState) => {
			const newState = [...prevState]; // Create a copy of the prevState array
			newState.push(newStep);
			return newState;
		});
		props.onSave(sscSteps);
	};

	const removeSSCStep = (sscStepId: number) => {
		setSSCSteps((prevState) => {
			return prevState.filter((sscStep) => sscStep.id !== sscStepId);
		});
		props.onSave(sscSteps);
	};

	const updateSSCStep = (sscStep: SSCStep) => {
		setSSCSteps((prevState: SSCStep[]) => {
			const newSSCSteps = [...prevState]; // Create a new copy of the prevState array
			const indexToUpdate = prevState.findIndex(
				(step) => step.id === sscStep.id
			); // Find the index of the object to update
			newSSCSteps[indexToUpdate] = { ...sscStep }; // Replace the object at the found index with a new copy
			return newSSCSteps;
		});
		props.onSave(sscSteps);
	};

	const sortSSCSteps = () => {
		setSSCSteps(
			sscSteps.sort((step1, step2) => {
				if (step1.id !== step2.id) {
					return step1.id - step2.id;
				}
				return step1.key.localeCompare(step2.key);
			})
		);
		props.onSave(sscSteps);
	};

	const addSSCAction = (sscStep: SSCStep) => {
		const newSscAction = createSSCAction(
			sscStep.actions?.length,
			sscStep.key
		);

		const updatedSSCStep = Object.assign({}, sscStep);
		const l = updatedSSCStep.actions!.push(newSscAction);
		console.log(updatedSSCStep, l);
		updateSSCStep(updatedSSCStep);
	};

	const removeSSCAction = (sscStep: SSCStep, sscActionId: number) => {
		const updatedSSCStep = {
			...sscStep,
			actions: sscStep.actions!.filter(
				(action) => action.id !== sscActionId
			),
		} as SSCStep;

		updateSSCStep(updatedSSCStep);
	};

	const updateSSCAction = (sscStep: SSCStep, sscAction: SSCAction) => {
		const updatedSSCStep: SSCStep = {
			...sscStep,
			actions: sscStep.actions!.map((action) => {
				if (action.id === sscAction.id) {
					return sscAction;
				}
				return action;
			}),
		};
		updateSSCStep(updatedSSCStep);
	};

	const sortSSCActions = (sscStepId: number) => {
		const updatedSSCSteps = sscSteps.map((sscStep) => {
			if (sscStep.id === sscStepId) {
				return {
					...sscStep,
					actions: sscStep.actions!.sort(
						(action1, action2) => action1.id - action2.id
					),
				};
			}
			return sscStep;
		});
		setSSCSteps(updatedSSCSteps);
		props.onSave(sscSteps);
	};

	const updateSSCAnimeBaseObject = (
		sscStepId: number,
		sscAction: SSCAction,
		sscAnimeObj: AnimBaseObj
	) => {
		updateSSCStep({
			...sscSteps[sscStepId],
			...sscAction,
			...sscAnimeObj,
		});
	};

	return {
		sscSteps,
		addSSCStep,
		removeSSCStep,
		updateSSCStep,
		sortSSCSteps,
		addSSCAction,
		removeSSCAction,
		updateSSCAction,
		sortSSCActions,
		updateSSCAnimeBaseObject,
	};
};

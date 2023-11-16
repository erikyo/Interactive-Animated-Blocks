import { useState } from '@wordpress/element';
import type {
	propsType,
	SSCAction,
	SSCStep,
	ISSCAnimation,
	AnimBaseObj,
} from './actionList';
import { seqActionObjTemplate } from '../utils/data';
import { set } from 'animejs';

export const useSSCAnimation = (props: propsType): ISSCAnimation => {
	const [sscSteps, setSSCSteps] = useState<SSCStep[]>(props.data);

	const addSSCStep = (sscStep: SSCStep) => {
		setSSCSteps([...sscSteps, sscStep]);
	};

	const removeSSCStep = (sscStepId: number) => {
		setSSCSteps(sscSteps.filter((sscStep) => sscStep.id !== sscStepId));
	};

	const updateSSCStep = (sscStep: SSCStep) => {
		setSSCSteps(
			sscSteps.map((existingStep) => {
				if (existingStep.id === sscStep.id) {
					return sscStep;
				}
				return existingStep;
			})
		);
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
	};

	const addSSCAction = (sscStep: SSCStep) => {
		const sscStep = sscSteps[sscStepId];
		const updatedSSCSteps = () => {
			const newID: number = sscStep.actions!.length + 1;
			const newKey: string =
				sscStep.key + '-' + sscStepId + '-action-' + newID;
			const newSscAction: SSCAction = {
				id: newID,
				key: newKey,
				opacity: seqActionObjTemplate.opacity,
			} as unknown as SSCAction;

			return {
				...sscSteps,
				sscSteps: {
					...sscStep,
					actions: [...sscStep.actions!, newSscAction],
				},
			};
		};
		setSSCSteps(updatedSSCSteps);
	};

	const removeSSCAction = (sscStep: SSCStep, sscActionId: number) => {
		const updatedSSCSteps = sscSteps.map((sscStep) => {
			if (sscStep.id === sscStepId) {
				return {
					...sscStep,
					actions: sscStep.actions!.filter(
						(action) => action.id !== sscActionId
					),
				};
			}
			return sscStep;
		});
		setSSCSteps(updatedSSCSteps);
	};

	const updateSSCAction = (sscStep: SSCStep, sscAction: SSCAction) => {
		const updatedSSCSteps = sscSteps.map((sscStep) => {
			if (sscStep.id === sscStepId) {
				return {
					...sscStep,
					actions: sscStep.actions!.map((existingAction) => {
						if (existingAction.id === sscAction.id) {
							return sscAction;
						}
						return existingAction;
					}),
				};
			}
			return sscStep;
		});
		setSSCSteps(updatedSSCSteps);
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

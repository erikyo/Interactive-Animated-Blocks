import { useState } from '@wordpress/element';
import type {
	propsType,
	SSCAction,
	SSCStep,
	ISSCAnimation,
} from './actionList';

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

	const addSSCAction = (sscStepId: number, sscAction: SSCAction) => {
		const updatedSSCSteps = sscSteps.map((sscStep) => {
			if (sscStep.id === sscStepId) {
				return { ...sscStep, actions: [...sscStep.actions, sscAction] };
			}
			return sscStep;
		});
		setSSCSteps(updatedSSCSteps);
	};

	const removeSSCAction = (sscStepId: number, sscActionId: number) => {
		const updatedSSCSteps = sscSteps.map((sscStep) => {
			if (sscStep.id === sscStepId) {
				return {
					...sscStep,
					actions: sscStep.actions.filter(
						(action) => action.id !== sscActionId
					),
				};
			}
			return sscStep;
		});
		setSSCSteps(updatedSSCSteps);
	};

	const updateSSCAction = (sscStepId: number, sscAction: SSCAction) => {
		const updatedSSCSteps = sscSteps.map((sscStep) => {
			if (sscStep.id === sscStepId) {
				return {
					...sscStep,
					actions: sscStep.actions.map((existingAction) => {
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
					actions: sscStep.actions.sort(
						(action1, action2) => action1.id - action2.id
					),
				};
			}
			return sscStep;
		});
		setSSCSteps(updatedSSCSteps);
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
	};
};

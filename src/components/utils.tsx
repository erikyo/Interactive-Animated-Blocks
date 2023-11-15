import type { AnimBaseObj } from './actionList';
import { seqActionObjTemplate } from '../utils/data';
import { sscPointerSensor } from './Misc';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SelectControlProps } from '@wordpress/components/build-types/select-control/types';

export function getKeyValue(anim: AnimBaseObj): string {
	return Object.keys(anim)[0];
}

export function sortByIndex<T extends { id: number }>(
	arg: Array<T>,
	active: any,
	over: any
) {
	const oldIndex = arg.map((o) => o.id).indexOf(active.id);
	const newIndex = arg.map((x) => x.id).indexOf(over.id);
	return arrayMove(arg, oldIndex, newIndex) as typeof arg;
}

export const provideSelectOptions = (): { label: string; value: string }[] => {
	return Object.keys(seqActionObjTemplate).map((stepAction) => {
		const baseObj = seqActionObjTemplate[stepAction];
		return {
			label: stepAction,
			value: baseObj.value.toString(),
		};
	});
};

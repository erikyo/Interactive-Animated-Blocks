import type { AnimBaseObj, SSCAction } from './actionList';
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
	return seqActionObjTemplate.map((baseObj) => {
		const key = getKeyValue(baseObj);
		return {
			label: key,
			value: baseObj[key].value as string,
		};
	});
};

export function getAnimBaseObj(sscAction: SSCAction): AnimBaseObj {
	return Object.entries(sscAction).reduce((obj, [key, value]) => {
		obj[key] = value;
		return obj;
	}, {} as AnimBaseObj);
}

export function setAnimBaseObj(
	animBaseObj: AnimBaseObj,
	newKey: string
): AnimBaseObj {
	let newObj: AnimBaseObj = { ...animBaseObj };
	delete newObj[newKey];
	newObj = {
		...newObj,
		[newKey]: animBaseObj[newKey],
	};
	return newObj;
}

export function deepMerge(target , source ) {
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			const value = source[key];
			if (typeof value === 'object' && value !== null) {
				if (!target[key] || typeof target[key] !== 'object') {
					target[key] = {};
				}
				deepMerge(target[key], value);
			} else {
				target[key] = value;
			}
		}
	}
}

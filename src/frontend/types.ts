export interface SscElement extends HTMLElement {
	unWatch: () => any;
	sscItemData?: SscElementData;
	sscItemOpts?: {};
}

export interface SscElementData {
	lock: boolean;
	sscItem: IntersectionObserverEntry;
	sscItemOpts?: {};
	sscAnimation: string;
	sscSequence?: {};
}

export type SscOptions = {
	container: HTMLElement;
	rootMargin: string;
	threshold: number[];
};

export type WindowProps = {
	lastScrollPosition: number;
	viewHeight: number;
	pageHeight: number;
	direction: undefined | 'up' | 'down';
};

export type Coords = { x: boolean; y: boolean };

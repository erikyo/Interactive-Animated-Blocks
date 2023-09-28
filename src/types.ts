/**
 * The Animated Element interface
 */
export interface SscElement extends HTMLElement {
	unWatch: () => any;
	sscItemData?: SscElementData;
	sscItemOpts?: {} | undefined;
	dataset: DOMStringMap;
	action?: string;
	lock?: boolean;
	isAnimated: boolean;
	isInViewport: boolean;
	isIntersecting: boolean;
	position?: SscPositionYDef;
	sscAnimation?: string;
	sscSequence?: {};
	sscAnimationType?: string;
	sscAnimationOptions?: Object;
	sscAnimated?: boolean;
	boundingClientRect: DOMRect;
	updatePosition(): void;
}

export interface SscElementData {
	el: HTMLElement;
	lock: boolean;
	sscItem: IntersectionObserverEntry;
	sscItemOpts?: {};
	sscAnimation: string;
	sscSequence?: {};
}

export interface SSCBlockProps {
	sscAnimated: boolean;
	sscAnimationType: string;
	sscAnimationOptions: SSCAnimationType;
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
	touchPos: Coords;
	direction: undefined | 'up' | 'down';
};

export type Coords = {
	x: number | undefined;
	y: number | undefined;
};

export type SscPositionYDef = {
	ycenter: number;
	yTop: number;
	yBottom: number;
};

export type Label = {
	label: string;
	value: string;
};

export type StylePropDef = {
	[key: string]: string;
};

export type SSCActionDef = {
	actionLabel: string;
	action: string;
	valueType: string;
	valueDefault: string;
};

/** Animations types */
export type SSCAnimationTypeDefault = {
	reiterate: boolean;
};

export type SSCHtmlDataProps = {
	'data-scene': string | null;
	'data-ssc-jumper-target': HTMLElement | null;
	'data-ssc-animation': string;
	'data-ssc-props': string | null;
	'data-ssc-sequence': string | null;
	className: string;
};

export interface SSCAnimationTypeAnimation extends SSCAnimationTypeDefault {
	duration: number;
	delay: number;
	intersection: number;
	animationLeave: string;
	animationEnter: string;
	stagger: string;
	easing: string;
}

export interface SSCAnimationTypeParallax extends SSCAnimationTypeDefault {
	motion: number;
	level: number;
	speed: number;
	direction: string;
}
export interface SSCAnimationTypeScrollTimeline
	extends SSCAnimationTypeDefault {
	duration: number;
	triggerHook: number;
}
export interface SSCAnimationTypeTimelineChild extends SSCAnimationTypeDefault {
	offset: number;
	delay: number;
	duration: number;
	easing: string;
}
export interface SSCAnimationTypeScrollParallax
	extends SSCAnimationTypeDefault {
	control: string;
	spinRatio: number;
}
export interface SSCAnimation360 extends SSCAnimationTypeDefault {
	spinRatio: number;
	control: string; // drag
}
export interface SSCAnimationTypeZoom extends SSCAnimationTypeDefault {
	zoom: number;
}
export interface SSCAnimationTypePlaybackControl
	extends SSCAnimationTypeDefault {
	playbackRatio: number;
}

/**
 * Animation type Counter
 */
export interface SSCAnimationTypeCounter extends SSCAnimationTypeDefault {
	duration: number;
	delay: number;
	easing: string;
	target: string;
}

/**
 * Animation type Stagger
 */
export interface SSCAnimationTypeStagger extends SSCAnimationTypeDefault {
	duration: number;
	delay: number;
	easing: string;
	preset: string;
	splitBy: string;
	intersection: number;
}

/**
 * Animation type Jump
 */
export interface SSCAnimationTypeJump extends SSCAnimationTypeDefault {
	target: string;
}

/** Animation type Navigator */
export interface SSCAnimationTypeNavigator extends SSCAnimationTypeDefault {
	color: string;
}

/** Animations types */
export type SSCAnimationType = {
	default:
		| SSCAnimationTypeDefault
		| SSCAnimationTypeAnimation
		| SSCAnimationTypeScrollTimeline
		| SSCAnimationTypeTimelineChild
		| SSCAnimationTypeScrollParallax
		| SSCAnimationTypeZoom
		| SSCAnimation360
		| SSCAnimationTypeParallax
		| SSCAnimationTypePlaybackControl
		| SSCAnimationTypeCounter
		| SSCAnimationTypeStagger
		| SSCAnimationTypeJump
		| SSCAnimationTypeNavigator;
	scene?: SSCAnimationScene[];
	target?: HTMLElement;
};

/**
 * The scene animation step
 */
export interface SSCAnimationScene {
	label: string;
	value: string;
	default?: {};
}

export interface SSCAnimationSceneData {
	id: number;
	key: number;
	action: string;
	defaultValue?: string;
	label?: string;
	value?: string;
}

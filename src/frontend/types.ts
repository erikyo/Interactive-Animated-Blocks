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

export interface SSCBlockProps {
	sscAnimated: boolean;
	sscAnimationType: string;
	sscAnimationOptions: Object;
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

export type StylePropDef = {
	[ key: string ]: string;
};

export type SSCHtmlDataProps = {
	'data-scene': string | null;
	'data-ssc-jumper-target': string;
	'data-ssc-animation': string;
	'data-ssc-props': string | null;
	'data-ssc-sequence': string | null;
	scene: string;
	className: string;
};

export type Label = {
	label: string;
	value: string | number | false | undefined;
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
export interface SSCAnimationTypeCounter extends SSCAnimationTypeDefault {
	duration: number;
	delay: number;
	easing: string;
	target: string;
}
export interface SSCAnimationTypeStagger extends SSCAnimationTypeDefault {
	duration: number;
	delay: number;
	easing: string;
	preset: string;
	splitBy: string;
	intersection: number;
}
export interface SSCAnimationTypeJump extends SSCAnimationTypeDefault {
	target: string;
}
export interface SSCAnimationTypeNavigator extends SSCAnimationTypeDefault {
	color: string;
}

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
};

export interface SSCAnimationTypeDef extends SSCAnimationType {
	label: string;
	value: string;
}

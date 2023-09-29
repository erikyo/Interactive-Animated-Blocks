export declare global {
	interface Window {
		screenControl: any;
		onmousewheel: any;
	}
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

/**
 * The Animated Element interface
 */
export interface SscElement extends HTMLElement {
	unWatch: () => any;
	sscItemData: SscElementData;
	sscItemOpts?: SSCAnimationTypeAnimation |
		SSCAnimationTypeParallax |
		SSCAnimationTypeScrollTimeline |
		SSCAnimationTypeTimelineChild |
		SSCAnimationTypeScrollParallax |
		SSCAnimationTypeZoom |
		SSCAnimation360 |
		SSCAnimationTypePlaybackControl |
		SSCAnimationTypeCounter |
		SSCAnimationTypeStagger |
		SSCAnimationTypeJump |
		SSCAnimationTypeNavigator;
	dataset: DOMStringMap;
	action?: string;
	lock?: boolean;
	isAnimated?: boolean;
	isChildren?: boolean;
	isInViewport: boolean;
	isIntersecting: boolean;
	position?: SscPositionYDef;
	sscAnimationType?: string;
	sscAnimationOptions?: Object;
	sscAnimated?: boolean;
	boundingClientRect?: DOMRect;
	updatePosition(): void;
}

export type SscElementData = {
	el: HTMLElement;
	lock: boolean;
	intersection: string;
	sscItem: number;
	sscItemOpts?: {};
	sscAnimation: string;
	sscSequence?: {};
}

export interface SscElementParallaxOpts {
	speed: string;
	level: string;
	direction: string;
}

/**
 * The SSC animated item save function type for the block
 */
export interface SSCBlockProps {
	sscAnimated: boolean;
	sscAnimationType: string;
	sscAnimationOptions: SSCAnimationType;
}

export type SscPositionYDef = {
	yTop?: number;
	yBottom?: number;
} | undefined;

export type Coords = {
	x: number | undefined;
	y: number | undefined;
};

export type Label = {
	label: string;
	value: string;
};

export type StylePropDef = {
	[key: string]: string;
};

export type StyleRule = {
	property: string;
	value: string;
};

export type SSCActionDef = {
	actionLabel: string;
	action: string;
	valueType: string;
	valueDefault: string;
};

/** Animations types */
export type SSCHtmlDataProps = {
	'data-scene': string | null;
	'data-ssc-jumper-target': HTMLElement | null;
	'data-ssc-animation': string;
	'data-ssc-props': string | null;
	'data-ssc-sequence': string | null;
	className: string;
};

interface StaggerPreset {
  opacity?: number[];
  scale?: number[];
  scaleX?: number[];
  translateX?: (string | number)[];
  translateY?: (string | number)[];
  translateZ?: number;
  elasticity?: number;

  transformOrigin?: string;
  rotateZ?: number[];
  rotateY?: number[];
}


export interface SSCAnimationTypeAnimation {
	reiterate: boolean;
	duration: string;
	delay: string;
	intersection: string;
	animationLeave?: string;
	animationEnter?: string;
	stagger: string;
	easing: string;
	sscItem: HTMLElement;
	isChildren: string;
}

export interface SSCAnimationTypeParallax {
	motion: string;
	level: string;
	speed: string;
	direction: string;
}
export interface SSCAnimationTypeScrollTimeline {
	duration: number;
	triggerHook: number;
}
export interface SSCAnimationTypeTimelineChild {
	offset: number;
	delay: number;
	duration: number;
	easing: string;
}
export interface SSCAnimationTypeScrollParallax {
	control: string;
	spinRatio: number;
}
export interface SSCAnimation360 {
	spinRatio: number;
	control: string; // drag
}
export interface SSCAnimationTypeZoom {
	zoom: number;
}
export interface SSCAnimationTypePlaybackControl {
	playbackRatio: number;
}

/**
 * Animation type Counter
 */
export interface SSCAnimationTypeCounter {
	duration: number;
	delay: number;
	easing: string;
	target: string;
}

/**
 * Animation type Stagger
 */
export interface SSCAnimationTypeStagger {
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
export interface SSCAnimationTypeJump {
	target: string;
}

/** Animation type Navigator */
export interface SSCAnimationTypeNavigator {
	color: string;
}

/** Animations types */
export type SSCAnimationType = {
	default: SSCAnimationTypeDefaults;
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

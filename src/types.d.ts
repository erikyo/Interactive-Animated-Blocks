export declare global {
	interface Window {
		screenControl: any;
		onmousewheel: any;
	}
}

/**
 * Anime.js library
 * https://www.npmjs.com/package/animejs#es6-modules
 */
declare module 'animejs/lib/anime.es.js';

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

export type sscItemOpts =
		SSCAnimationTypeAnimation |
		SSCAnimationTypeParallax |
		SSCAnimationTypeScrollParallax |
		SSCAnimationTypeNavigator |
		SSCAnimationTypeJackscrolling |
		SSCAnimationTypeTimeline |
		SSCAnimationTypePlaybackControl |
		SSCAnimationTypeTimelineChild |
		SSCAnimationTypeZoom |
		SSCAnimation360 |
		SSCAnimationTypeCounter |
		SSCAnimationTypeStagger |
		SSCAnimationTypeJump |
		SSCAnimationTypeCustom

/**
 * The Animated Element interface
 */
export interface SscElement extends HTMLElement {
	unWatch: () => any;
	sscItemData: SscElementData;
	sscItemOpts: sscItemOpts;
	dataset: DOMStringMap;
	lock: boolean;
	action: 'enter' | 'leave';
	isAnimated?: boolean;
	isChildren?: boolean;
	isInViewport: boolean;
	isIntersecting: boolean;
	position?: SscPositionYDef;
	scene: SSCAnimationSceneData[];
	boundingClientRect?: DOMRect;
	updatePosition(): void;
}

export type SscElementData = {
	el: HTMLElement;
	lock: boolean;
	visible: string;
	intersection: string;
	sscItem: number;
	sscItemOpts?: {};
	sscAnimation: string;
}


/**
 * The SSC animated item save function type for the block
 */
export interface SSCBlockProps {
	sscAnimated: boolean;
	sscAnimationType: string;
	sscAnimationOptions: any;
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
	activeArea: string;
	animationLeave?: string;
	animationEnter?: string;
	stagger: string;
	easing: string;
	sscItem: HTMLElement;
	isChildren: string;
}

/** Animations types */
export type SSCAnimationTypeCustom = {
	scene: SSCAnimationSceneData[];
	activeArea: number;
	delay: number;
	duration: number;
	easing: string;
	target?: HTMLElement;
};

export interface SSCAnimationTypeParallax {
	level: string;
	speed: string;
	direction: "horizontal" | "vertical";
}
export interface SSCAnimationTypeTimeline {
	duration: number;
	triggerHook: number;
	timelineScene: string;
	addIndicators: boolean;
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
export interface SSCAnimationTypeParallaxVideo {
	speed: string;
	level: string;
	direction: string;
	timelineDuration: number;
	playbackRatio: number;
}
export interface SSCAnimation360 {
	spinRatio: number;
	control: string; // drag
}
export interface SSCAnimationTypeZoom {
	zoom: number;
}
export interface SSCAnimationTypeJackscrolling {
	activeArea: number;
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
 * Animation type Text Stagger
 */
export interface SSCAnimationTypeStagger {
	duration: number;
	delay: number;
	easing: string;
	preset: string;
	splitBy: string;
	target: string;
	activeArea: number;
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

/**
 * The scene animation step
 */
export interface SSCAnimationDefaults {
	label: string;
	value: string;
	default: sscItemOpts;
}

export interface SSCAnimationSceneData {
	id: number;
	key: number;
	action: string;
	defaultValue?: string;
	property?: any;
	value: string;
}

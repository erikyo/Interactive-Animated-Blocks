export const actionsTemplate = [
	{
		actionLabel: 'Duration',
		action: 'duration',
		valueType: 'int',
		valueDefault: '500',
	},
	{
		actionLabel: 'Opacity',
		action: 'opacity',
		valueType: 'int',
		valueDefault: '1',
	},
	{
		actionLabel: 'translateY',
		action: 'translateY',
		valueType: 'string',
		valueDefault: '100px',
	},
	{
		actionLabel: 'translateX',
		action: 'translateX',
		valueType: 'string',
		valueDefault: '100px',
	},
	{
		actionLabel: 'Rotate',
		action: 'rotate',
		valueType: 'string',
		valueDefault: '45deg',
	},
	{
		actionLabel: 'Scale',
		action: 'scale',
		valueType: 'number',
		valueDefault: '1.5',
	},
	{
		actionLabel: 'Background',
		action: 'background',
		valueType: 'color',
		valueDefault: '#888',
	},
	{
		actionLabel: 'Color',
		action: 'color',
		valueType: 'color',
		valueDefault: '#f00',
	},
	{
		actionLabel: 'CSS Animation',
		action: 'cssAnimation',
		valueType: 'string',
		valueDefault: 'fadeIn 5s linear 2s infinite alternate',
	},
];

export const animationEasings = [
	{
		label: 'Linear',
		value: 'linear',
	},
	{
		label: 'elastic',
		value: 'elastic',
	},
	{
		label: 'easeInQuad',
		value: 'easeInQuad',
	},
	{
		label: 'easeOutQuad',
		value: 'easeOutQuad',
	},
	{
		label: 'easeInOutQuad',
		value: 'easeInOutQuad',
	},
	{
		label: 'easeOutInQuad',
		value: 'easeOutInQuad',
	},
	{
		label: 'easeInCubic',
		value: 'easeInCubic',
	},
	{
		label: 'easeOutCubic',
		value: 'easeOutCubic',
	},
	{
		label: 'easeInOutCubic',
		value: 'easeInOutCubic',
	},
	{
		label: 'easeOutInCubic',
		value: 'easeOutInCubic',
	},
];

export const animationTypes = [
	{
		label: 'Animation',
		value: 'sscAnimation',
		default: {
			animationEnter: 'fadeIn',
			animationExit: 'fadeOut',
			position: '50',
		},
	},
	{
		label: 'Parallax',
		value: 'sscParallax',
		default: {
			direction: 'Y',
			level: '1',
			speed: '1',
			motion: '50',
		},
	},
	{
		label: 'Levitate',
		value: 'sscLevitate',
		default: {},
	},
	{
		label: '360 image',
		value: 'ssc360',
		default: {},
	},
	{
		label: 'Play video on scroll over',
		value: 'sscVideoScroll',
		default: {},
	},
	{
		label: 'Video parallax',
		value: 'sscVideoControl',
		default: {},
	},
	{
		label: 'Play video on screen',
		value: 'sscVideoFocusPlay',
		default: {},
	},
	{
		label: 'Svg Path Animation',
		value: 'sscSvgPath',
		default: {
			duration: 5000,
			easing: 'easeInOutExpo',
		},
	},
	{
		label: 'Create your own animation',
		value: 'sscSequence',
		default: {
			duration: 2000,
			easing: 'easeInOutQuad',
			steps: [],
		},
	},
	{
		label: 'ScreenJacker',
		value: 'sscScreenJacker',
		default: {
			intersection: 50,
			duration: 1000,
			easing: 'easeInOutExpo',
		},
	},
	{
		label: 'Counter',
		value: 'sscCounter',
		default: {
			duration: 8000,
			easing: 'easeInOutExpo',
		},
	},
	{
		label: 'Text Stagger',
		value: 'sscTextStagger',
		default: {
			duration: 5000,
			easing: 'easeInOutQuad',
		},
	},
];

export const animationList = [
	{
		label: 'bounce',
		value: 'bounce',
	},
	{
		label: 'flash',
		value: 'flash',
	},
	{
		label: 'pulse',
		value: 'pulse',
	},
	{
		label: 'rubberBand',
		value: 'rubberBand',
	},
	{
		label: 'rubberBand',
		value: 'rubberBand',
	},
	{
		label: 'shakeX',
		value: 'shakeX',
	},
	{
		label: 'shakeY',
		value: 'shakeY',
	},
	{
		label: 'headShake',
		value: 'headShake',
	},
	{
		label: 'swing',
		value: 'swing',
	},
	{
		label: 'tada',
		value: 'tada',
	},
	{
		label: 'wobble',
		value: 'wobble',
	},
	{
		label: 'jello',
		value: 'jello',
	},
	{
		label: 'heartBeat',
		value: 'heartBeat',
	},
	{
		label: 'flash',
		value: 'flash',
	},
	{
		label: 'hinge',
		value: 'hinge',
	},
	{
		label: 'jackInTheBox',
		value: 'jackInTheBox',
	},
	{
		label: 'rollIn',
		value: 'rollIn',
	},
	{
		label: 'rollOut',
		value: 'rollOut',
	},

	// Fade
	{
		label: 'fadeIn',
		value: 'fadeIn',
	},
	{
		label: 'fadeInDown',
		value: 'fadeInDown',
	},
	{
		label: 'fadeInDownBig',
		value: 'fadeInDownBig',
	},
	{
		label: 'fadeInLeft',
		value: 'fadeInLeft',
	},
	{
		label: 'fadeInLeftBig',
		value: 'fadeInLeftBig',
	},
	{
		label: 'fadeInRight',
		value: 'fadeInRight',
	},
	{
		label: 'fadeInRightBig',
		value: 'fadeInRightBig',
	},
	{
		label: 'fadeInUp',
		value: 'fadeInUp',
	},
	{
		label: 'fadeInUpBig',
		value: 'fadeInUpBig',
	},
	{
		label: 'fadeInTopLeft',
		value: 'fadeInTopLeft',
	},
	{
		label: 'fadeInTopRight',
		value: 'fadeInTopRight',
	},
	{
		label: 'fadeInTopRight',
		value: 'fadeInTopRight',
	},
	{
		label: 'fadeInBottomLeft',
		value: 'fadeInBottomLeft',
	},
	// fade exit
	{
		label: 'fadeOut',
		value: 'fadeOut',
	},
	{
		label: 'fadeOutDown',
		value: 'fadeOutDown',
	},
	{
		label: 'fadeOutDownBig',
		value: 'fadeOutDownBig',
	},
	{
		label: 'fadeOutLeft',
		value: 'fadeOutLeft',
	},
	{
		label: 'fadeOutLeftBig',
		value: 'fadeOutLeftBig',
	},
	{
		label: 'fadeOutRight',
		value: 'fadeOutRight',
	},
	{
		label: 'fadeOutRightBig',
		value: 'fadeOutRightBig',
	},
	{
		label: 'fadeOutUp',
		value: 'fadeOutUp',
	},
	{
		label: 'fadeOutUpBig',
		value: 'fadeOutUpBig',
	},
	{
		label: 'fadeOutTopLeft',
		value: 'fadeOutTopLeft',
	},
	{
		label: 'fadeOutTopRight',
		value: 'fadeOutTopRight',
	},
	{
		label: 'fadeOutTopRight',
		value: 'fadeOutTopRight',
	},
	{
		label: 'fadeOutBottomLeft',
		value: 'fadeOutBottomLeft',
	},
];

export const textStaggerPresets = {
	default: [
		{
			translateY: [ '1.1em', 0 ],
			translateZ: 0,
			duration: 750,
			delay: ( el, i ) => 50 * i,
		},
		{
			opacity: 0,
			duration: 1000,
			easing: 'easeOutExpo',
			delay: 1000,
		},
	],
	expo: [
		{
			scale: [ 14, 1 ],
			opacity: [ 0, 1 ],
			easing: 'easeOutCirc',
			duration: 750,
			delay: ( el, i ) => 750 * i,
		},
		{
			opacity: 0,
			duration: 1000,
			easing: 'easeOutExpo',
			delay: 1000,
		},
	],
};

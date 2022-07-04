export const actionsTemplate = [
	{
		actionLabel: 'Keyframe (duration in ms)',
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
		actionLabel: 'translateZ',
		action: 'translateZ',
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
		actionLabel: 'rotateY',
		action: 'translateY',
		valueType: 'string',
		valueDefault: '100px',
	},
	{
		actionLabel: 'rotateX',
		action: 'translateX',
		valueType: 'string',
		valueDefault: '100px',
	},
	{
		actionLabel: 'rotateZ',
		action: 'translateZ',
		valueType: 'string',
		valueDefault: '100px',
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
		valueDefault: '#000',
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
		label: 'Elastic (low)',
		value: 'easeInElastic(1, .3)',
	},
	{
		label: 'Elastic (mid)',
		value: 'easeInElastic(1, .6)',
	},
	{
		label: 'Elastic (high)',
		value: 'easeInElastic(2, 1)',
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

	{
		label: 'easeInSine',
		value: 'easeInSine',
	},
	{
		label: 'easeOutSine',
		value: 'easeOutSine',
	},
	{
		label: 'easeInOutSine',
		value: 'easeInOutSine',
	},
	{
		label: 'easeOutInSine',
		value: 'easeOutInSine',
	},

	{
		label: 'easeInExpo',
		value: 'easeInExpo',
	},
	{
		label: 'easeOutExpo',
		value: 'easeOutExpo',
	},
	{
		label: 'easeInOutExpo',
		value: 'easeInOutExpo',
	},
	{
		label: 'easeOutInExpo',
		value: 'easeOutInExpo',
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
		default: {
			spinRatio: 1,
		},
	},
	{
		label: 'Play video on scroll over',
		value: 'sscVideoScroll',
		default: {},
	},
	{
		label: 'Video parallax',
		value: 'sscVideoControl',
		default: {
			playbackRatio: 1,
		},
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
		label: 'Custom animation',
		value: 'sscSequence',
		default: {
			duration: 2000,
			easing: 'easeInOutQuad',
			steps: [],
		},
	},
	{
		label: 'ScrollJacking',
		value: 'sscScrollJacking',
		default: {
			intersection: 50,
			duration: 800,
			easing: 'easeOutExpo',
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
			preset: 'default',
			splitBy: 'letter',
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
			translateY: [ '1em', 0 ],
			translateZ: 0,
		},
	],
	expo: [
		{
			scale: [ 15, 1 ],
			opacity: [ 0, 1 ],
		},
	],
	domino: [
		{
			rotateY: [ -90, 0 ],
			transformOrigin: '0 0',
		},
	],
	ghosting: [
		{
			translateX: [ 40, 0 ],
			translateZ: 0,
		},
		{
			translateX: [ 0, -30 ],
			opacity: [ 1, 0 ],
		},
	],
	elasticIn: [
		{
			scale: [ 0, 1 ],
			elasticity: 1200,
		},
	],
	rain: [
		{
			translateY: [ '-2em', 0 ],
			scaleX: [ 0, 1 ],
			opacity: [ 0, 1 ],
		},
	],
	snake: [
		{
			scaleX: [ 0, 1 ],
			translateY: [ '1em', 0 ],
			translateX: [ '.5em', 0 ],
			translateZ: 0,
			rotateZ: [ 90, 0 ],
			transformOrigin: '100% 50%',
		},
	],
};

export const textStaggerPresetsNames = [];
Object.keys( textStaggerPresets ).map( ( item ) =>
	textStaggerPresetsNames.push( {
		label: item,
		value: item,
	} )
);

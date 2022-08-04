/**
 * The ssc additional panel settings.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
export function addAttributes( settings ) {
	//check if object exists for old Gutenberg version compatibility
	//add allowedBlocks restriction
	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			sscAnimated: {
				type: 'boolean',
				default: false,
			},
			sscAnimationType: {
				type: 'string',
				default: false,
			},
			sscAnimationOptions: {
				type: 'object',
				default: {},
			},
			sscScene: {
				type: 'array',
				default: [
          {
            "loop": true,
            "translateX": [
              {
                "value": 250,
                "duration": 1000,
                "delay": 500
              },
              {
                "value": 0,
                "duration": 1000,
                "delay": 500
              }
            ],
            "translateY": [
              {
                "value": -200,
                "duration": 500
              },
              {
                "value": 200,
                "duration": 500,
                "delay": 1000
              }
            ],
            "scale": [
              {
                "value": 4,
                "duration": 100,
                "delay": 500,
                "easing": "easeOutExpo"
              },
              {
                "value": 1,
                "duration": 900
              }
            ]
          }
        ],
			},
			additionalCSS: {
				type: 'object',
				default: {},
			},
			additionalClasses: {
				type: 'object',
				default: {},
			},
		} );
	}

	return settings;
}

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
						duration: 500,
						opacity: {
							value: [ 0, 1 ],
							duration: 500,
							delay: 250,
						},
					},
				],
			},
			additionalCSS: {
				type: 'object',
				default: {},
			},
		} );
	}

	return settings;
}

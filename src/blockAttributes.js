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
			ssc: {
				type: 'object',
				default: {},
			},
		} );
	}

	return settings;
}

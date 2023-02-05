import { BlockAttributes } from '@wordpress/blocks';

/**
 * The ssc additional panel settings.
 *
 * @param {Object} settings            Settings for the block.
 *
 * @param          settings.attributes
 * @return {Object} settings Modified settings.
 */
export function addAttributes( settings: BlockAttributes ) {
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

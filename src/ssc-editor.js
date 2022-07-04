/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import './style/editor.scss';

import { addExtraProps } from './save';
import { withAdvancedControls } from './panelExtras';

/**
 * The ssc additional panel settings.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	//check if object exists for old Gutenberg version compatibility
	//add allowedBlocks restriction
	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			initialCSS: {
				type: 'string',
				default: 'this {\n}',
			},
			sscAnimated: {
				type: 'boolean',
				default: false,
			},
			sscReiterate: {
				type: 'boolean',
				default: true,
			},
			sscAnimationType: {
				type: 'string',
				default: false,
			},
			sscAnimationOptions: {
				type: 'object',
				default: {},
			},
		} );
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'sscEditor/add-attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'sscEditor/with-advanced-controls',
	withAdvancedControls
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'sscEditor/addExtraProps',
	addExtraProps
);

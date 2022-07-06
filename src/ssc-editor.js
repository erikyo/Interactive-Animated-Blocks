/**
 * WordPress Dependencies
 */

import { addFilter } from '@wordpress/hooks';

import { AnimationAdvancedControls } from './components/panelExtras';
import { StyleAdvancedControls } from './components/codeBox';

import { addExtraProps } from './save';

// css style
import './style/editor.scss';

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
				type: 'object',
				default: {},
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
	'sscEditor/advancedAnimationsControls',
	AnimationAdvancedControls
);

addFilter(
	'editor.BlockEdit',
	'sscEditor/advancedStyleControls',
	StyleAdvancedControls
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'sscEditor/addExtraProps',
	addExtraProps
);

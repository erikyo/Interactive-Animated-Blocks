/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';

import { AnimationAdvancedControls } from './admin/panelExtras';
import { StyleAdvancedControls } from './admin/styleExtras';
import { editAttributes } from './admin/editAttributes';

import { addAttributes } from './blockAttributes';
import { addExtraProps } from './save';

// css style
import './styles/editor.scss';

addFilter(
	'blocks.registerBlockType',
	'sscEditor/add-attributes',
	addAttributes
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'sscEditor/addExtraProps',
	addExtraProps
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
	'editor.BlockListBlock',
	'my-plugin/with-client-id-class-name',
	editAttributes
);

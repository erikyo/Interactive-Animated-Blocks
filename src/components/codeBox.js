import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useEffect, Fragment } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

import { EditorView, basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import {
	css2obj,
	styleObj2String,
	loDashToCapital,
	autoFormatCode,
} from '../utils/fn';

export const StyleAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { isSelected } = props;

			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							initialOpen={ true }
							icon="pencil"
							title={ __( 'Style Editor' ) }
						>
							{ isSelected && (
								<>
									<div id={ 'codebox' }></div>
									<CodeBox { ...props } />
								</>
							) }
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		};
	},
	'withAdvancedControls'
);

export const CodeBox = ( props ) => {
	const { setAttributes } = props;
	// codemirror settings
	const editorSettings = {};

	function editorFromTextArea() {
		const thisStyle = Object.keys( props.attributes.initialCSS ).length
			? 'this {\n' +
			  autoFormatCode( styleObj2String( props.attributes.initialCSS ) ) +
			  ';\n}'
			: 'this {\n  \n}';
		const view = new EditorView( {
			doc: thisStyle,
			extensions: [ basicSetup, css() ],
			parent: document.getElementById( 'codebox' ),
			...editorSettings,
		} );

		view.dom.addEventListener( 'keydown', function () {
			let result = view.state.doc.toString().replaceAll( '\n', '' );
			result = result.match( 'this {(.*?)}' )[ 1 ];
			setAttributes( {
				initialCSS: css2obj( loDashToCapital( result ) ) || {},
			} );
		} );
		return view;
	}

	useEffect( () => {
		return editorFromTextArea();
	}, [] );

	return null;
};

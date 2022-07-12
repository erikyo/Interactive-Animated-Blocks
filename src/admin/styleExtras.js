import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

import { CodeBox } from '../components/CodeBox';

export const StyleAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const {
				isSelected,
				setAttributes,
				attributes: { additionalCSS },
			} = props;

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
									<div id={ 'codebox-css' }></div>
									<CodeBox
										{ ...props }
										data={ additionalCSS }
										language={ 'css' }
										onChange={ ( r ) =>
											setAttributes( {
												additionalCSS: r,
											} )
										}
									/>
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

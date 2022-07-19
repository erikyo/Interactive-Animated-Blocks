import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

import { CodeBox } from '../components/CodeBox';

export const StyleAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const {
				isSelected,
				setAttributes,
				attributes: { additionalCSS, additionalClasses },
			} = props;

			// css class setter
			const setClass = ( el, cssClass ) => {
				el.classList.add( cssClass );
			};

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
									<ToggleControl
										label={ __( 'Absolute position' ) }
										checked={
											additionalClasses.absolute || false
										}
										onChange={ () => {
											setAttributes( {
												additionalClasses: {
													...additionalClasses,
													absolute:
														! additionalClasses.absolute,
												},
											} );
										} }
									/>

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

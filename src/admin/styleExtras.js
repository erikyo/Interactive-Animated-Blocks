import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

import { CodeBox } from '../components/CodeBox';
import { capitalToloDash } from '../utils/fn';

export const StyleAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const {
				isSelected,
				setAttributes,
				attributes: { additionalCSS, additionalClasses },
			} = props;

			/**
			 * Add and remove a css class
			 *
			 * If the toggleAdd is true, then add the cssClass to the additionalClasses object.
			 * If the toggleAdd is false, then delete the cssClass from the additionalClasses object
			 *
			 * @param {boolean} toggleAdd - true or false, depending on whether the user is adding or removing the class
			 * @param {string}  cssClass  - The CSS class to toggle.
			 */
			function toggleClass( toggleAdd, cssClass ) {
				if ( toggleAdd ) {
					setAttributes( {
						additionalClasses: {
							...additionalClasses,
							[ cssClass ]: capitalToloDash( cssClass ),
						},
					} );
				} else {
					delete additionalClasses[ cssClass ];
					setAttributes( {
						additionalClasses,
					} );
				}
			}

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
											additionalClasses.sscAbsolute || false
										}
										onChange={ ( e ) => toggleClass( e, 'sscAbsolute' ) }
									/>

									<ToggleControl
										label={ __( 'Hidden' ) }
										checked={
											additionalClasses.sscHide || false
										}
										onChange={ ( e ) => toggleClass( e, 'sscHide' ) }
									/>

									<div id={ 'codebox-css' }></div>
									<CodeBox
										data={ additionalCSS }
										language={ 'css' }
										onKeyChange={ ( r ) =>
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

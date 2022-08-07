import { createHigherOrderComponent } from '@wordpress/compose';
import classnames from 'classnames';

/**
 * It's a higher order component that adds the custom classes into block editor
 */
export const editAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props, block ) => {
			const {
				attributes: { additionalClasses, additionalCSS },
				className,
			} = props;

			if ( additionalClasses || additionalCSS ) {
				const customClasses = [];
				const additional = {
					style: {},
				};

				Object.entries( additionalClasses ).map( ( cssClass ) =>
					cssClass[ 1 ] !== false
						? customClasses.push( 'ssc-' + cssClass[ 0 ] )
						: null
				);

				Object.entries( additionalCSS ).map( ( cssStyle ) =>
					cssStyle[ 1 ] !== false
						? additional.style[ cssStyle[ 0 ] ] = cssStyle[ 1 ]
						: null
				);

				return (
					<BlockListBlock
						{ ...block }
						{ ...props }
						className={
							classnames( className, customClasses.join( ' ' ) ) || ''
						}
						wrapperProps={ { style: { ...additionalCSS } } }
					/>
				);
			}

			return <BlockListBlock { ...props } />;
		};
	},
	'withClientIdClassName'
);

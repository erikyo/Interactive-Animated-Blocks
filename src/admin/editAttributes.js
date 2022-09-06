import { createHigherOrderComponent } from '@wordpress/compose';
import classnames from 'classnames';
import { capitalToloDash } from '../utils/fn';

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
				const additional = {
					style: {},
				};
				const classes = [];

				Object.entries( additionalClasses ).map( ( cssClass ) =>
					cssClass[ 0 ] !== false
						? classes.push( capitalToloDash( cssClass[ 0 ] ) )
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
						wrapperProps={ {
							className: classnames( className, classes ) || '',
							style: { ...additionalCSS },
						} }
					/>
				);
			}

			return <BlockListBlock { ...props } />;
		};
	},
	'withClientIdClassName'
);

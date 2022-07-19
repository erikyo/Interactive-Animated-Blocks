import { createHigherOrderComponent } from '@wordpress/compose';
import classnames from 'classnames';

export const editAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props, block ) => {
			const {
				attributes: { additionalClasses },
				className,
			} = props;

			const customClasses = [];

			Object.entries( additionalClasses ).map( ( cssClass ) =>
				cssClass[ 1 ] !== false
					? customClasses.push( 'ssc-' + cssClass[ 0 ] )
					: null
			);

			return (
				<BlockListBlock
					{ ...block }
					{ ...props }
					className={
						classnames( className, customClasses.join( ' ' ) ) || ''
					}
				/>
			);
		};
	},
	'withClientIdClassName'
);

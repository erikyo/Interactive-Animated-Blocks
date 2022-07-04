import { cssize, dataStringify, getDefaults } from './utils/fn';
import classnames from 'classnames';

/**
 * I know this is not the save function but is a hook to change some data before
 * Add custom dataset to element before save.
 *
 * @param {Object} extraProps Block element.
 * @param {Object} blockType  Blocks object.
 * @param {Object} attributes Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
export const addExtraProps = ( extraProps, blockType, attributes ) => {
	const {
		initialCSS,
		sscAnimated,
		sscReiterate,
		sscAnimationType,
		sscAnimationOptions,
	} = attributes;

	if ( sscAnimated && sscAnimationType ) {
		const defaults = getDefaults( sscAnimationType );
		sscAnimationOptions[ sscAnimationType ] = {
			...defaults,
			...sscAnimationOptions[ sscAnimationType ],
		};

		extraProps[ 'data-ssc-animation' ] = sscAnimationType;
		extraProps[ 'data-ssc-reiterate' ] =
			sscAnimated && sscReiterate ? 'true' : 'false';

		const options = sscAnimationOptions[ sscAnimationType ] || false;
		if ( options && Object.keys( options ).length ) {
			extraProps[ 'data-ssc-props' ] = dataStringify(
				options,
				sscAnimationType
			);
		}

		// map the original array into a single key value object
		if ( sscAnimationType === 'sscSequence' ) {
			const selected =
				sscAnimationOptions[ sscAnimationType ].steps || false;
			if (
				selected &&
				Object.keys( sscAnimationOptions[ sscAnimationType ] ).length
			) {
				extraProps[ 'data-ssc-sequence' ] = dataStringify(
					selected,
					'sequence'
				);
			}
		}

		//check if attribute exists for old Gutenberg version compatibility
		//add class only when visibleOnMobile = false
		//add allowedBlocks restriction
		const hasTransition =
			sscAnimationOptions[ sscAnimationType ] &&
			sscAnimationOptions[ sscAnimationType ].motion
				? sscAnimationOptions[ sscAnimationType ].motion + 'ms'
				: false;

		// css style
		const CustomStyle = sscAnimated
			? { transition: hasTransition || sscAnimated ? '350ms' : 0 }
			: {};

		let initialStyle = '';
		if ( initialCSS !== {} ) {
			initialStyle = initialCSS.match( '\{([^)]+)\}' );
			if ( initialStyle ) {
				initialStyle = cssize( initialStyle[1] );
			} else {
				// maybe "this {}" has been removed but some style is present
				initialStyle = cssize( initialCSS );
			}
		}
		// element classes

		const classes = sscAnimated ? 'ssc' : '';

		return Object.assign( extraProps, {
			className: classnames( extraProps.className, classes ),
			style: { ...initialStyle, ...CustomStyle, ...extraProps.style },
		} );
	}

	return extraProps;
};

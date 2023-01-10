import classnames from 'classnames';
import { capitalToloDash, dataStringify, getDefaults } from './utils/fn';

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
	const { sscAnimated, sscAnimationType, sscAnimationOptions } =
		attributes.ssc;

	const classes = [];

	if ( !! sscAnimated && sscAnimationType ) {
		const defaults = getDefaults( sscAnimationType );

		const animationOptions = {
			...defaults,
			...sscAnimationOptions,
		};

		// this adds to the dataset sscAnimation="theTypeOfAnimation"
		extraProps[ 'data-ssc-animation' ] = sscAnimationType;

		if ( Object.keys( animationOptions ).length ) {
			extraProps[ 'data-ssc-props' ] = dataStringify(
				animationOptions,
				sscAnimationType
			);
		}

		if (
			sscAnimationType === 'sscTimelineChild' &&
			animationOptions?.scene
		) {
			try {
				extraProps[ 'data-scene' ] = JSON.stringify(
					animationOptions.scene,
					null,
					null
				);
			} catch ( err ) {
				extraProps[ 'data-scene' ] = '';
			}
		}

		if ( sscAnimationType === 'sscScreenJump' ) {
			extraProps[ 'data-ssc-jumper-target' ] =
				animationOptions.target || 'none';
		}

		// map the original array into a single key value object
		if ( sscAnimationType === 'sscSequence' ) {
			const selected = animationOptions.scene || false;
			if ( selected && Object.keys( animationOptions ).length ) {
				extraProps[ 'data-ssc-sequence' ] = dataStringify(
					selected,
					'sequence'
				);
			}
		}

		classes.push( 'ssc' );
		classes.push( capitalToloDash( sscAnimationType ) );
	}

	// add all the custom properties to the element
	Object.assign( extraProps, {
		className: classnames( classes ),
	} );

	return extraProps;
};

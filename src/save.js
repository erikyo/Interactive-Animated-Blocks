import { capitalToloDash, dataStringify, getDefaults } from './utils/fn';
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
		additionalCSS,
		additionalClasses,
		sscAnimated,
		sscAnimationType,
		sscAnimationOptions,
		sscScene,
	} = attributes;

	const classes = [];
	const styles = {};

	if ( sscAnimated && sscAnimationType ) {
		const defaults = getDefaults( sscAnimationType );

		sscAnimationOptions[ sscAnimationType ] = {
			...defaults,
			...sscAnimationOptions[ sscAnimationType ],
		};

		// this adds to the dataset sscAnimation="theTypeOfAnimation"
		extraProps[ 'data-ssc-animation' ] = sscAnimationType;

		const options = sscAnimationOptions[ sscAnimationType ] || false;
		if ( options && Object.keys( options ).length ) {
			extraProps[ 'data-ssc-props' ] = dataStringify(
				options,
				sscAnimationType
			);
		}

		if ( sscAnimationType === 'sscTimelineChild' ) {
			try {
				extraProps[ 'data-scene' ] = JSON.stringify(
					sscScene,
					null,
					null
				);
			} catch ( err ) {
				extraProps[ 'data-scene' ] = '';
			}
		}

		if ( sscAnimationType === 'sscScreenJump' ) {
			extraProps[ 'data-ssc-jumper-target' ] =
				sscAnimationOptions[ sscAnimationType ].target || 'none';
		}

		// map the original array into a single key value object
		if ( sscAnimationType === 'sscSequence' ) {
			const selected =
				sscAnimationOptions[ sscAnimationType ].scene || false;
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

		classes.push( 'ssc' );
		classes.push( capitalToloDash( sscAnimationType ) );
	}

	if ( additionalClasses.length ) {
		additionalClasses.forEach( ( cssClass ) => {
			if ( cssClass[ 0 ] === 'sscAbsolute' ) {
				additionalCSS.position = 'absolute';
			} else if ( cssClass[ 0 ] === 'sscHide' ) {
				additionalCSS.opacity = 0;
			}
			classes.push( capitalToloDash( cssClass[ 0 ] ) );
		} );
	}

	// add all the custom properties to the element
	Object.assign( extraProps, {
		style: { ...styles, ...additionalCSS, ...extraProps.style },
		className: classnames( extraProps.className, ...classes ),
	} );

	return extraProps;
};

import { dataStringify, getDefaults } from './utils/fn';
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

    // this add to the dataset sscAnimation="theTypeOfAnimation"
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
				// const sceneData = JSON.parse( rawData ) || {};
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

		// element classes
		switch ( sscAnimationType ) {
			case 'sscScrollJacking':
				classes.push( 'ssc ssc-scroll-jacking' );
				break;
			case 'sscScreenJump':
				classes.push( 'ssc ssc-screen-jumper' );
				break;
			case 'sscVideoScroll':
				classes.push( 'ssc ssc-video-scroll' );
				break;
			default:
				classes.push( 'ssc' );
				break;
		}
	}

	if ( additionalCSS || additionalClasses ) {
		// element classes
		switch ( additionalClasses ) {
			case 'sscAbsolute':
				classes.push( 'ssc-absolute' );
				break;
		}

    // if the animation type has a property with the key motion a style will be applied with the given value
		styles.transition =
			sscAnimationOptions[ sscAnimationType ] &&
			sscAnimationOptions[ sscAnimationType ].motion
				? sscAnimationOptions[ sscAnimationType ].motion + 'ms'
				: null;
	}

  // add all the custom properties to the element
	Object.assign( extraProps, {
		style: { ...styles, ...additionalCSS, ...extraProps.style },
		className: classnames( extraProps.className, classes.join( ' ' ) ),
	} );

	return extraProps;
};

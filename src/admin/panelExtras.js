import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { getDefaults } from '../utils/fn';
import { ActionList } from '../components/ActionList';
import { CodeBox } from '../components/CodeBox';

import {
	animationEasings,
	cssAnimationsEasings,
	animationList,
	animationTypes,
	textStaggerPresetsNames,
} from '../utils/data';

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
export const AnimationAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const {
				name,
				setAttributes,
				isSelected,
				attributes: {
					sscAnimated,
					sscAnimationType,
					sscAnimationOptions,
					sscScene,
					additionalClasses,
				},
			} = props;

			/**
			 * Set the animation options
			 *
			 * @param    {Object|boolean} data - the data to store
			 * @param    {string}         prop - the property
			 * @param    {string|number}  type - the type of animation
			 *
			 * @typedef {Object} sscAnimationOptions
			 * @property {Object}         type - the type of animation (each animation has its own set of default parameters)
			 *
			 */
			const setOption = ( data, prop, type ) => {
				setAttributes( {
					sscAnimationOptions: {
						...sscAnimationOptions,
						[ type ]: {
							...sscAnimationOptions[ type ],
							[ prop ]: data,
						},
					},
				} );
			};

			/**
			 * The function `pullScene` takes a single argument, `data`,
			 * and uses the `setOption` function to set the value of the `scene` option
			 * to the value of the `sscSequence` property of the `data` object
			 *
			 * @param {Object} data - The data object that contains the animation sequence
			 *
			 * @type {data}
			 */
			function pullScene( data ) {
				setOption( data, 'scene', 'sscSequence' );
			}

			/**
			 * Updates the selected item animation settings
			 *
			 * `updateAnimation` is a function that takes the type of animation and
			 * sets the default attributes if none have been set previously
			 *
			 * @param  attr - The attribute that is being updated.
			 *
			 * @type {sscAnimationType}
			 * @type {sscAnimationOptions}
			 */
			function updateAnimation( attr ) {
				const animationOptions = sscAnimationOptions[ attr ] || {};

				// get default options if the animation isn't initialized
				const defaults = getDefaults( attr );
				animationOptions[ attr ] = {
					...defaults,
				};

				setAttributes( {
					sscAnimationType: attr,
					additionalClasses: {
						...additionalClasses,
						[ attr ]:
              ! attr,
					},
					sscAnimationOptions: animationOptions,
				} );
			}

			/**
			 * Then Enable the animation and provides default options if empty
			 * If the animation settings aren't set, set the default.
			 */
			const toggleAnimated = () => {
				// before show the animation attributes prefill the
				if ( ! sscAnimated ) {
					updateAnimation( 'sscAnimation' );
				}
				// then show the options
				setAttributes( {
					sscAnimated: ! sscAnimated,
				} );
			};

			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							initialOpen={ true }
							icon="visibility"
							title={ __( 'Screen Control' ) }
						>
							{ isSelected && (
								<>
									<ToggleControl
										// ENABLE ANIMATION
										label={ __( 'Animated' ) }
										checked={ sscAnimated }
										onChange={ toggleAnimated }
										help={
											!! sscAnimated
												? __( 'Please choose an animation from the select input below.' )
												: __( 'Not Animated.' )
										}
									/>

									{ sscAnimated && (
										<>
											<SelectControl
												label={
													'Choose an animation type for ' +
													name.split( '/' ).pop()
												}
												value={ sscAnimationType }
												options={ animationTypes }
												onChange={ updateAnimation }
											></SelectControl>

											<ToggleControl
												label={ __( 'Reiterate' ) }
												checked={
													( sscAnimationOptions[
														sscAnimationType
													] &&
														sscAnimationOptions[
															sscAnimationType
														].reiterate ) ||
													true
												}
												onChange={ () =>
													setOption(
														! sscAnimationOptions[
															sscAnimationType
														].reiterate,
														'reiterate',
														sscAnimationType
													)
												}
											/>

											{ sscAnimationType &&
												[
													'sscSvgPath',
													'sscSequence',
													'sscScrollJacking',
													'sscCounter',
													'sscTextStagger',
													'sscAnimation',
													'sscTimelineChild',
												].includes(
													sscAnimationType
												) && (
												<>
													<RangeControl
														label={
															'Delay (ms)'
														}
														value={
															sscAnimationOptions[
																sscAnimationType
															].delay
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'delay',
																sscAnimationType
															)
														}
														min={ 0 }
														max={ 10000 }
														step={ 10 }
													/>
													<RangeControl
														label={
															'Duration (ms)'
														}
														value={
															sscAnimationOptions[
																sscAnimationType
															].duration
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'duration',
																sscAnimationType
															)
														}
														min={ 0 }
														max={ 10000 }
														step={ 10 }
													/>
													<SelectControl
														label={ 'Easing' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].easing
														}
														options={
															sscAnimationType !==
																'sscAnimation'
																? animationEasings
																: cssAnimationsEasings
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'easing',
																sscAnimationType
															)
														}
													></SelectControl>
												</>
											) }

											{ sscAnimationType ===
												'sscTimelineChild' && (
												<>
													<RangeControl
														label={
															'Animation start offset (ms)'
														}
														value={
															sscAnimationOptions[
																sscAnimationType
															].offset
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'offset',
																sscAnimationType
															)
														}
														min={ -10000 }
														max={ 10000 }
														step={ 10 }
													/>
													<h4>Scene editor</h4>
													<p>
														Ask Erik how write your
														first animation!
													</p>
													<div
														id={ 'codebox-json' }
													></div>
													<CodeBox
														data={ sscScene }
														language={ 'json' }
														onKeyChange={ ( e ) =>
															setAttributes( {
																sscScene: e,
															} )
														}
													/>
												</>
											) }

											{ sscAnimationType ===
												'sscSequence' && (
												<ActionList
													data={
														sscAnimationOptions[
															sscAnimationType
														].scene
													}
													type={ sscAnimationType }
													onSave={ pullScene }
												/>
											) }

											{ sscAnimationType === 'ssc360' && (
												<>
													<TextControl
														label={ 'Spin ratio' }
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].spinRatio || 1
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'spinRatio',
																sscAnimationType
															)
														}
													/>

													<SelectControl
														label={ 'Controls' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].control
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'control',
																sscAnimationType
															)
														}
														options={ [
															{
																label: 'Pointer position',
																value: 'pointer',
															},
															{
																label: 'Drag',
																value: 'drag',
															},
														] }
													/>
												</>
											) }

											{ [
												'sscVideoParallax',
												'sscVideoScroll',
											].includes( sscAnimationType ) && (
												<>
													<RangeControl
														label={
															'Playback Ratio'
														}
														description={
															'the mouse wheel speed playback speed'
														}
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].playbackRatio || 1
														}
														min={ 0 }
														max={ 10 }
														step={ 0.1 }
														onChange={ ( e ) =>
															setOption(
																e,
																'playbackRatio',
																sscAnimationType
															)
														}
													/>
												</>
											) }

											{ sscAnimationType ===
												'sscParallax' && (
												<>
													<TextControl
														label={
															'The speed of the parallaxed object (expressed in pixels - negative value enabled)'
														}
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].speed
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'speed',
																sscAnimationType
															)
														}
													/>
													<SelectControl
														label={ 'Direction' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].direction
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'direction',
																sscAnimationType
															)
														}
														options={ [
															{
																label: 'vertical',
																value: 'y',
															},
															{
																label: 'horizontal',
																value: 'x',
															},
														] }
													/>
													<TextControl
														label={ 'Level' }
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].level
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'level',
																sscAnimationType
															)
														}
													/>
													<TextControl
														label={
															'Motion (in ms)'
														}
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].motion
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'motion',
																sscAnimationType
															)
														}
													/>
												</>
											) }

											{ sscAnimationType ===
												'sscAnimation' &&
												sscAnimationOptions[
													sscAnimationType
												] && (
												<>
													<SelectControl
														label={
															'Entering animation name'
														}
														options={
															animationList
														}
														value={
															sscAnimationOptions[
																sscAnimationType
															].animationEnter
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'animationEnter',
																sscAnimationType
															)
														}
													/>
													<SelectControl
														label={
															'Exiting animation name (checkout animate.css)'
														}
														options={
															animationList
														}
														value={
															sscAnimationOptions[
																sscAnimationType
															].animationLeave
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'animationLeave',
																sscAnimationType
															)
														}
													/>
													<SelectControl
														label={ 'Stagger' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].stagger
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'stagger',
																sscAnimationType
															)
														}
														options={ [
															{
																label: 'none',
																value: 'none',
															},
															{
																label: 'Elements',
																value: 'elements',
															},
															{
																label: 'Letter',
																value: 'letter',
															},
															{
																label: 'Word',
																value: 'word',
															},
														] }
													/>
												</>
											) }
											{ sscAnimationType ===
												'sscTextStagger' && (
												<>
													<SelectControl
														label={ 'preset' }
														options={
															textStaggerPresetsNames
														}
														value={
															sscAnimationOptions[
																sscAnimationType
															].preset
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'preset',
																sscAnimationType
															)
														}
													/>
													<SelectControl
														label={ 'Split by' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].splitBy
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'splitBy',
																sscAnimationType
															)
														}
														options={ [
															{
																label: 'Letter',
																value: 'letter',
															},
															{
																label: 'Word',
																value: 'word',
															},
														] }
													/>
												</>
											) }
											{ sscAnimationType && [
												'sscSvgPath',
												'sscSequence',
												'sscAnimation',
												'sscScrollJacking',
											].includes(
												sscAnimationType
											) && (
												<>
													<RangeControl
														label={
															'Viewport Minimum Active Zone (%)'
														}
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															]
																.intersection ||
																80
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'intersection',
																sscAnimationType
															)
														}
													/>
												</>
											) }

											{ sscAnimationType ===
												'sscCounter' && (
												<SelectControl
													label={ 'Target' }
													value={
														sscAnimationOptions[
															sscAnimationType
														].target
													}
													onChange={ ( e ) =>
														setOption(
															e,
															'target',
															sscAnimationType
														)
													}
													options={ [
														{
															label: 'Number',
															value: 'number',
														},
														{
															label: 'Word',
															value: 'word',
														},
													] }
												/>
											) }

											{ sscAnimationType ===
												'sscScreenJump' && (
												<SelectControl
													label={ 'Target' }
													value={
														sscAnimationOptions[
															sscAnimationType
														].target
													}
													onChange={ ( e ) =>
														setOption(
															e,
															'target',
															sscAnimationType
														)
													}
													options={ [
														{
															label: 'Next View',
															value: 'none',
														},
														{
															label: 'Anchor',
															value: 'anchor',
														},
													] }
												/>
											) }

											{ sscAnimationType ===
												'sscScrollTimeline' && (
												<>
													<RangeControl
														label={
															'Duration (height in px)'
														}
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].duration
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'duration',
																sscAnimationType
															)
														}
														min={ 100 }
														step={ 10 }
														max={ 10000 }
													/>
													<RangeControl
														label={
															'triggerHook (0:top - 1:bottom)'
														}
														type={ 'number' }
														value={
															sscAnimationOptions[
																sscAnimationType
															].triggerHook
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'triggerHook',
																sscAnimationType
															)
														}
														min={ 0 }
														step={ 0.01 }
														max={ 1 }
													/>
												</>
											) }
										</>
									) }
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

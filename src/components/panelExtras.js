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
import { __ } from '@wordpress/i18n';

import {
	animationEasings,
	animationList,
	animationTypes,
	textStaggerPresetsNames,
} from '../utils/data';
import { getDefaults } from '../utils/fn';
import { ActionList } from './ActionList';

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
					sscReiterate,
					sscAnimationType,
					sscAnimationOptions,
				},
			} = props;

			// set the animation options
			const setOption = ( event, prop, type ) => {
				setAttributes( {
					sscAnimationOptions: {
						...sscAnimationOptions,
						[ type ]: {
							...sscAnimationOptions[ type ],
							[ prop ]: event,
						},
					},
				} );
			};

			// animation sequence setter
			const pullData = ( data, type = 'sscSequence' ) => {
				setOption( data, 'steps', type );
			};

			// set the animation
			const updateAnimation = ( attr ) => {
				const animationOptions = sscAnimationOptions[ attr ] || {};

				// get default options if the animation isn't initialized
				const defaults = getDefaults( attr );
				animationOptions[ attr ] = {
					...defaults,
					...animationOptions,
				};

				setAttributes( {
					sscAnimationType: attr,
					sscAnimationOptions: animationOptions,
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
										label={ __( 'Animated' ) }
										checked={ sscAnimated }
										onChange={ () =>
											setAttributes( {
												sscAnimated: ! sscAnimated,
											} )
										}
										help={
											!! sscAnimated
												? __(
														'Please choose an animation from the select input below.'
												  )
												: __( 'Not Animated.' )
										}
									/>

									{ sscAnimated && (
										<>
											<SelectControl
												label={
													'Choose an animation type for ' +
													name
												}
												value={ sscAnimationType }
												options={ animationTypes }
												onChange={ updateAnimation }
											></SelectControl>

											<ToggleControl
												label={ __( 'Reiterate' ) }
												checked={ sscReiterate }
												onChange={ () =>
													setAttributes( {
														sscReiterate:
															! sscReiterate,
													} )
												}
												help={
													!! sscReiterate
														? __(
																'Iterate the animation each time the object enters the screen'
														  )
														: __(
																"After the object has done it's job unmount it"
														  )
												}
											/>

											{ sscAnimationType &&
												[
													'sscSvgPath',
													'sscSequence',
													'sscVideoFocusPlay',
													'sscScrollJacking',
													'sscCounter',
													'sscTextStagger',
													'sscAnimation',
												].includes(
													sscAnimationType
												) && (
													<>
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
																animationEasings
															}
															onChange={ ( e ) =>
																setOption(
																	e,
																	'easing',
																	sscAnimationType
																)
															}
														></SelectControl>
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
													</>
												) }
											{ sscAnimationType ===
												'sscSequence' && (
												<ActionList
													data={
														sscAnimationOptions[
															sscAnimationType
														].steps
													}
													type={ sscAnimationType }
													func={ pullData }
												/>
											) }
											{ sscAnimationType === 'ssc360' && (
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
											) }

											{ sscAnimationType ===
												'sscVideoScroll' && (
												<TextControl
													label={ 'Playback Ratio' }
													description={
														'the mouse wheel speed playback speed'
													}
													type={ 'number' }
													value={
														sscAnimationOptions[
															sscAnimationType
														].playbackRatio || 1
													}
													onChange={ ( e ) =>
														setOption(
															e,
															'playbackRatio',
															sscAnimationType
														)
													}
												/>
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
																].animationExit
															}
															onChange={ ( e ) =>
																setOption(
																	e,
																	'animationExit',
																	sscAnimationType
																)
															}
														/>
														<TextControl
															label={
																'Enter Position (% from top)'
															}
															type={ 'number' }
															value={
																sscAnimationOptions[
																	sscAnimationType
																]
																	.intersection ||
																20
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
											{ sscAnimationType ===
												'sscScrollJacking' &&
												sscAnimationOptions[
													sscAnimationType
												] && (
													<>
														<TextControl
															label={
																'Page Coverage (in %) needed before scroll-lock'
															}
															type={ 'number' }
															value={
																sscAnimationOptions[
																	sscAnimationType
																].intersection
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

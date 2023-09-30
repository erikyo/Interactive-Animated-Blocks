import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { seen } from '@wordpress/icons';

import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { getDefaults } from '../utils/fn';
import { ActionList } from '../components/ActionList';

import {
	animationEasings,
	cssAnimationsEasings,
	animationList,
	animationTypes,
	textStaggerPresetsNames,
} from '../utils/data';
import type { SSCAnimationScene } from '../types.d.ts';

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
export const AnimationAdvancedControls = createHigherOrderComponent(
	(BlockEdit) => {
		return (props) => {
			const {
				name,
				setAttributes,
				isSelected,
				attributes: { ssc },
			} = props;

			const {
				sscAnimated: sscAnimated = false,
				sscAnimationType: sscAnimationType = false,
				sscAnimationOptions: sscAnimationOptions = {},
			} = ssc;

			/**
			 * Set the animation options
			 *
			 * @param data - the data to store
			 * @param prop - the property to set
			 */
			const setOption = (
				data: number | string | {} | undefined,
				prop: string
			) => {
				return (
					!!data &&
					setAttributes({
						ssc: {
							...ssc,
							sscAnimationOptions: {
								...ssc.sscAnimationOptions,
								[prop]: data,
							},
						},
					})
				);
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
			function pullScene(data: {}) {
				setOption(data, 'scene');
			}

			/**
			 * Updates the selected item animation settings
			 *
			 * `updateAnimation` is a function that takes the type of animation and
			 * sets the default attributes if none have been set previously
			 *
			 * @param type                        - The attribute type chosen by the user
			 * @param additionalProps             - props to be added to the animation
			 * @param additionalProps.sscAnimated - Whether the animation is animated
			 */
			function updateAnimation(
				type: string,
				additionalProps?: { sscAnimated: any }
			) {
				if (type === sscAnimationType) return null;

				const defaultOptions = getDefaults(type);

				// get default options if the animation isn't initialized
				setAttributes({
					ssc: {
						...ssc,
						sscAnimationType: type,
						sscAnimationOptions: defaultOptions?.default, // the default values for this animation
						...additionalProps,
					},
				});
			}

			/**
			 * Then Enable the animation and provides default options if empty
			 */
			const toggleAnimated = () => {
				// If the animation settings aren't set, set the default.
				if (ssc?.sscAnimated !== true) {
					updateAnimation('sscAnimation', {
						sscAnimated: !sscAnimated,
					});
				}
			};

			return (
				<Fragment>
					<BlockEdit {...props} />
					<InspectorControls>
						<PanelBody
							initialOpen={true}
							icon={seen}
							title={__('Screen Control')}
						>
							{isSelected && (
								<>
									<ToggleControl
										// ENABLE ANIMATION
										label={__('Animated')}
										checked={sscAnimated}
										onChange={toggleAnimated}
										help={
											sscAnimated
												? __(
														'Please choose an animation from the select input below.'
												  )
												: __('Not Animated.')
										}
									/>

									{sscAnimated && (
										<>
											<SelectControl
												label={
													'Choose an animation type for ' +
													name.split('/').pop()
												}
												value={sscAnimationType}
												options={
													animationTypes as SSCAnimationScene[]
												}
												onChange={(newType) => {
													console.log(newType)
													updateAnimation(newType)
												}}
											></SelectControl>

											<ToggleControl
												label={__('Reiterate')}
												checked={
													sscAnimationOptions?.reiterate ||
													true
												}
												onChange={() =>
													setOption(
														!sscAnimationOptions.reiterate,
														'reiterate'
													)
												}
											/>

											{sscAnimationType &&
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
															label={__(
																'Delay (ms)'
															)}
															value={
																sscAnimationOptions.delay
															}
															onChange={(e) =>
																setOption(
																	e,
																	'delay'
																)
															}
															min={0}
															max={10000}
															step={10}
														/>
														<RangeControl
															label={__(
																'Duration (ms)'
															)}
															value={
																sscAnimationOptions.duration
															}
															onChange={(e) =>
																setOption(
																	e,
																	'duration'
																)
															}
															min={0}
															max={10000}
															step={10}
														/>
														<SelectControl
															label={'Easing'}
															value={
																sscAnimationOptions.easing
															}
															options={
																sscAnimationType !==
																'sscAnimation'
																	? animationEasings
																	: cssAnimationsEasings
															}
															onChange={(e) =>
																setOption(
																	e,
																	'easing'
																)
															}
														></SelectControl>
													</>
												)}

											{sscAnimationType ===
												'sscSequence' && (
												<ActionList
													data={
														sscAnimationOptions.scene
													}
													type={sscAnimationType}
													onSave={pullScene}
												/>
											)}

											{sscAnimationType === 'ssc360' && (
												<>
													<TextControl
														label={'Spin ratio'}
														type={'number'}
														value={
															sscAnimationOptions.spinRatio ||
															1
														}
														onChange={(e) =>
															setOption(
																e,
																'spinRatio'
															)
														}
													/>

													<SelectControl
														label={'Controls'}
														value={
															sscAnimationOptions.control
														}
														onChange={(e) =>
															setOption(
																e,
																'control'
															)
														}
														options={[
															{
																label: 'Pointer position',
																value: 'pointer',
															},
															{
																label: 'Drag',
																value: 'drag',
															},
														]}
													/>
												</>
											)}

											{[
												'sscVideoParallax',
												'sscVideoScroll',
											].includes(sscAnimationType) && (
												<>
													<RangeControl
														label={'Playback Ratio'}
														value={
															sscAnimationOptions.playbackRatio ||
															1
														}
														min={0}
														max={10}
														step={0.1}
														onChange={(e) =>
															setOption(
																e,
																'playbackRatio'
															)
														}
													/>
												</>
											)}

											{sscAnimationType ===
												'sscParallax' && (
												<>
													<TextControl
														label={
															'The speed of the parallaxed object (expressed in pixels - negative value enabled)'
														}
														type={'number'}
														value={
															sscAnimationOptions.speed
														}
														onChange={(e) =>
															setOption(
																e,
																'speed'
															)
														}
													/>
													<SelectControl
														label={'Direction'}
														value={
															sscAnimationOptions.direction
														}
														onChange={(e) =>
															setOption(
																e,
																'direction'
															)
														}
														options={[
															{
																label: 'vertical',
																value: 'y',
															},
															{
																label: 'horizontal',
																value: 'x',
															},
														]}
													/>
													<TextControl
														label={'Level'}
														type={'number'}
														value={
															sscAnimationOptions.level
														}
														onChange={(e) =>
															setOption(
																e,
																'level'
															)
														}
													/>
													<TextControl
														label={'Motion (in ms)'}
														type={'number'}
														value={
															sscAnimationOptions.motion
														}
														onChange={(e) =>
															setOption(
																e,
																'motion'
															)
														}
													/>
												</>
											)}

											{sscAnimationType ===
												'sscAnimation' && (
												<>
													<SelectControl
														label={
															'Entering animation name'
														}
														options={animationList}
														value={
															sscAnimationOptions.animationEnter
														}
														onChange={(e) =>
															setOption(
																e,
																'animationEnter'
															)
														}
													/>
													<SelectControl
														label={
															'Exiting animation name (checkout animate.css)'
														}
														options={animationList}
														value={
															sscAnimationOptions.animationLeave
														}
														onChange={(e) =>
															setOption(
																e,
																'animationLeave'
															)
														}
													/>
													<SelectControl
														label={'Stagger'}
														value={
															sscAnimationOptions.stagger
														}
														onChange={(e) =>
															setOption(
																e,
																'stagger'
															)
														}
														options={[
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
														]}
													/>
												</>
											)}
											{sscAnimationType ===
												'sscTextStagger' && (
												<>
													<SelectControl
														label={'preset'}
														options={
															textStaggerPresetsNames
														}
														value={
															sscAnimationOptions.preset
														}
														onChange={(e) =>
															setOption(
																e,
																'preset'
															)
														}
													/>
													<SelectControl
														label={'Split by'}
														value={
															sscAnimationOptions.splitBy
														}
														onChange={(e) =>
															setOption(
																e,
																'splitBy'
															)
														}
														options={[
															{
																label: 'Letter',
																value: 'letter',
															},
															{
																label: 'Word',
																value: 'word',
															},
														]}
													/>
												</>
											)}
											{sscAnimationType &&
												[
													'sscSvgPath',
													'sscSequence',
													'sscAnimation',
													'sscScrollJacking',
													'sscTextStagger',
												].includes(
													sscAnimationType
												) && (
													<>
														<RangeControl
															label={
																'Viewport Minimum Active Zone (%)'
															}
															value={
																sscAnimationOptions.intersection ||
																80
															}
															onChange={(e) =>
																setOption(
																	e,
																	'intersection'
																)
															}
														/>
													</>
												)}

											{sscAnimationType ===
												'sscCounter' && (
												<SelectControl
													label={'Target'}
													value={
														sscAnimationOptions.target
													}
													onChange={(e) =>
														setOption(e, 'target')
													}
													options={[
														{
															label: 'Number',
															value: 'number',
														},
														{
															label: 'Word',
															value: 'word',
														},
													]}
												/>
											)}

											{sscAnimationType ===
												'sscScreenJump' && (
												<SelectControl
													label={'Target'}
													value={
														sscAnimationOptions.target
													}
													onChange={(e) =>
														setOption(e, 'target')
													}
													options={[
														{
															label: 'Next View',
															value: 'none',
														},
														{
															label: 'Anchor',
															value: 'anchor',
														},
													]}
												/>
											)}

											{sscAnimationType ===
												'sscScrollTimeline' && (
												<>
													<RangeControl
														label={
															'Duration (height in px)'
														}
														value={
															sscAnimationOptions.duration
														}
														onChange={(e) =>
															setOption(
																e,
																'duration'
															)
														}
														min={100}
														step={10}
														max={10000}
													/>
													<RangeControl
														label={
															'triggerHook (0:top - 1:bottom)'
														}
														value={
															sscAnimationOptions.triggerHook
														}
														onChange={(e) =>
															setOption(
																e,
																'triggerHook'
															)
														}
														min={0}
														step={0.01}
														max={1}
													/>
												</>
											)}
										</>
									)}
								</>
							)}
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		};
	},
	'withAdvancedControls'
);

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	actionsTemplate,
	animationTypes,
	animationList,
	textStaggerPresets,
	animationEasings,
} from './data';
import './editor.scss';

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	useSortable,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
	TextControl,
	Icon,
	TextareaControl,
} from '@wordpress/components';

import classnames from 'classnames';

class MyPointerSensor extends PointerSensor {
	static activators = [
		{
			eventName: 'onPointerDown',
			handler: ( { nativeEvent: event } ) => {
				if (
					! event.isPrimary ||
					event.button !== 0 ||
					isInteractiveElement( event.target )
				) {
					return false;
				}

				return true;
			},
		},
	];
}

function isInteractiveElement( element ) {
	const interactiveElements = [
		'button',
		'input',
		'textarea',
		'select',
		'option',
		'span',
	];
	return interactiveElements.includes( element.tagName.toLowerCase() );
}

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	//check if object exists for old Gutenberg version compatibility
	//add allowedBlocks restriction
	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			initialCSS: {
				type: 'string',
				default: '',
			},
			sscAnimated: {
				type: 'boolean',
				default: false,
			},
			sscReiterate: {
				type: 'boolean',
				default: false,
			},
			sscAnimationType: {
				type: 'string',
				default: false,
			},
			sscAnimationOptions: {
				type: 'object',
				default: {},
			},
		} );
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'sscEditor/add-attributes',
	addAttributes
);

const HandleIcon = wp.element.createElement(
	'svg',
	{
		width: 20,
		height: 20,
		color: '#666',
	},
	wp.element.createElement( 'path', {
		d: 'M7.542 16.667Q6.833 16.667 6.333 16.167Q5.833 15.667 5.833 14.958Q5.833 14.25 6.333 13.75Q6.833 13.25 7.542 13.25Q8.25 13.25 8.75 13.75Q9.25 14.25 9.25 14.958Q9.25 15.667 8.75 16.167Q8.25 16.667 7.542 16.667ZM7.542 11.708Q6.833 11.708 6.333 11.208Q5.833 10.708 5.833 10Q5.833 9.292 6.333 8.792Q6.833 8.292 7.542 8.292Q8.25 8.292 8.75 8.792Q9.25 9.292 9.25 10Q9.25 10.708 8.75 11.208Q8.25 11.708 7.542 11.708ZM7.542 6.75Q6.833 6.75 6.333 6.25Q5.833 5.75 5.833 5.042Q5.833 4.333 6.333 3.833Q6.833 3.333 7.542 3.333Q8.25 3.333 8.75 3.833Q9.25 4.333 9.25 5.042Q9.25 5.75 8.75 6.25Q8.25 6.75 7.542 6.75ZM12.458 6.75Q11.75 6.75 11.25 6.25Q10.75 5.75 10.75 5.042Q10.75 4.333 11.25 3.833Q11.75 3.333 12.458 3.333Q13.167 3.333 13.667 3.833Q14.167 4.333 14.167 5.042Q14.167 5.75 13.667 6.25Q13.167 6.75 12.458 6.75ZM12.458 11.708Q11.75 11.708 11.25 11.208Q10.75 10.708 10.75 10Q10.75 9.292 11.25 8.792Q11.75 8.292 12.458 8.292Q13.167 8.292 13.667 8.792Q14.167 9.292 14.167 10Q14.167 10.708 13.667 11.208Q13.167 11.708 12.458 11.708ZM12.458 16.667Q11.75 16.667 11.25 16.167Q10.75 15.667 10.75 14.958Q10.75 14.25 11.25 13.75Q11.75 13.25 12.458 13.25Q13.167 13.25 13.667 13.75Q14.167 14.25 14.167 14.958Q14.167 15.667 13.667 16.167Q13.167 16.667 12.458 16.667Z',
	} )
);

function ActionRow( props ) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable( { id: props.id } );

	const style = {
		transform: CSS.Transform.toString( transform ),
		transition,
	};

	return (
		<div
			className={ 'row' }
			ref={ setNodeRef }
			style={ style }
			{ ...attributes }
			{ ...listeners }
		>
			<Icon
				icon={ HandleIcon }
				style={ { height: 'auto', padding: '4px 0', width: '30px' } }
			/>
			<div className={ 'col' }>
				<SelectControl
					name={ 'action' }
					value={ props.action }
					options={ props.actionList }
					id={ props.id + '-action' }
					onChange={ ( e ) =>
						props.handleChange( e, {
							id: props.id,
							changed: 'action',
							action: props.action,
							value: props.value,
						} )
					}
				></SelectControl>
				<TextControl
					name={ 'value' }
					value={ props.value }
					id={ props.id + '-value' }
					onChange={ ( e ) =>
						props.handleChange( e, {
							id: props.id,
							changed: 'value',
							action: props.action,
							value: props.value,
						} )
					}
				/>
			</div>
			<Button
				icon={ 'remove' }
				onClick={ () => props.removeAction( props.id ) }
			/>
		</div>
	);
}

function ActionList( props ) {
	const [ animationProps, setAnimationProps ] = useState( props.data || [] );

	const sensors = useSensors(
		useSensor( MyPointerSensor ),
		useSensor( KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		} )
	);

	const provideSelectOptions = ( array, label, value ) => {
		return array.map( ( item ) => {
			return { label: item[ label ], value: item[ value ] };
		} );
	};

	const wrapperStyle = { margin: '24px 0', position: 'relative' };

	function handleDragEnd( event ) {
		const { active, over } = event;

		if ( active.id !== over.id ) {
			setAnimationProps( ( items ) => {
				const oldIndex = items
					.map( ( o ) => o.id )
					.indexOf( active.id );
				const newIndex = items.map( ( x ) => x.id ).indexOf( over.id );

				return arrayMove( items, oldIndex, newIndex );
			} );
		}
	}

	const addAction = () => {
		const newID = animationProps.length
			? Math.max( ...animationProps.map( ( x ) => x.id ) ) + 1
			: 1;
		setAnimationProps( [
			...animationProps.concat( {
				id: newID,
				key: newID,
				action: actionsTemplate[ 0 ].action,
				value: actionsTemplate[ 0 ].valueDefault,
			} ),
		] );
		props.func( animationProps );
	};

	function removeAction( id ) {
		const selectedItem = animationProps.map( ( x ) => x.id ).indexOf( id );

		const newAnimationProps = [
			...animationProps.slice( 0, selectedItem ),
			...animationProps.slice( selectedItem + 1 ),
		];
		props.func( newAnimationProps );
		setAnimationProps( [ ...newAnimationProps ] );
	}

	function handleChange( ev, data ) {
		const newAnimationProps = animationProps;
		const selectedItem = animationProps
			.map( ( x ) => x.id )
			.indexOf( data.id );
		if ( data.changed === 'action' ) {
			newAnimationProps[ selectedItem ].action = ev;
			newAnimationProps[ selectedItem ].value = actionsTemplate.find(
				( item ) => item.action === ev
			).valueDefault;
		} else if ( data.changed === 'value' ) {
			newAnimationProps[ selectedItem ].value = ev;
		}
		props.func( newAnimationProps );
		setAnimationProps( [ ...newAnimationProps ] );
	}

	return (
		<section>
			<p>Action Sequence</p>
			<DndContext
				sensors={ sensors }
				collisionDetection={ closestCenter }
				onDragEnd={ handleDragEnd }
				style={ wrapperStyle }
			>
				<SortableContext
					items={ animationProps }
					strategy={ verticalListSortingStrategy }
				>
					{ animationProps.map( ( action ) => (
						<ActionRow
							className="row"
							key={ action.key }
							id={ action.id }
							action={ action.action }
							value={ action.value || action.defaultValue }
							actionList={ provideSelectOptions(
								actionsTemplate,
								'actionLabel',
								'action'
							) }
							style={ { display: 'flex' } }
							removeAction={ removeAction }
							handleChange={ handleChange }
						/>
					) ) }
				</SortableContext>
			</DndContext>
			<Button onClick={ addAction } icon={ 'insert' }>
				Add action
			</Button>
		</section>
	);
}

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			setAttributes,
			isSelected,
			className,
			attributes: {
				initialCSS,
				sscAnimated,
				sscReiterate,
				sscAnimationType,
				sscAnimationOptions,
			},
		} = props;

		// get default setting
		const getDefaults = ( opt ) => {
			const animationType = animationTypes.filter( ( animation ) => {
				return animation.value === opt;
			} );
			return animationType[ 0 ].default || {};
		};

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
											onChange={ ( e ) =>
												updateAnimation( e )
											}
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

										{ [
											'sscSvgPath',
											'sscSequence',
											'sscVideoFocusPlay',
											'sscScreenJacker',
											'sscCounter',
											'sscTextStagger',
										].includes( sscAnimationType ) && (
											<>
												<RangeControl
													label={ 'Duration (ms)' }
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
													options={ animationEasings }
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
													label={ 'Motion (in ms)' }
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
										{ sscAnimationType === 'sscAnimation' &&
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
															].position
														}
														onChange={ ( e ) =>
															setOption(
																e,
																'position',
																sscAnimationType
															)
														}
													/>
												</>
											) }
										{ sscAnimationType ===
											'sscTextStagger' &&
											sscAnimationOptions[
												sscAnimationType
											] && (
												<>
													<SelectControl
														label={ 'preset' }
														options={ Object.keys(
															textStaggerPresets
														) }
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
												</>
											) }
										{ sscAnimationType ===
											'sscScreenJacker' &&
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
										<p>
											{ JSON.stringify(
												sscAnimationOptions
											) }
										</p>
									</>
								) }
							</>
						) }
						<TextareaControl
							label={ __( 'Initial CSS' ) }
							value={ initialCSS || '' }
							className={ 'ssc-codebox' }
							onChange={ ( attr ) =>
								setAttributes( {
									initialCSS: attr,
								} )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withAdvancedControls' );

addFilter(
	'editor.BlockEdit',
	'sscEditor/with-advanced-controls',
	withAdvancedControls
);

function dataStringify( data, type ) {
	let csv = '';

	csv += Object.entries( data )
		.map( ( item ) => {
			if ( type === 'sequence' ) {
				return item[ 1 ].action + ':' + item[ 1 ].value;
			}
			// delete data.steps;
			return ! data.steps ? item[ 0 ] + ':' + item[ 1 ] : null;
		} )
		.join( ';' );
	return csv || null;
}

function cssize( style ) {
	// split css rule and
	// remove line breaks
	style = style.replace( /(\r\n|\n|\r)/gm, '' );
	const styleParsed = style.split( ';' ).filter( ( element ) => element );

	if ( ! styleParsed ) {
		return false;
	}

	// parse each css rule gathered
	const Styleraw = [];
	styleParsed.forEach( ( rule ) => Styleraw.push( rule.split( ':' ) ) );

	const Stylejs = {};
	Styleraw.forEach( ( rule ) => ( Stylejs[ rule[ 0 ] ] = rule[ 1 ] ) );

	return Stylejs;
}

/**
 * Add custom element class in save element.
 *
 * @param {Object} extraProps Block element.
 * @param {Object} blockType  Blocks object.
 * @param {Object} attributes Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
const addExtraProps = ( extraProps, blockType, attributes ) => {
	const {
		initialCSS,
		sscAnimated,
		sscReiterate,
		sscAnimationType,
		sscAnimationOptions,
	} = attributes;

	if ( sscAnimated && sscAnimationType ) {
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
		const initialStyle = initialCSS ? cssize( initialCSS ) : [];

		// element classes
		const classes = sscAnimated ? 'ssc' : '';

		return Object.assign( extraProps, {
			className: classnames( extraProps.className, classes ),
			style: { ...initialStyle, ...CustomStyle, ...extraProps.style },
		} );
	}

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'sscEditor/addExtraProps',
	addExtraProps
);

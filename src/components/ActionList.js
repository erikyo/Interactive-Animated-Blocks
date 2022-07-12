import {
	Button,
	Icon,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
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
import { actionsTemplate } from '../utils/data';

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
			className={ 'ssc-row ' + props.action }
			ref={ setNodeRef }
			style={ style }
			{ ...attributes }
			{ ...listeners }
		>
			<Icon icon={ HandleIcon } />
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

export function ActionList( props ) {
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
			props.onSave( animationProps );
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
		props.onSave( animationProps );
	};

	function removeAction( id ) {
		const selectedItem = animationProps.map( ( x ) => x.id ).indexOf( id );

		const newAnimationProps = [
			...animationProps.slice( 0, selectedItem ),
			...animationProps.slice( selectedItem + 1 ),
		];
		setAnimationProps( [ ...newAnimationProps ] );
		props.onSave( newAnimationProps );
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
		setAnimationProps( [ ...newAnimationProps ] );
		props.onSave( newAnimationProps );
	}

	return (
		<section className={ 'action-sequence' }>
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
							className="ssc-row"
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
			<Button
				onClick={ addAction }
				icon={ 'insert' }
				variant={ 'secondary' }
				className={ 'add-new' }
			>
				Add action
			</Button>
		</section>
	);
}

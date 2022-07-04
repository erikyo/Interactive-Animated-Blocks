import { useEffect } from '@wordpress/element';
import { EditorView, basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import { TextareaControl } from '@wordpress/components';
// import {StyleModule} from 'style-mod'

export const CodeBox = ( props, attributes ) => {
	function editorFromTextArea( textarea, extensions ) {
		const view = new EditorView( {
			doc: textarea.value,
			extensions,
		} );
		textarea.parentNode.insertBefore( view.dom, textarea );
		//textarea.style.display = 'none';
		if ( textarea.form )
			textarea.addEventListener( 'keydown', function () {
				console.log( view.state.doc );
				textarea.innetHTML = view.state.doc.toString();
			} );
		return view;
	}

	useEffect( () => {
		const textarea = document.querySelector( '#code-editor' );
		return editorFromTextArea( textarea, [ basicSetup, css() ] );
	}, [] );

	return (
		<>
			<h3>Css Editor</h3>
			<TextareaControl { ...props } { ...attributes } id="code-editor" />
		</>
	);
};

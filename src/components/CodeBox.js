import { useEffect } from '@wordpress/element';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { css } from '@codemirror/lang-css';
import { json, jsonParseLinter, jsonLanguage } from '@codemirror/lang-json';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { lintGutter, linter, lintKeymap } from '@codemirror/lint';

import {
	parseCSS,
	lintCSS,
} from '../utils/fn';

export const CodeBox = ( props ) => {
	const { language, onKeyChange } = props;

	const editorFromTextArea = () => {
		const parent = document.getElementById( 'codebox-' + language );
		if ( language === 'css' ) {
			/**
			 * CSS
			 */
			// prepare css code
			const thisStyle = lintCSS( props.data );

			/** init css codemirror editor */
			const view = new EditorView( {
				doc: thisStyle,
				extensions: [
					basicSetup,
					EditorState.tabSize.of( 2 ),
					css(),
					syntaxHighlighting( defaultHighlightStyle ),
					keymap.of( [
						...defaultKeymap, indentWithTab, ...lintKeymap,
					] ),
				],
				parent,
			} );

			/**
			 * Listening for keydown events, if any changes parse and update the current CSS.
			 */
			view.dom.addEventListener( 'keyup', function() {
				const currentCSS = view.state.doc.toString();
				const style = parseCSS( currentCSS );
				if ( style && style !== currentCSS ) {
					onKeyChange( style );
				}
			} );
		} else if ( language === 'json' ) {
			/**
			 * JSON
			 */
			const thisJson = JSON.stringify( props.data, null, '\t' );

			/** init json codemirror editor */
			const view = new EditorView( {
				doc: thisJson,
				extensions: [
					linter( jsonParseLinter() ),
					lintGutter(),
					basicSetup,
					EditorState.tabSize.of( 2 ),
					json(),
					syntaxHighlighting( defaultHighlightStyle ),
					keymap.of( [
						...defaultKeymap, indentWithTab, ...lintKeymap,
					] ),
				],
				parent,
			} );

			/**
			 * Listening for keyboard events,
			 * if any changes parse and update the current json.
			 */
			view.dom.addEventListener( 'keyup', function() {
				const resultRaw = view.state.doc.toString();

				try {
					parent.style.borderLeft = 'none';
					onKeyChange( JSON.parse( resultRaw ) );
				} catch ( err ) {
					// 👇️ SyntaxError: Unexpected end of JSON input
					parent.style.borderLeft = '3px solid red';
				}
			} );
		}
	};

	useEffect( () => {
		return editorFromTextArea();
	}, [] );

	return null;
};

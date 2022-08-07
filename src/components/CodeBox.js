import { useEffect } from '@wordpress/element';
import { basicSetup } from 'codemirror';
import { keymap, EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { css, cssLanguage } from '@codemirror/lang-css';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { lintGutter, linter, lintKeymap } from '@codemirror/lint';

import {
	parseCSS,
	lintCSS,
} from '../utils/fn';

export const CodeBox = ( props ) => {
	const { language, onKeyChange } = props;

	// codemirror settings
	const editorSettings = {
		tabSize: 2,
	};

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
				...editorSettings,
				doc: thisStyle,
				extensions: [
					basicSetup,
					EditorState.tabSize.of( 2 ),
					keymap.of( [ indentWithTab, defaultKeymap, lintKeymap, cssLanguage ] ),
					css(),
				],
				parent,
			} );

			/**
			 * Listening for keydown events, if any changes parse and update the current CSS.
			 */
			view.dom.addEventListener( 'keydown', function() {
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
				...editorSettings,
				doc: thisJson,
				extensions: [
					linter( jsonParseLinter() ),
					lintGutter(),
					basicSetup,
					json(),
					EditorState.tabSize.of( 2 ),
					keymap.of( [
						indentWithTab, defaultKeymap, lintKeymap,
					] ),
				],
				parent,
			} );

			/**
			 * Listening for keyboard events,
			 * if any changes parse and update the current json.
			 */
			view.dom.addEventListener( 'keyup', function() {
				let resultRaw = view.state.doc.toString();

				try {
					resultRaw = JSON.parse( resultRaw );
					parent.style.borderLeft = 'none';
					onKeyChange( resultRaw );
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

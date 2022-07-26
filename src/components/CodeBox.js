import { useEffect } from '@wordpress/element';
import { basicSetup } from 'codemirror';
import { keymap, EditorView } from '@codemirror/view';
import { css } from '@codemirror/lang-css';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { linter, lintKeymap } from '@codemirror/lint';

import {
	autoLintCode,
	css2obj,
	loDashToCapital,
	styleObj2String,
} from '../utils/fn';

export const CodeBox = ( props ) => {
	const { language } = props;

	// codemirror settings
	const editorSettings = {
		tabSize: 2,
	};

	function lintCSS( style ) {
		return style && Object.keys( style ).length
			? 'this {\n' + autoLintCode( styleObj2String( style ) ) + ';\n}'
			: 'this {\n\t\n}';
	}

	const editorFromTextArea = () => {
		const parent = document.getElementById( 'codebox-' + language );
		const linterExtension = linter( jsonParseLinter() );
		/*
		 * CSS
		 * */
		if ( language === 'css' ) {
			const thisStyle = lintCSS( props.data );
			const view = new EditorView( {
				...editorSettings,
				doc: thisStyle,
				extensions: [
					basicSetup,
					keymap.of( [ indentWithTab, defaultKeymap, lintKeymap ] ),
					css(),
				],
				parent,
			} );

			view.dom.addEventListener( 'keydown', function () {
				let result = view.state.doc.toString().replaceAll( '\n', '' );
				result = result.match( 'this {(.*?)}' )[ 1 ];
				if ( result )
					return props.onChange(
						css2obj( loDashToCapital( result ) )
					);
			} );
		} else if ( language === 'json' ) {
			/*
			 * JSON
			 * */
			const thisJson = JSON.stringify( props.data, null, '\t' );
			const view = new EditorView( {
				...editorSettings,
				doc: thisJson,
				theme: 'mdn-like',
				gutters: [ 'CodeMirror-lint-markers' ],
				extensions: [
					basicSetup,
					keymap.of( [ indentWithTab, defaultKeymap, lintKeymap ] ),
					json(),
					linterExtension,
				],
				parent,
			} );

			view.dom.addEventListener( 'keydown', function () {
				const resultRaw = view.state.doc.toString();
				try {
					const result = JSON.parse( resultRaw );
					parent.style.borderLeft = '3px solid green';
					return props.onChange( result );
				} catch ( err ) {
					// 👇️ SyntaxError: Unexpected end of JSON input
					parent.style.borderLeft = '3px solid red';
					console.log( 'error', err, resultRaw );
				}
			} );
		}
	};

	useEffect( () => {
		return editorFromTextArea();
	}, [] );

	return null;
};

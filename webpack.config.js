const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

const entry = {};
[ 'ssc', 'ssc-editor' ].forEach(
	( script ) =>
		( entry[ script ] = path.resolve(
			process.cwd(),
			`src/${ script }.js`
		) )
);

module.exports = {
	...defaultConfig,
	entry,
};

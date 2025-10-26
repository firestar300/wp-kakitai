const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const webpack = require( 'webpack' );

module.exports = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		fallback: {
			path: require.resolve( 'path-browserify' ),
			zlib: require.resolve( 'browserify-zlib' ),
			stream: require.resolve( 'stream-browserify' ),
			buffer: require.resolve( 'buffer/' ),
			util: require.resolve( 'util/' ),
			fs: false,
		},
	},
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin( {
			patterns: [
				{
					from: 'node_modules/kuromoji/dict',
					to: 'dict',
				},
			],
		} ),
		// Make Buffer globally available
		new webpack.ProvidePlugin( {
			Buffer: [ 'buffer', 'Buffer' ],
			process: 'process/browser',
		} ),
	],
};

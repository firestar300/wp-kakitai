const CopyPlugin = require("copy-webpack-plugin");
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    new CopyPlugin({
      patterns: [
        { from: 'src/data/kanji-furigana.json' },
      ],
    }),
  ],
};

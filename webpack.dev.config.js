const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const rootAssetPath = './src';

module.exports = {
  devtool: 'eval',
  entry: {
    // Chunks (files) that will get written out for JS and CSS files.
    app_js: [
      'webpack/hot/dev-server',
      `${rootAssetPath}/index`,
    ],
    app_css: [
      `${rootAssetPath}/styles/base`,
      `${rootAssetPath}/styles/app/app`,
      `${rootAssetPath}/styles/viz/viz`,
    ],
    topics_css: [
      `${rootAssetPath}/styles/topics/topics`,
    ],
    sources_css: [
      `${rootAssetPath}/styles/sources/sources`,
    ],
  },
  output: {
    // Where and how will the files be formatted when they are output.
    path: './build/public',
    pathinfo: true,
    publicPath: 'http://localhost:2992/src/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
  },
  resolve: {
    // Avoid having to require files with an extension if they are here.
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: rootAssetPath,
        loader: 'eslint',
      },
    ],
    // Various loaders to pre-process files of specific types.
    loaders: [
      {
        test: /\.js?$/i,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
        // loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap'),
      },
      {
        test: /\.css$/i,
        loader: 'style!css?modules',
        include: /flexboxgrid/,
      },
      {
        test: /\.(jpe?g|png|gif|svg([\?]?.*))$/i,
        loaders: [
          `file?context=${rootAssetPath}&name=[path][name].[hash].[ext]`,
          'image?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },
  eslint: {
    useEslintrc: true,
  },
  postcss: [autoprefixer],  // add in all the browser-specific vendor prefixes to CSS rules automatically
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
    // Stop modules with syntax errors from being emitted.
    new webpack.NoErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
    // Ensure CSS chunks get written to their own file.
    new ExtractTextPlugin('[name].[chunkhash].css'),
    // Create the manifest file that Flask and other frameworks use.
    new ManifestRevisionPlugin(path.join('build', 'manifest.json'), {
      rootAssetPath,
    }),
  ],
};

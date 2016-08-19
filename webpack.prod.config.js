const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const rootAssetPath = './src';

module.exports = {
  bail: true,
  devtool: 'source-map',
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
    path: './server/static/gen',
    publicPath: '/static/gen/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].[chunkhash:8].chunk.js',
  },
  resolve: {
    // Avoid having to require files with an extension if they are here.
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: path.join(__dirname, 'src'),
      },
    ],
    // Various loaders to pre-process files of specific types.
    // If you wanted to SASS for example, you'd want to install this:
    //   https://github.com/jtangelder/sass-loader
    loaders: [
      {
        test: /\.js?$/i,
        loader: 'babel',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?sourceMap'),
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
  postcss: () => [autoprefixer],
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new HtmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    // Stop modules with syntax errors from being emitted.
    // new webpack.NoErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
    // Ensure CSS chunks get written to their own file.
    new ExtractTextPlugin('[name].[chunkhash:8].css'),
    // Create the manifest file that Flask and other frameworks use.
    new ManifestRevisionPlugin(path.join('server', 'static', 'gen', 'manifest.json'), {
      rootAssetPath,
    }),
  ],
};

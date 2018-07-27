/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// many of the webpack directives need an absolute path
const basedir = path.resolve(__dirname, '../');

// be smart about output based on dev or not
// const devMode = process.env.NODE_ENV !== 'production';

const baseConfig = {
  entry: {
    // the entrypoint for shared CSS used across all the apps
    common_css: [path.resolve(basedir, 'src', 'styles', 'app', 'app.scss')],
  },
  plugins: [
    // needed this to get eslint working for some reason
    new webpack.LoaderOptionsPlugin({ options: {} }),
    // this writes a file for our Flask server to read (pointing at the compiled JS)
    new ManifestRevisionPlugin(
      path.resolve(basedir, 'build', 'manifest.json'), // keep this path in sync with FlaskWebpack config
      { rootAssetPath: './src' } // important that this be relative, not absolute
    ),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
  ],
  module: {
    rules: [
      { // run linting check on all the javascript code before trying to compile it
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // we don't want to check the imported packages for formatting
        use: 'eslint-loader', // use eslint as the engine for checking linting
      },
      { // compile all our javascript code
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // we don't want to recompile the imported packages
        use: {
          loader: 'babel-loader', // run all the code through bable to transpile it down to vanilla JS
          // don't put options here; otherwise they override what is in the .babelrc
        },
      },
      { // turn all the sass into regular CSS
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader, // tell it to compile CSS, not JS
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
};

const devConfig = {
  // tells Webpack to do some stuff, including setting NODE_ENV
  mode: 'development',
  // gnerate source maps to help debug in browser
  devtool: 'source-map',
  // where to build dev files to for webpack-serve to work
  output: {
    path: path.resolve(basedir, 'build', 'public'),
    pathinfo: true,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
    publicPath: 'http://localhost:2992/', // needed to get correct path in dev manifest file
  },
};

const explorerConfig = {
  entry: {
    // the entry point for the explorer tool
    app_js: [path.resolve(basedir, 'src', 'explorerIndex.js')],
    // the entry point for explorer-specific style sheets
    app_css: [path.resolve(basedir, 'src', 'styles', 'explorer', 'explorer.scss')],
  },
};

module.exports = merge.smart(baseConfig, devConfig, explorerConfig);

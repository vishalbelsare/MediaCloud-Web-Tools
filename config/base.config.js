/* eslint import/no-extraneous-dependencies: 0 */

const path = require('path');
const webpack = require('webpack');
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
const merge = require('webpack-merge');

// many of the webpack directives need an absolute path
const basedir = path.resolve(__dirname, '../');

const baseConfig = {
  entry: {
    // the entrypoint for shared CSS used across all the apps
    app_css: [path.resolve(basedir, 'src', 'styles', 'app', 'app.scss')],
  },
  output: {
    path: path.resolve(basedir, 'build', 'public'),
    filename: '[name].[hash:8].js',
  },
  plugins: [
    // needed this to get eslint working for some reason
    new webpack.LoaderOptionsPlugin({ options: {} }),
    // this writes a file for our Flask server to read (pointing at the compiled JS)
    new ManifestRevisionPlugin(
      path.resolve(basedir, 'build', 'manifest.json'),
      { rootAssetPath: './src' } // important that this be relative, not absolute
    ),
  ],
  module: {
    rules: [
      { // run linting check on all the javascript code before trying to compile it
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      },
      { // transpile the javascript code with babel
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // don't put options here; otherwise they override what is in the .babelrc
        },
      },
      { // turn all the sass into regular CSS
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
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

import Config from 'webpack-config';

export default new Config().extend('config/webpack.dev.config.babel.js').merge({

  entry: {
    app_js: [
      './src/topicsIndex',
    ],
    app_css: [
      './src/styles/topics/topics',
    ],
  },

});

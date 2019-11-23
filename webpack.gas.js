/* eslint-disable */

var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry:{
      lib:'./src/index.js'
  },
  output:
  {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'AppLib'
  },
  module:
  {
  rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage'
                  }
                ]
              ]
            }
          }
        }
      ]
  },
  plugins: [
    new CopyPlugin([
        'src/api.js',
        'appsscript.json',
        '.clasp.json'
      ])
  ]
};

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'xenogl.min.js',
    path: path.resolve('build'),
    library: "XenoGL",
    libraryTarget: "window",
  },
  plugins: [
    new webpack.DefinePlugin({'process.env': { NODE_ENV: JSON.stringify('production') }}),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
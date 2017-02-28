const path = require('path');

module.exports = {
  entry: './js/index.jsx',
  output: {
    filename: 'bundle.js',
    path: './public'
  },
  module: {
    rules: [
      {test: /\.jsx$/, use: 'babel-loader'}
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"],
    modules: [
      "node_modules",
      path.resolve('./js')
    ]
  },
  devtool: "source-map"
}

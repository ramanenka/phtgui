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
  devtool: "source-map"
}

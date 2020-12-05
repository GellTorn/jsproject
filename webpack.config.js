const path = require('path');

module.exports = [
  {
    entry: path.resolve(__dirname, 'dist/src/Game.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    devServer: {
      contentBase: '.',
      port: 80,
    } 
  },
  {
    entry: path.resolve(__dirname, 'dist/demo/demo1/js/main.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'demo1.js',
    }
  }
];
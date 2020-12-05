const path = require('path');

module.exports = [
  // {
  //   entry: __dirname + '/dist/Game.js',
  //   output: {
  //     path: __dirname + '/dist',
  //     filename: 'main.js',
  //   },
  //   devServer: {  // configuration for webpack-dev-server
  //     contentBase: '.',  //source of static assets
  //     port: 80, // port to run dev-server
  //   } 
  // },
  // {
  //   entry: __dirname + '/dist/demo1.js',
  //   output: {
  //     path: __dirname + '/dist',
  //     filename: 'demo1.js',
  //   }
  // }
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
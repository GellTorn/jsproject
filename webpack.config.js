module.exports = [
  {
    entry: __dirname + '/dist/Game.js',
    output: {
      path: __dirname + '/dist',
      filename: 'main.js',
    },
    devServer: {  // configuration for webpack-dev-server
      contentBase: '.',  //source of static assets
      port: 80, // port to run dev-server
    } 
  },
  {
    entry: __dirname + '/dist/demo1.js',
    output: {
      path: __dirname + '/dist',
      filename: 'demo1.js',
    }
  }
];
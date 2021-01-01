const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: './server/server.js',
  mode: 'production',
  target: 'node',
  externals: [nodeExternals(),
     {express: 'express'},
    {bcrypt:'bcrypt'}
 ],
  module:{rules:[{exclude:'/node_moduls/'}]},
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'server.bundle.js'
  }
};
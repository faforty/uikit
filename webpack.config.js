var webpack = require('webpack'),
    path = require('path'),
    progressBarPlugin = require('progress-bar-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

const FgYellow = '\x1b[33m'
const uikitVersion = require("./package.json").version;

console.log(FgYellow, 'Run build uiKit...', uikitVersion)

var extractCSS = new ExtractTextPlugin('/css/uiKit.css');

module.exports = {
  entry: [
    './src/vue/index.js',
    './src/scss/main.scss'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '../',
    filename: '/js/uiKit.'+uikitVersion+'.js'
  },
resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
},
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file',
        query: {
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(png|svg)$/,
        loader: 'file',
        query: {
          name: 'images/[name].[ext]?[hash]'
        }
      },
      { test: /\.scss$/i, loader: extractCSS.extract(['css!sass?indentedSyntax=true&sourceMap=true']) }
    ]
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    extractCSS,
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    // new webpack.optimize.DedupePlugin(),
    new progressBarPlugin()
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
}

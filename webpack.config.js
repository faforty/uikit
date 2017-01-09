var webpack = require('webpack'),
    path = require('path'),
    progressBarPlugin = require('progress-bar-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')
    WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const uikitVersion = require("./package.json").version;
const devMode      = process.env.NODE_ENV !== 'production';
const nodeEnv      = process.env.NODE_ENV || 'development';

const FgYellow = '\x1b[33m'
console.log(FgYellow, 'Run build uiKit...', uikitVersion)

var extractCSS = new ExtractTextPlugin('/css/uiKit.css');

module.exports = {
  entry: [
    './src/vue/index.js',
    './src/scss/main.scss'
  ],
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: devMode ? '/dist/' : '../',
    filename: '/js/uiKit.'+uikitVersion+'.js'
  },
  resolve: {
      extensions: ['', '.js', '.vue'],
      fallback: [path.join(__dirname, '../node_modules')],

      // root: path.resolve(__dirname),
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
      {
        test: /\.scss$/i,
        loader: extractCSS.extract("css-loader?sourceMap!sass-loader?sourceMap&outputStyle=compressed")
      }
    ]
  },
  // devtool: '#eval-source-map',
  plugins: [
    new WebpackBuildNotifierPlugin({
      sound: false,
      suppressSuccess: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${nodeEnv}'`
      }
    }),

    // Pack only en & ru locales
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new webpack.ContextReplacementPlugin(/validatorjs[\/\\]src[\/\\]lang$/, /en|ru/),

    extractCSS,

    new progressBarPlugin()
  ],
  devServer: {
    inline: true,
    port:   4040,
  }
}

if (!devMode) {
  module.exports.devtool = '#source-map'
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }));
  module.exports.plugins.push(new webpack.optimize.DedupePlugin());
}

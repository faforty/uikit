const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const uikitVersion = require("./package.json").version;
const devMode      = process.env.NODE_ENV !== 'production';
const nodeEnv      = process.env.NODE_ENV || 'development';

const FgYellow = '\x1b[33m';

console.log(FgYellow, 'Run build uiKit...', uikitVersion)

module.exports = {
  entry: [
    './index.js',
    './scss/main.scss'
  ],

  output: {
    path:       __dirname + '/dist/',
    publicPath: devMode ? '/dist/' : '../',
    filename:   './js/uikit.js',
  },

  resolve: {
      extensions: ['.js', '.vue']
  },

  resolveLoader: {
    modules: ["node_modules"]
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader',
        query: {
          name: '/fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(png|svg)$/,
        loader: 'file-loader',
        query: {
          name: '/images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: './css/uikit.css'
    }),

    new WebpackBuildNotifierPlugin({
      sound: false,
      suppressSuccess: true
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),

    // Pack only en & ru locales
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new webpack.ContextReplacementPlugin(/validatorjs[\/\\]src[\/\\]lang$/, /en|ru/),

    new ProgressBarPlugin()
  ],

  devtool: devMode ? '#source-map' : false,

  devServer: {
    inline: true,
    port:   4040,
    hot:    true,
  }
}

if (devMode) {
  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

if (nodeEnv === 'production') {
  module.exports.plugins.push(
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),

    new UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        dead_code: true,
        warnings: false,
        drop_console: true,
        unsafe: true,
        sequences : true,
        booleans : true,
        loops : true,
        unused: true
      },
      mangle: {
        screw_ie8: true,
      },
      comments: false,
      beautify: false,
    })
  );
}
var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist/consoleroot/js'),
    publicPath: '/dist/consoleroot/js',
    filename: 'base.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'd3$': path.resolve(__dirname, 'lib/d3.js')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      '/admin/metrics': {
        target: 'http://localhost:5000',
        secure: false
      },
      '/admin/discovery': {
        target: 'http://localhost:5000',
        secure: false
      },
      '/admin/loggers': {
        target: 'http://localhost:5000',
        secure: false
      },
      '/admin/loggerproxy/': {
        target: 'http://localhost:5000',
        secure: false,
        ws: true
      }
    }
  },
  performance: {
    hints: false
  },
  // devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // sourceMap: true,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

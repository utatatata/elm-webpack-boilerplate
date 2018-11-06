const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const PROD = 'production'
const DEV = 'development'

module.exports = (env, argv) => {
  const MODE = argv.mode === PROD ? PROD : DEV

  const common = {
    mode: MODE,
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist/assets'),
      filename: 'index.js',
      publicPath: '/assets/',
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: 'src/index.html',
        filename: '../index.html',
      }),
    ],
    resolve: {
      modules: [path.join(__dirname, 'src'), 'node_modules'],
      extensions: ['.js', '.elm'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' },
        },
      ],
    },
  }

  if (MODE === DEV) {
    console.log('Building for Development...')
    return merge(common, {
      plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      ],
      module: {
        rules: [
          {
            test: /\.elm$/,
            exclude: [/elm-stuff/, /node_modules/],
            use: [
              { loader: 'elm-hot-webpack-loader' },
              {
                loader: 'elm-webpack-loader',
                options: {
                  cwd: __dirname,
                  maxInstances: 7,
                  debug: true,
                  forceWatch: true,
                },
              },
            ],
          },
        ],
      },
      devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
        historyApiFallback: true,
        hot: true,
        port: 8080,
        stats: 'errors-only',
        watchOptions: {
          aggregateTimeout: 300,
          poll: 1000,
        },
      },
    })
  } else if (MODE === PROD) {
    console.log('Building for Production...')
    return merge(common, {
      plugins: [new CleanWebpackPlugin(['dist'], { verbose: true })],
      module: {
        rules: [
          {
            test: /\.elm$/,
            exclude: [/elm-stuff/, /node_modules/],
            use: [
              {
                loader: 'elm-webpack-loader',
                options: {
                  cwd: __dirname,
                  maxInstances: 7,
                  optimize: true,
                },
              },
            ],
          },
        ],
      },
    })
  }
}

const { DefinePlugin } = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')
const CopyPlugin = require('copy-webpack-plugin');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = path.resolve(__dirname, 'src')

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index.js')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' }
        ],
        include: [
          defaultInclude,
          path.resolve(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        include: defaultInclude
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
        include: defaultInclude
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
        include: defaultInclude
      }
    ]
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/assets/index.html'
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CopyPlugin([
      { context: './src/injectables', from: '*.js', to: 'injectables' },
    ])
  ],
  devtool: 'cheap-source-map',
  devServer: {
    writeToDisk: true,
    contentBase: path.resolve(__dirname, 'dist'),
    stats: {
      colors: true,
      chunks: false,
      children: false
    },
    before() {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' }
      )
      .on('close', code => process.exit(0))
      .on('error', spawnError => console.error(spawnError))
    }
  }
}

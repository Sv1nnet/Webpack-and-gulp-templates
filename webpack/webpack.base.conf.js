const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileLoader = require('file-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/',
}

module.exports = {
  externals: {
    path: PATHS,
  },
  entry: [
    './src/sass/main.sass',
    './src/css/main.css',
    PATHS.src,
  ], // entry points. Can be several points
  output: {
    path: PATHS.dist,  // path to output directory
    filename: `js/index.js`,  // output js file. Name will correspond with entry props names (not values)
    publicPath: '/',  // path to index.html for browsersync in dev-mode
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          outputPath: (url, resourcePath, context) => {
            const relativePath = path.relative(context, resourcePath).substr(4).split('\\').join('/');
            return relativePath;
          },
          name: '[name].[ext]',
        }
      },
      {
        test: /\.(ttf|eot|woff)$/,
        loader: 'file-loader',
        options: {
          outputPath: (url, resourcePath, context) => {
            const relativePath = path.relative(context, resourcePath).substr(4).split('\\').join('/');
            return relativePath;
          },
          name: '[name].[ext]',
        }
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: 'src/config/postcss.config.js' } },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ]
        // use: ['style-loader', 'css-loader'], // use it if you need css in header
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: PATHS.src + '/config/postcss.config.js' } },
          },
        ]
        // use: ['style-loader', 'css-loader'], // use it if you need css in header
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    // Copy HtmlWebpackPlugin and change index.html for another html page
    new HtmlWebpackPlugin({
      hash: false,
      template: `${PATHS.src}/index.html`,
      filename: './index.html',
      // inject: false, 
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/img`, to: 'img' },
      { from: `${PATHS.src}/static`, to: '' },
      // { from: `${PATHS.src}/fonts`, to: 'fonts' },
    ]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      'window.jQuery': 'jquery',
    })
  ],
};
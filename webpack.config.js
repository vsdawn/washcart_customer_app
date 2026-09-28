const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = __dirname;

// React Native libraries ship untranspiled JSX/Flow/TS, so they go through Babel too
const compileNodeModules = [
  '@react-native',
  '@react-navigation',
  'react-native-gesture-handler',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-svg',
  '@react-native-async-storage',
].map(name => path.resolve(appDirectory, 'node_modules', name));

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production';

  return {
    entry: path.resolve(appDirectory, 'index.web.js'),
    output: {
      path: path.resolve(appDirectory, 'web/dist'),
      filename: 'bundle.[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    // react-native-web apps are ~1.3 MB; the default 244 KB hint is just noise here
    performance: { hints: false },
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    resolve: {
      extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.json'],
      alias: {
        'react-native$': 'react-native-web',
        // react-native-svg expects RN's asset registry, which RN 0.87 no longer ships
        '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry',
        '@': path.resolve(appDirectory, 'src'),
      },
    },
    module: {
      rules: [
        {
          // RN libraries' ESM builds use extensionless relative imports
          test: /\.m?js$/,
          resolve: { fullySpecified: false },
        },
        {
          test: /\.[jt]sx?$/,
          include: [
            path.resolve(appDirectory, 'index.web.js'),
            path.resolve(appDirectory, 'App.tsx'),
            path.resolve(appDirectory, 'src'),
            ...compileNodeModules,
          ],
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              // Own config instead of babel.config.js: keep ES modules so webpack can bundle them
              configFile: false,
              babelrc: false,
              presets: [['module:@react-native/babel-preset', { disableImportExportTransform: true }]],
              plugins: ['@babel/plugin-transform-export-namespace-from'],
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|webp|ttf|otf)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(appDirectory, 'web/index.html') }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(isDev),
        'process.env': JSON.stringify({ NODE_ENV: isDev ? 'development' : 'production' }),
      }),
    ],
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      open: false,
    },
  };
};

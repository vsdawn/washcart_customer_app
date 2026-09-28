module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Zod 4 ships `export * as ns from` syntax
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};

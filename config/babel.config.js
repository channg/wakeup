export default {
  exclude: 'node_modules/**',
  presets: [
    [
      require.resolve('babel-preset-env'),
      { modules: false },
    ],
  ],
  plugins: [
    'babel-plugin-external-helpers'
  ].map(require.resolve),
};
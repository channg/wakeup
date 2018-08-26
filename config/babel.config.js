module.exports = {
  exclude: ['node_modules/**',
    '*.json'],
  presets: [
    [
      require.resolve('babel-preset-env'),
      {modules: false},
    ],
  ],
  plugins: [
    'babel-plugin-external-helpers'
  ].map(require.resolve)
};
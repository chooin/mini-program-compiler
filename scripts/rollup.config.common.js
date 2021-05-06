const {babel} = require('@rollup/plugin-babel');

module.exports = {
  plugins: [
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
    }),
  ],
}

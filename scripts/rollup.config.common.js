const {babel} = require('@rollup/plugin-babel');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  plugins: [
    commonjs({
      exclude: ['node_modules/**'],
    }),
    nodeResolve({
      resolveOnly: ['packages'],
      extensions: ['.ts'],
    }),
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
    }),
  ],
}

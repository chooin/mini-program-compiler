const {terser} = require('rollup-plugin-terser');
const {babel} = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
const strip = require('@rollup/plugin-strip');
import {env} from './config';

export default {
  treeshake: false,
  plugins: [
    replace({
      ...env,
      preventAssignment: true,
    }),
    strip({
      include: '**/*.(js|ts)',
      functions: ['console.*'],
    }),
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
    }),
    terser(),
  ],
};

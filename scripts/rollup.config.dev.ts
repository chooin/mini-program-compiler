const {babel} = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
import {env} from './config';

export default {
  treeshake: false,
  plugins: [
    replace({
      ...env,
      preventAssignment: true,
    }),
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
    }),
  ],
};

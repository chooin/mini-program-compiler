import esbuild from 'rollup-plugin-esbuild';
const strip = require('@rollup/plugin-strip');
import {env as define} from './config';

export default {
  treeshake: true,
  plugins: [
    strip({
      include: '**/*.(js|ts)',
      functions: ['console.*'],
    }),
    esbuild({
      exclude: ['node_modules/**'],
      minify: true,
      define,
    }),
  ],
};

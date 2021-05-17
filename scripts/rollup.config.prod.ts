import esbuild from 'rollup-plugin-esbuild';
import strip from '@rollup/plugin-strip';
import {env as define} from './config';

export default {
  treeshake: true,
  plugins: [
    strip({
      include: '**/*.(js|ts)',
      functions: ['console.*'],
    }),
    esbuild({
      minify: true,
      define,
    }),
  ],
};

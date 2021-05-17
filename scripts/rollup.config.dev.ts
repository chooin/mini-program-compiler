import esbuild from 'rollup-plugin-esbuild';
import {env as define} from './config';

export default {
  treeshake: false,
  plugins: [
    esbuild({
      minify: false,
      define,
    }),
  ],
};

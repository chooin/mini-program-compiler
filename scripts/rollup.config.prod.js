const common = require('./rollup.config.common');
const strip = require('@rollup/plugin-strip');
const {terser} = require('rollup-plugin-terser');

const plugins = [
  strip({
    include: '**/*.(js|ts)',
    functions: [
      'console.*'
    ]
  }),
  terser(),
];

module.exports = {
  plugins: common.plugins.concat(plugins),
}

const common = require('./rollup.config.common');
const strip = require('@rollup/plugin-strip');
const {uglify} = require('rollup-plugin-uglify');

const plugins = [
  strip({
    include: '**/*.(js|ts)',
    functions: [
      'console.*'
    ]
  }),
  // uglify(),
];

module.exports = {
  ...common,
  plugins: common.plugins.concat(plugins),
}

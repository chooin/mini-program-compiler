const {babel} = require('@rollup/plugin-babel')
const replace = require('@rollup/plugin-replace')
const dotenv = require('dotenv')

const env = dotenv.config({
  path: '.env.production'
})

module.exports = {
  plugins: [
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
    }),
    replace({
      ...env.parsed,
      preventAssignment: false
    })
  ],
}

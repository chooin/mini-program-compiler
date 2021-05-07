const {babel} = require('@rollup/plugin-babel')
const replace = require('@rollup/plugin-replace')
const dotenv = require('dotenv')

const NODE_ENV = process.env.NODE_ENV

const getEnv = () => {
  const config = dotenv.config({
    path: `.env.${NODE_ENV}`
  }).parsed
  const env = Object.create({})
  Object.keys(config).forEach((key) => {
    env[`process.env.${key}`] = config[key]
  })
  return env
}

module.exports = {
  plugins: [
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'bundled',
      exclude: ['node_modules/**'],
    }),
    replace({
      ...getEnv(),
      preventAssignment: true
    })
  ],
}

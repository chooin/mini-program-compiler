const chalk = require('chalk')
const fse = require('fs-extra')

class Trace {
  traces = {}

  start(file) {
    this.traces[file] = Date.now()
  }

  end(file) {
    return `${Date.now() - this.traces[file]}ms`
  }
}

const logger = (...array) => {
  console.log(array.join(' '))
}

const projectConfig = () => {
  if (!fse.existsSync('packages/project.config.json')) {
    logger(
      chalk.red('错误'),
      'packages 目录下缺少 project.config.json'
    )
    process.exit(0)
  }

  const {
    miniprogramRoot,
    pluginRoot,
    compileType
  } = require('../../packages/project.config.json')
  let watchDir = [
    miniprogramRoot,
    'project.config.json'
  ]
  if (compileType === 'plugin') {
    watchDir.push(pluginRoot)
  }
  watchDir = watchDir.map((item) => `packages/${item}`)

  return {
    miniprogramRoot,
    pluginRoot,
    compileType,
    watchDir
  }
}

module.exports = {
  trace: new Trace(),
  logger,
  projectConfig: projectConfig(),
}

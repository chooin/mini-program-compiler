const chokidar = require('chokidar')
const rollup = require('rollup')
const chalk = require('chalk')
const postcss = require('postcss')
const fse = require('fs-extra')
const fs = require('fs')
const {renderSync} = require('dart-sass')
const px2rpx = require('postcss-pxtorpx-pro')
const deepmerge = require('deepmerge');
const {trace, logger, projectConfig} = require('./utils')

const NODE_ENV = process.env.NODE_ENV

const run = () => Promise.resolve()

const removeDist = () => fse.remove('dist')

const build = async (file) => {
  if (/\.ts$/.test(file)) {
    trace.start(file)
    const outputFile = file
      .replace(/^packages/, 'dist')
      .replace(/\.ts$/, '.js')
    logger(
      chalk.yellow('编译'),
      file.replace(/^packages\//, ''),
    )
    const bundle = await rollup.rollup({
      ...(require(`../rollup.config.${NODE_ENV}`)),
      input: file,
    })
    await bundle.write({
      file: outputFile,
      exports: 'named',
      format: 'cjs',
    })
    logger(
      chalk.green('生成'),
      outputFile.replace(/^dist\//, ''),
      trace.end(file)
    )
    return
  }
  if (/\.scss$/.test(file)) {
    trace.start(file)
    logger(
      chalk.yellow('编译'),
      file.replace(/^packages\//, ''),
    )
    const outputFile = file
      .replace(/^packages/, 'dist')
      .replace(/\.scss$/, '.wxss')
    const {css} = renderSync({
      file,
    })
    const outputDir = outputFile.replace(/\/[\w-_]+.wxss/, '')
    if (!fs.existsSync(outputDir)) {
      await fse.mkdirp(outputDir)
    }
    const {css: wxss} = await postcss()
      .use(
        px2rpx({
          minPixelValue: 2,
          transform: (x) => x
        })
      )
      .process(css, {
        map: false,
        from: undefined
      })
    fs.writeFile(outputFile, wxss, () => {})
    logger(
      chalk.green('生成'),
      outputFile.replace(/^dist\//, ''),
      trace.end(file),
    )
    return
  }
  if (/project.config.json$/.test(file)) {
    trace.start(file)
    const outputFile = file.replace(/^packages/, 'dist')
    const outputDir = outputFile.replace('project.config.json', '')
    if (!fs.existsSync(outputDir)) {
      await fse.mkdirp(outputDir)
    }
    let data = await fse.readFile(file, 'utf8')
    data = deepmerge(JSON.parse(data), {
      setting: {
        enhance: true,
        es6: true,
      }
    })
    await fse.writeFile(outputFile, JSON.stringify(data, null, 2))
    logger(
      '拷贝',
      file.replace(/^packages\//, ''),
      trace.end(file),
    )
    return
  }

  trace.start(file)
  fse.copy(file, file.replace(/^packages/, 'dist')).then(() => {
    logger(
      '拷贝',
      file.replace(/^packages\//, ''),
      trace.end(file),
    )
  })
}

module.exports = function () {
  run()
    .then(() => removeDist())
    .then(() => {
      const watcher = chokidar
        .watch(projectConfig.watchDir, {
          ignored: [
            '**/.DS_Store',
            '**/.gitkeep'
          ],
        })

      watcher.on('add',(file) => {
        return build(file)
      })

      watcher.on('change',(file) => {
        return build(file)
      })

      watcher.on('ready', () => {
        console.log('ready')
      })
    })
    .catch(() => {
      process.exit(1)
    })
}

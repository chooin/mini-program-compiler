const chokidar = require('chokidar')
const rollup = require('rollup')
const chalk = require('chalk')
const postcss = require('postcss')
const fse = require('fs-extra')
const sass = require('dart-sass')
const px2rpx = require('postcss-pxtorpx-pro')
const {trace, logger, projectConfig} = require('./utils')

const NODE_ENV = process.env.NODE_ENV

const run = () => Promise.resolve()

const removeDist = () => fse.remove('dist')

const build = async (file) => {
  trace.start(file)
  if (/\.ts$/.test(file)) {
    logger(
      chalk.yellow('编译'),
      file.replace(/^packages\//, ''),
    )

    const bundle = await rollup.rollup({
      ...(require(`../rollup.config.${NODE_ENV}`)),
      input: file,
    })
    await bundle.write({
      file: file
        .replace(/^packages/, 'dist')
        .replace(/\.ts$/, '.js'),
      exports: 'named',
      format: 'cjs',
    })

    logger(
      chalk.green('生成'),
      file
        .replace(/^packages\//, '')
        .replace(/\.ts$/, '.js'),
      trace.end(file)
    )
    return
  }
  if (/\.scss$/.test(file)) {
    logger(
      chalk.yellow('编译'),
      file.replace(/^packages\//, ''),
    )

    const outFile = file
      .replace(/^packages/, 'dist')
      .replace(/\.scss$/, '.wxss')
    const outDir = outFile.replace(/\/[\w-_]+.wxss/, '')
    const {css} = sass.renderSync({
      file,
    })
    if (!fse.existsSync(outDir)) {
      await fse.mkdirp(outDir)
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
    fse.writeFile(
      outFile,
      wxss,
    ).catch((_) => console.log(_))

    logger(
      chalk.green('生成'),
      outFile.replace(/^dist\//, ''),
      trace.end(file),
    )
    return
  }

  fse.copy(file, file.replace(/^packages/, 'dist'))
  logger(
    '拷贝',
    file.replace(/^packages\//, ''),
    trace.end(file),
  )
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

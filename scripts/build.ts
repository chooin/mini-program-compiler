const chokidar = require('chokidar')
const rollup = require('rollup')
const postcss = require('postcss')
const fse = require('fs-extra')
const {renderSync} = require('dart-sass')
const px2rpx = require('postcss-pxtorpx-pro')
const deepmerge = require('deepmerge');
import {logger, trace, watchPaths, env} from './utils'

const build = async (file) => {
  trace.start(file)
  if (/\.ts$/.test(file)) {
    const outputFile = file
      .replace(/^src/, 'dist')
      .replace(/\.ts$/, '.js')
    logger.build(
      file.replace(/^src\//, ''),
    )
    const bundle = await rollup.rollup({
      ...(require(`./rollup.config.${env}`)),
      input: file,
    })
    await bundle.write({
      file: outputFile,
      exports: 'named',
      format: 'cjs',
    })
    logger.create(
      outputFile.replace(/^dist\//, ''),
      trace.end(file)
    )
    return
  }
  if (/\.scss$/.test(file)) {
    logger.build(
      file.replace(/^src\//, ''),
    )
    const outputFile = file
      .replace(/^src/, 'dist')
      .replace(/\.scss$/, '.wxss')
    const {css} = renderSync({
      file,
    })
    const outputDir = outputFile.replace(/\/[\w-_]+.wxss/, '')
    if (!fse.existsSync(outputDir)) {
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
    await fse.writeFile(outputFile, wxss, () => {})
    logger.create(
      outputFile.replace(/^dist\//, ''),
      trace.end(file),
    )
    return
  }
  if (/project.config.json$/.test(file)) {
    const outputFile = file.replace(/^src/, 'dist')
    const outputDir = outputFile.replace('project.config.json', '')
    if (!fse.existsSync(outputDir)) {
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
    logger.create(
      file.replace(/^src\//, ''),
      trace.end(file),
    )
    return
  }

  await fse.copy(file, file.replace(/^src/, 'dist'))
  logger.copy(
    file.replace(/^src\//, ''),
    trace.end(file),
  )
}

const run = () => {
  return Promise.resolve()
}

const removeDist = () => {
  return fse.remove('dist')
}

(() => {
  run()
    .then(() => {
      if (env === 'prod') {
        return removeDist()
      }
    })
    .then(() => {
      const watcher = chokidar
        .watch(watchPaths, {
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
      })
  })
})()

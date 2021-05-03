const chokidar = require('chokidar')
const rollup = require('rollup')
const chalk = require('chalk')
const postcss = require('postcss')
const fse = require('fs-extra')
const sass = require('dart-sass')
const px2rpx = require('postcss-pxtorpx-pro')

const NODE_ENV = process.env.NODE_ENV

const trace = new (class Trace {
  traces = {}

  start(file) {
    this.traces[file] = Date.now()
  }

  end(file) {
    return `${Date.now() - this.traces[file]}ms`
  }
})()

const build = async (file) => {
  trace.start(file)
  if (/\.ts$/.test(file)) {
    console.log(
      [
        chalk.yellow('编译'),
        file.replace(/^packages\//, ''),
      ].join(' ')
    )

    const bundle = await rollup.rollup({
      ...(require(`./rollup.config.${NODE_ENV}`)),
      input: file,
    })
    await bundle.write({
      file: file
        .replace(/^packages/, 'dist')
        .replace(/\.ts$/, '.js'),
      exports: 'named',
      format: 'cjs',
    })

    console.log(
      [
        chalk.green('生成'),
        file
          .replace(/^packages\//, '')
          .replace(/\.ts$/, '.js'),
        trace.end(file)
      ].join(' ')
    )
    return
  }
  if (/\.scss$/.test(file)) {
    console.log(
      [
        chalk.yellow('编译'),
        file.replace(/^packages\//, ''),
      ].join(' ')
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

    console.log(
      [
        chalk.green('生成'),
        outFile.replace(/^dist\//, ''),
        trace.end(file),
      ].join(' ')
    )
    return
  }
  fse.copy(file, file.replace(/^packages/, 'dist'))

  console.log(
    [
      '拷贝',
      file.replace(/^packages\//, ''),
      trace.end(file),
    ].join(' ')
  )
}

fse.remove('dist').then(() => {

  const watcher = chokidar
    .watch(['packages'], {
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

})

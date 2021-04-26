const chokidar = require('chokidar');
const rollup = require('rollup');
const chalk = require('chalk');
const postcss = require('postcss');
const fse = require('fs-extra');
const sass = require('dart-sass');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV;

const trace = {};

function bundle(file) {
  (async() => {
    trace[file] = Date.now();
    if (/\.ts$/.test(file)) {
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
      });

      console.log(`${chalk.green('编译')} ${file} ${Date.now() - trace[file]}ms`)
      return;
    }
    if (/\.scss$/.test(file)) {
      const outFile = file
        .replace(/^packages/, 'dist')
        .replace(/\.scss$/, '.wxss');
      const outDir = outFile.replace(/\/[\w-_]+.wxss/, '')
      const {css} = sass.renderSync({
        file,
      })
      if (!fse.existsSync(outDir)) {
        await fse.mkdirp(outDir)
      }
      fse.writeFile(
        outFile,
        css.toString(),
      ).catch((_) => console.log(_))
      console.log(`${chalk.green('编译')} ${file} ${Date.now() - trace[file]}ms`)
      return;
    }
    fse.copy(file, file.replace(/^packages/, 'dist'));
    console.log(`${chalk.yellow('拷贝')} ${file} ${Date.now() - trace[file]}ms`)
  })()
}

(async () => {
  await fse.remove('dist')

  const watcher = chokidar
    .watch(['packages'], {
      ignored: [
        '**/.DS_Store',
        '**/.gitkeep'
      ],
    });

  watcher.on('add',(file) => {
    bundle(file)
  })

  watcher.on('change',(file) => {
    bundle(file)
  })
})()

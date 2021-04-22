const chokidar = require('chokidar');
const rollup = require('rollup');
const fs = require('fs-extra');

const BUILD_ENV = process.env.BUILD_ENV;

function bundle(file) {
  (async() => {
    if (/\.ts$/.test(file)) {
      const bundle = await rollup.rollup({
        ...(require(`./rollup.config.${BUILD_ENV}`)),
        input: file,
      })
      await bundle.write({
        file: file
          .replace(/^packages/, 'dist')
          .replace(/\.ts$/, '.js'),
        exports: 'named',
        format: 'cjs',
      });
      return;
    }
    if (/\.scss$/.test(file)) {
      return;
    }
    fs.copy(file, file.replace(/^packages/, 'dist'));
  })()
}

fs.remove('dist').then(() => {
  const watcher = chokidar
    .watch(['packages'], {
      ignored: [
        '**/.DS_Store'
      ],
    });

  watcher.on('add',(file) => {
    bundle(file)
  })

  watcher.on('change',(file) => {
    bundle(file)
  })
})

const {renderSync} = require('dart-sass');
const rollup = require('rollup');
const px2rpx = require('postcss-pxtorpx-pro');
import {
  existsSync,
  mkdirpSync,
  writeFileSync,
  copyFileSync,
  removeSync,
} from 'fs-extra';
import {logger, trace, watchPaths, NODE_ENV} from './utils';
import postcss from 'postcss';
import chokidar from 'chokidar';
import {json} from 'fast-files';

const build = async (file) => {
  trace.start(file);
  const outputDir = file
    .split('/')
    .slice(0, -1)
    .join('/')
    .replace(/^src/, 'dist');
  let outputFile = file.replace(/^src/, 'dist');
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  if (/\.ts$/.test(file)) {
    logger.build(''.padEnd(6), file);
    outputFile = file.replace(/\.ts$/, '.js');
    const bundle = await rollup.rollup({
      ...require(`./rollup.config.${NODE_ENV}`),
      input: file,
    });
    await bundle.write({
      file: outputFile,
      exports: 'named',
      format: 'cjs',
    });
    logger.create(trace.end(file), `${file} -> ${outputFile}`);
    return;
  }
  if (/\.scss$/.test(file)) {
    logger.build(''.padEnd(6), file);
    outputFile = file.replace(/\.scss$/, '.wxss');
    const {css} = renderSync({
      file,
    });
    const {css: wxss} = await postcss()
      .use(
        px2rpx({
          minPixelValue: 2,
          transform: (x) => x,
        }),
      )
      .process(css, {
        map: false,
        from: undefined,
      });
    writeFileSync(outputFile, wxss);
    logger.create(trace.end(file), `${file} -> ${outputFile}`);
    return;
  }
  if (/project.config.json$/.test(file)) {
    logger.build(''.padEnd(6), file);
    json()
      .readFile(file)
      .merge({
        setting: {
          enhance: true,
          es6: true,
        },
      })
      .saveFile(outputFile);
    logger.create(trace.end(file), `${file} -> ${outputFile}`);
    return;
  }
  copyFileSync(file, outputFile);
  logger.copy(trace.end(file), `${file} -> ${outputFile}`);
};

(() => {
  if (NODE_ENV === 'prod') {
    removeSync('dist');
  }
  const watcher = chokidar.watch(watchPaths, {
    ignored: ['**/.DS_Store', '**/.gitkeep'],
  });

  watcher
    .on('add', build)
    .on('change', build)
    .on('ready', () => {
      if (NODE_ENV === 'prod') {
        return watcher.close();
      }
    });
})();

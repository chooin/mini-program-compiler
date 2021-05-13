import chokidar from 'chokidar';
import {existsSync, mkdirpSync, removeSync, lstatSync} from 'fs-extra';
import {trace, watchPaths} from './utils';
import * as builds from './build/index';
import {isProd} from './config';

const getFile = (file) => {
  if (file.indexOf('.') > -1) {
    const inputFile = file;
    const outputFile = (() => {
      if (/\.ts$/.test(file)) {
        return file.replace(/^src/, 'dist').replace(/\.ts$/, '.js');
      }
      if (/\.scss$/.test(file)) {
        return file.replace(/^src/, 'dist').replace(/\.scss$/, '.wxss');
      }
      return file.replace(/^src/, 'dist');
    })();
    const inputDir = file.split('/').slice(0, -1).join('/');
    const outputDir = file
      .replace(/^src/, 'dist')
      .split('/')
      .slice(0, -1)
      .join('/');
    return {inputFile, outputFile, inputDir, outputDir};
  } else {
    const inputDir = file;
    const outputDir = file.replace(/^src/, 'dist');
    return {inputDir, outputDir};
  }
};

const build = (file) => {
  trace.start(file);
  const {inputFile, outputFile, outputDir} = getFile(file);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  if (/\.ts$/.test(file)) {
    builds.typescript(inputFile, outputFile);
  }
  if (/\.scss$/.test(inputFile)) {
    builds.scss(file, outputFile);
  }
  if (/project.config.json$/.test(file)) {
    builds.projectConfigJson(inputFile, outputFile);
  }
  builds.copy(inputFile, outputFile);
};

(() => {
  removeSync('dist');
  const watcher = chokidar.watch(watchPaths, {
    ignored: ['**/.DS_Store', '**/.gitkeep'],
  });
  watcher
    .on('add', build)
    .on('change', build)
    .on('unlink', (file) => {
      trace.start(file);
      const {inputFile, outputFile} = getFile(file);
      builds.remove(inputFile, outputFile);
    })
    .on('addDir', (file) => {
      trace.start(file);
      const {inputDir, outputDir} = getFile(file);
      builds.addDir(inputDir, outputDir);
    })
    .on('unlinkDir', (file) => {
      trace.start(file);
      const {inputDir, outputDir} = getFile(file);
      builds.removeDir(inputDir, outputDir);
    })
    .on('ready', () => {
      if (isProd) {
        return watcher.close();
      }
    });
})();

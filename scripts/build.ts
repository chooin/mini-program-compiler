import chokidar from 'chokidar';
import {existsSync, mkdirpSync, removeSync} from 'fs-extra';
import {watchPaths} from './utils';
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
  const {inputFile, outputFile, outputDir} = getFile(file);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  if (/\.ts$/.test(inputFile)) {
    builds.typescript(inputFile, outputFile);
    return;
  }
  if (/\.scss$/.test(inputFile)) {
    builds.scss(inputFile, outputFile);
    return;
  }
  if (/project.config.json$/.test(inputFile)) {
    builds.projectConfigJson(inputFile, outputFile);
    return;
  }
  builds.copy(inputFile, outputFile);
  return;
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
      const {inputFile, outputFile} = getFile(file);
      builds.remove(inputFile, outputFile);
    })
    .on('addDir', (file) => {
      const {inputDir, outputDir} = getFile(file);
      builds.addDir(inputDir, outputDir);
    })
    .on('unlinkDir', (file) => {
      const {inputDir, outputDir} = getFile(file);
      builds.removeDir(inputDir, outputDir);
    })
    .on('ready', () => {
      if (isProd) {
        return watcher.close();
      }
    });
})();

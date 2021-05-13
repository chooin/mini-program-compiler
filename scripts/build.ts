import chokidar from 'chokidar';
import {existsSync, mkdirpSync, removeSync} from 'fs-extra';
import {NODE_ENV, trace, watchPaths} from './utils';
import * as builds from './build/index';

const build = (file) => {
  trace.start(file);
  const outputDir = file
    .replace(/^src/, 'dist')
    .split('/')
    .slice(0, -1)
    .join('/');
  let outputFile = file.replace(/^src/, 'dist');
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  if (/\.ts$/.test(file)) {
    outputFile = outputFile.replace(/\.ts$/, '.js');
    builds.typescript(file, outputFile);
  }
  if (/\.scss$/.test(file)) {
    outputFile = outputFile.replace(/\.scss$/, '.wxss');
    builds.scss(file, outputFile);
  }
  if (/project.config.json$/.test(file)) {
    builds.projectConfigJson(file, outputFile);
  }
  builds.copy(file, outputFile);
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

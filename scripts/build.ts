import chokidar from 'chokidar';
import {removeSync} from 'fs-extra';
import {watchPaths} from './utils';
import * as builds from './build/index';
import {isProd} from './config';

const build = (path) => {
  if (/\.ts$/.test(path)) {
    return builds.typescript(path);
  }
  if (/\.scss$/.test(path)) {
    return builds.scss(path);
  }
  if (/project.config.json$/.test(path)) {
    return builds.projectConfigJson(path);
  }
  return builds.copy(path);
};

(() => {
  removeSync('dist');
  const watcher = chokidar.watch(watchPaths, {
    ignored: ['**/.DS_Store', '**/.gitkeep'],
  });
  watcher
    .on('add', build)
    .on('change', build)
    .on('unlink', (path) => {
      builds.remove(path);
    })
    .on('addDir', (path) => {
      builds.addDir(path);
    })
    .on('unlinkDir', (path) => {
      builds.removeDir(path);
    })
    .on('ready', () => {
      if (isProd) {
        return watcher.close();
      }
    });
})();

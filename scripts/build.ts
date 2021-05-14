import chokidar from 'chokidar';
import {watchPaths} from './utils';
import * as build from './build/index';
import {isProd} from './config';

const bundle = (path) => {
  if (/\.ts$/.test(path)) {
    return build.typescript(path);
  }
  if (/\.scss$/.test(path)) {
    return build.scss(path);
  }
  if (/project.config.json$/.test(path)) {
    return build.projectConfigJson(path);
  }
  return build.copy(path);
};

(() => {
  build.clearCache();
  const watcher = chokidar.watch(watchPaths, {
    ignored: ['**/.DS_Store', '**/.gitkeep'],
  });
  watcher
    .on('add', bundle)
    .on('change', bundle)
    .on('unlink', (path) => {
      build.remove(path);
    })
    .on('addDir', (path) => {
      build.addDir(path);
    })
    .on('unlinkDir', (path) => {
      build.removeDir(path);
    })
    .on('ready', () => {
      if (isProd) {
        return watcher.close();
      }
    });
})();

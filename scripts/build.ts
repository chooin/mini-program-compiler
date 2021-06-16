import chokidar from 'chokidar';
import {watchPaths} from './utils';
import {typescript, scss, projectConfigJson, copy, clearCache, remove, addDir, removeDir} from './build/index';
import {isProd} from './config';

function bundle(path: string) {
  if (/\.ts$/.test(path)) {
    return typescript(path);
  }
  if (/\.scss$/.test(path)) {
    return scss(path);
  }
  if (/project.config.json$/.test(path)) {
    return projectConfigJson(path);
  }
  return copy(path);
}

clearCache()
const watcher = chokidar.watch(watchPaths, {
  ignored: ['**/.DS_Store', '**/.gitkeep'],
});
watcher
  .on('add', bundle)
  .on('change', bundle)
  .on('unlink', (path) => {
    remove(path);
  })
  .on('addDir', (path) => {
    addDir(path);
  })
  .on('unlinkDir', (path) => {
    removeDir(path);
  })
  .on('ready', () => {
    if (isProd) {
      return watcher.close();
    }
  });

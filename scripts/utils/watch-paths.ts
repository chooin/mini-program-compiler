import {json} from 'fast-files';
import {existsSync} from 'fs-extra';
import {resolve} from 'path';

import * as logger from './logger';

let path = resolve(__dirname, '../../src/project.config.json');
let paths = [];
let exists = existsSync(path);
if (exists) {
  const {compileType, miniprogramRoot, pluginRoot} = json().readFile(path).parsed;
  if (compileType === 'plugin') {
    paths = ['project.config.json', miniprogramRoot, pluginRoot].map(
      (path) => `src/${path ?? ''}`,
    );
  } else {
    paths = ['project.config.json', miniprogramRoot].map(
      (path) => `src/${path ?? ''}`,
    );
  }
} else {
  logger.error('src 目录下不存在 project.config.json')
  process.exit(1);
}

export default paths

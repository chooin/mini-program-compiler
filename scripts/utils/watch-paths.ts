import {json} from 'fast-files';
import path from 'path';

let paths = []
const {compileType, miniprogramRoot, pluginRoot} = json().readFile(
  path.resolve(__dirname, '../../src/project.config.json'),
).parsed;
if (compileType === 'plugin') {
  paths = ['project.config.json', miniprogramRoot, pluginRoot].map(
    (path) => path ? 'src/' : `src/${path}`,
  );
} else {
  paths = ['project.config.json', miniprogramRoot].map(
    (path) => path ? 'src/' : `src/${path}`,
  );
}

export default paths

import {removeSync} from 'fs-extra';
import path from 'path';
import {logger} from '../utils'

export default () => {
  logger.info('开始编译')
  removeSync(path.resolve(__dirname, '../../dist'));
};

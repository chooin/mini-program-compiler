import {removeSync} from 'fs-extra';
import {resolve} from 'path';
import {logger} from '../utils';

/**
 * 清空项目
 */
export default () => {
  logger.info('开始编译');
  removeSync(resolve(__dirname, '../../dist'));
};

import {remove} from 'fs-extra';
import {file, logger, trace} from '../utils';

/**
 * 移除目录
 * @param {string} path
 */
export default (path: string) => {
  trace.start(path);
  const {inputDir, outputDir} = file.path(path);
  remove(outputDir).then(() => {
    logger.remove(trace.end(inputDir), outputDir);
  });
};

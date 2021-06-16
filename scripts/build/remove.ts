import {unlink} from 'fs-extra';
import {file, logger, trace} from '../utils';

/**
 * 移除文件
 * @param {string} path
 */
export default (path: string) => {
  trace.start(path);
  const {inputFile, outputFile} = file.path(path);
  unlink(outputFile).then(() => {
    logger.remove(trace.end(inputFile), outputFile);
  });
};

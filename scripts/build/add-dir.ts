import {existsSync, mkdirp, mkdirpSync} from 'fs-extra';
import {file, logger, trace} from '../utils';

/**
 * 创建目录
 * @param {string} path
 */
export default (path: string) => {
  trace.start(path);
  const {inputDir, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  mkdirp(outputDir).then(() => {
    logger.create(trace.end(inputDir), `${inputDir} -> ${outputDir}`);
  });
};

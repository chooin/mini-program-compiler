import {existsSync, mkdirp} from 'fs-extra';
import {file, logger, trace} from '../utils';

/**
 * 目录不存在，则创建目录
 * @param {string} path
 */
export default (path: string) => {
  if (path === 'src/') {
    return;
  }
  const {inputDir, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    trace.start(inputDir);
    mkdirp(outputDir).then(() => {
      logger.create(trace.end(inputDir), `${inputDir} -> ${outputDir}`);
    });
  }
};

import {remove} from 'fs-extra';
import {file, logger, trace} from '../utils';

export default (path) => {
  trace.start(path);
  const {inputDir, outputDir} = file.path(path);
  remove(outputDir).then(() => {
    logger.remove(trace.end(inputDir), outputDir);
  });
};

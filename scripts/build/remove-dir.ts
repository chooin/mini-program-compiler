import {existsSync, mkdirpSync, remove} from 'fs-extra';
import {file, logger, trace} from '../utils';

export default (path) => {
  trace.start(path);
  const {inputDir, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  remove(outputDir).then(() => {
    logger.remove(trace.end(inputDir), outputDir);
  });
};

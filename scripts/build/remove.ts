import {existsSync, mkdirpSync, unlink} from 'fs-extra';
import {file, logger, trace} from '../utils';

export default (path) => {
  trace.start(path);
  const {inputFile, outputFile, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  unlink(outputFile).then(() => {
    logger.remove(trace.end(inputFile), outputFile);
  });
};

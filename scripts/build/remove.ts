import {unlink} from 'fs-extra';
import {file, logger, trace} from '../utils';

export default (path) => {
  trace.start(path);
  const {inputFile, outputFile} = file.path(path);
  unlink(outputFile).then(() => {
    logger.remove(trace.end(inputFile), outputFile);
  });
};

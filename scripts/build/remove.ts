import {unlink} from 'fs-extra';
import {logger, trace} from '../utils';

export default (inputFile, outputFile) => {
  trace.start(inputFile);
  unlink(outputFile).then(() => {
    logger.remove(trace.end(inputFile), outputFile);
  });
};

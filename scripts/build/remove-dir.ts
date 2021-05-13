import {remove} from 'fs-extra';
import {logger, trace} from '../utils';

export default (inputDir, outputDir) => {
  trace.start(inputDir);
  remove(outputDir).then(() => {
    logger.remove(trace.end(inputDir), outputDir);
  });
};

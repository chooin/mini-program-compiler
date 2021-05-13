import {mkdirp} from 'fs-extra';
import {logger, trace} from '../utils';

export default (inputDir, outputDir) => {
  trace.start(inputDir);
  mkdirp(outputDir).then(() => {
    logger.create(trace.end(inputDir), `${inputDir} -> ${outputDir}`);
  });
};

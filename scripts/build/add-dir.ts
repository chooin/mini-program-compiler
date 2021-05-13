import {mkdirp} from 'fs-extra';
import {logger, trace} from '../utils';

export default (inputDir, outputDir) => {
  mkdirp(outputDir).then(() => {
    logger.create(trace.end(inputDir), `${inputDir} -> ${outputDir}`);
  });
};

import {existsSync, mkdirp, mkdirpSync} from 'fs-extra';
import {file, logger, trace} from '../utils';

export default (path) => {
  trace.start(path);
  const {inputDir, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  mkdirp(outputDir).then(() => {
    logger.create(trace.end(inputDir), `${inputDir} -> ${outputDir}`);
  });
};

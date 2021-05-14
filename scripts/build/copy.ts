import {copyFile, existsSync, mkdirpSync} from 'fs-extra';
import {file, logger, trace} from '../utils';

export default (path) => {
  trace.start(path);
  const {inputFile, outputFile, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  copyFile(inputFile, outputFile).then(() => {
    logger.copy(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
  });
};

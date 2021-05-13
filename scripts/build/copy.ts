import {copyFileSync} from 'fs-extra';
import {logger, trace} from '../utils';

export default (inputFile, outputFile) => {
  copyFileSync(inputFile, outputFile);
  logger.copy(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
};

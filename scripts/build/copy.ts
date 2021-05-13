import {copyFile} from 'fs-extra';
import {logger, trace} from '../utils';

export default (inputFile, outputFile) => {
  copyFile(inputFile, outputFile).then(() => {
    logger.copy(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
  });
};

import {logger, trace} from '../utils';
import {json} from 'fast-files';

export default (inputFile, outputFile) => {
  (async () => {
    logger.build(''.padEnd(6), inputFile);
    json()
      .readFile(inputFile)
      .merge({
        setting: {
          enhance: true,
          es6: true,
        },
      })
      .saveFile(outputFile);
    logger.create(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
  })();
};

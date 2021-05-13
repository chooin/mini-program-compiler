const rollup = require('rollup');
import {logger, NODE_ENV, trace} from '../utils';

export default (inputFile, outputFile) => {
  (async () => {
    logger.build(''.padEnd(6), inputFile);
    const bundle = await rollup.rollup({
      ...require(`../rollup.config.${NODE_ENV}`),
      input: inputFile,
    });
    await bundle.write({
      file: outputFile,
      exports: 'named',
      format: 'cjs',
    });
    logger.create(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
  })();
};

import {existsSync, mkdirpSync} from 'fs-extra';

const rollup = require('rollup');
import {file, logger, trace} from '../utils';
import {isProd} from '../config';
import prodConfig from '../rollup.config.prod';
import devConfig from '../rollup.config.dev';

export default (path) => {
  trace.start(path);
  const {inputFile, outputFile, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  (async () => {
    logger.build(''.padEnd(6), inputFile);
    const bundle = await rollup.rollup({
      ...(isProd ? prodConfig : devConfig),
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

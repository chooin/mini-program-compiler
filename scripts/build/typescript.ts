import {existsSync, mkdirpSync, readFileSync} from 'fs-extra';
import {buildSync, transform} from 'esbuild';

import {file, logger, trace} from '../utils';
import {isProd, env as define} from '../config';

export default (path) => {
  trace.start(path);
  const {inputFile, outputFile, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  logger.build(''.padEnd(6), inputFile);
  buildSync({
    entryPoints: [inputFile],
    outfile: outputFile,
    minify: isProd,
    treeShaking: isProd ? isProd : 'ignore-annotations',
    bundle: false,
    define,
  })
  logger.create(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
};

import {existsSync, mkdirpSync, readFileSync} from 'fs-extra';
import {build, buildSync} from 'esbuild';

import {file, logger, trace} from '../utils';
import {isProd, env as define} from '../config';

let paths = (outputDir) => {
  return {
    name: 'paths',
    setup({onLoad}) {
      onLoad({filter: /.*/}, (args) => {
        const contents = readFileSync(args.path, 'utf8').replace('@/', outputDir.split('/').slice(0, -1).fill('../').join(''));

        return {
          contents,
          loader: 'ts'
        }
      })
    },
  }
}

export default (path) => {
  trace.start(path);
  const {inputFile, outputFile, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  logger.build(''.padEnd(6), inputFile);
  build({
    entryPoints: [inputFile],
    outfile: outputFile,
    minify: isProd,
    treeShaking: isProd ? isProd : 'ignore-annotations',
    bundle: false,
    define,
    plugins: [paths(outputDir)],
  }).then(() => {
    logger.create(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
  })
};

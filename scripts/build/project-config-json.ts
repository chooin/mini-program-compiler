import {file, logger, trace} from '../utils';
import {json} from 'fast-files';
import {existsSync, mkdirpSync} from 'fs-extra';

/**
 * 创建 project.config.json 文件
 * @param {string} path
 */
export default (path: string) => {
  trace.start(path);
  const {inputFile, outputFile, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  logger.build(''.padEnd(6), inputFile);
  json()
    .readFile(inputFile)
    .merge({
      setting: {
        enhance: true,
        es6: true,
      },
    })
    .saveFile(outputFile, {
      override: true,
    });
  logger.create(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
};

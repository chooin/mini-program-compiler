const {renderSync} = require('dart-sass');
import postcss from 'postcss';
import {existsSync, mkdirpSync, writeFile} from 'fs-extra';
const px2rpx = require('postcss-pxtorpx-pro');
import {file, logger, trace} from '../utils';

/**
 * 编译 scss 文件
 * @param {string} path
 */
export default (path: string) => {
  trace.start(path);
  const {inputFile, outputFile, outputDir} = file.path(path);
  if (!existsSync(outputDir)) {
    mkdirpSync(outputDir);
  }
  logger.build(''.padEnd(6), inputFile);
  const {css} = renderSync({
    file: inputFile,
  });
  postcss()
    .use(
      px2rpx({
        minPixelValue: 2,
        transform: (x) => x,
      }),
    )
    .process(css, {
      map: false,
      from: undefined,
    })
    .then(({css: wxss}) => {
      writeFile(outputFile, wxss).then(() => {
        logger.create(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
      });
    });
};

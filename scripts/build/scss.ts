const {renderSync} = require('dart-sass');
import postcss from 'postcss';
import {writeFile} from 'fs-extra';
const px2rpx = require('postcss-pxtorpx-pro');
import {logger, trace} from '../utils';

export default (inputFile, outputFile) => {
  (async () => {
    logger.build(''.padEnd(6), inputFile);
    const {css} = renderSync({
      file: inputFile,
    });
    const {css: wxss} = await postcss()
      .use(
        px2rpx({
          minPixelValue: 2,
          transform: (x) => x,
        }),
      )
      .process(css, {
        map: false,
        from: undefined,
      });
    writeFile(outputFile, wxss).then(() => {
      logger.create(trace.end(inputFile), `${inputFile} -> ${outputFile}`);
    });
  })();
};

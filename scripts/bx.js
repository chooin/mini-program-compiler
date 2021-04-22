const t = require('@babel/types');
const fs = require('fs-extra');

module.exports = function () {
  return {
    visitor: {
      ImportDeclaration (path, source) {
        if (/^core-js/.test(path.node.source.value)) {
          const projectName = source
            .filename
            .replace(`${source.cwd}/packages/`, '')
            .split('/')[0];
          fs.copy(`node_modules/${path.node.source.value}`, `dist/${projectName}/miniprogram_npm/${path.node.source.value}`)
        }
      }
    }
  }
}

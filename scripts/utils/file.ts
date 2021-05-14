/**
 * 获取编译前后的文件地址及目录
 * @param fullPath
 */
export const path = (
  fullPath: string,
): {
  inputDir: string;
  outputDir: string;
  inputFile?: string;
  outputFile?: string;
} => {
  if (/\.[^\.]+$/.test(fullPath)) {
    const inputFile = fullPath;
    const outputFile = (() => {
      if (/\.ts$/.test(fullPath)) {
        return fullPath.replace(/^src/, 'dist').replace(/\.ts$/, '.js');
      }
      if (/\.scss$/.test(fullPath)) {
        return fullPath.replace(/^src/, 'dist').replace(/\.scss$/, '.wxss');
      }
      return fullPath.replace(/^src/, 'dist');
    })();
    const inputDir = fullPath.split('/').slice(0, -1).join('/');
    const outputDir = fullPath
      .replace(/^src/, 'dist')
      .split('/')
      .slice(0, -1)
      .join('/');
    return {inputFile, outputFile, inputDir, outputDir};
  } else {
    const inputDir = fullPath;
    const outputDir = fullPath.replace(/^src/, 'dist');
    return {inputDir, outputDir};
  }
};

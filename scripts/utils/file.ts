import {parse} from 'path';

interface Path {
  type: 'file' | 'dir',
  inputDir: string;
  outputDir: string;
  inputFile?: string;
  outputFile?: string;
}

const extReplace = {
  '.ts': '.js',
  '.scss': '.wxss',
}

/**
 * 获取编译前后的文件地址及目录
 * @param inputFile
 */
export const path = (
  inputFile: string,
): Path => {
  const fileParse = parse(inputFile);
  const inputDir = fileParse.dir;
  const outputDir = inputDir
    .replace(/^src/, 'dist');
  if (fileParse.ext) {
    const outputFile = `${outputDir}/${fileParse.name}${extReplace[fileParse.ext] ?? fileParse.ext}`;
    return {
      type: 'file',
      inputFile,
      outputFile,
      inputDir,
      outputDir,
    };
  } else {
    return {
      type: 'dir',
      inputDir,
      outputDir
    };
  }
};

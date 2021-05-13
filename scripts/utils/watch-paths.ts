import {json} from 'fast-files'
import path from 'path'

export default (() => {
  const file = path.join(__dirname, '../../', 'src/project.config.json')
  const {compileType, miniprogramRoot, pluginRoot} = json
    .readFile(file)
    .parsed
  if (compileType === 'plugin') {
    return ['project.config.json', miniprogramRoot, pluginRoot]
      .map((path) => `src/${path}`)
  } else {
    return ['project.config.json', miniprogramRoot]
      .map((path) => `src/${path}`)
  }
})()

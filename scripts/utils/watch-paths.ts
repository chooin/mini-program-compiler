import {json} from 'mrm-core'
import path from 'path'

export default (() => {
  const config = json(path.resolve(__dirname, '../../src/project.config.json'))
  const compileType = config.get('compileType')
  const miniprogramRoot = config.get('miniprogramRoot')
  const pluginRoot = config.get('pluginRoot')
  if (compileType === 'plugin') {
    return ['project.config.json', miniprogramRoot, pluginRoot].map((path) => `src/${path}`)
  } else {
    return [miniprogramRoot, pluginRoot].map((path) => `src/${path}`)
  }
})()

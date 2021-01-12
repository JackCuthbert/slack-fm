import env from 'env-var'
import * as path from 'path'

const defaultDataDir = path.resolve(__dirname, '..', '..', 'data')

export const dataDirPath = path.resolve(
  env.get('DATA_DIR').default(defaultDataDir).asString()
)
export const cachePath = path.resolve(dataDirPath, 'cache.json')
export const configPath = path.resolve(dataDirPath, 'config.yml')

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { optimizePng } from './fix_and_optimize_all.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const splashLoading = path.join(rootDir, 'public', 'assets', 'splash', 'loading.PNG')
const splashPortrait = path.join(rootDir, 'public', 'assets', 'splash', 'potrait.PNG')

console.log('Optimizing splash images...')
try {
  optimizePng(splashLoading, 1920)
  optimizePng(splashPortrait, 1920)
} catch (e) {
  console.error('Error optimizing splash:', e)
}

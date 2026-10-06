import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const looseFiles = [
  'logo 4 kab.png',
  'logo kpw0.png',
  'logo p2dd.png',
  'logo1.png',
  'logo2.png',
  'logokiri1.png',
  'logokiri2.png',
  'logokiri3.png',
  'logokiri4.png',
  'template_ekspor.csv',
  'template_ekspor.xlsx',
  'template_warung.csv',
  'template_zonasi.csv',
  'scratch/cleanup_duplicates.mjs',
  'scratch/setup_asset_structure.mjs'
]

console.log('=== Cleaning loose files in root ===')
for (const f of looseFiles) {
  const p = path.join(rootDir, f)
  if (fs.existsSync(p)) {
    fs.unlinkSync(p)
    console.log(`[DELETED] ${f}`)
  }
}

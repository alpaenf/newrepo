import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Restore the original uncompressed files from git commit b0023aa
try {
  const origBuffer = execSync('git show b0023aa:"logokiri3.png"', { cwd: rootDir, maxBuffer: 50 * 1024 * 1024 })
  console.log(`Original logokiri3.png size from git: ${origBuffer.length} bytes`)
  
  // Inspect IHDR
  const ihdr = {
    width: origBuffer.readUInt32BE(16),
    height: origBuffer.readUInt32BE(20),
    bitDepth: origBuffer[24],
    colorType: origBuffer[25],
    compression: origBuffer[26],
    filter: origBuffer[27],
    interlace: origBuffer[28]
  }
  console.log('Original logokiri3.png IHDR:', JSON.stringify(ihdr))

  // Write the original uncorrupted file back first
  fs.writeFileSync(path.join(rootDir, 'logokiri3.png'), origBuffer)
  console.log('Restored original logokiri3.png successfully!')
} catch (err) {
  console.error('Error restoring logokiri3.png:', err.message)
}

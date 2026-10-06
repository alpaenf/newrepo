import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Fast CRC32
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[n] = c
}

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function makeChunk(typeStr, dataBuf) {
  const typeBuf = Buffer.from(typeStr, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(dataBuf.length, 0)
  const combined = Buffer.concat([typeBuf, dataBuf])
  const crcVal = crc32(combined)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crcVal, 0)
  return Buffer.concat([lenBuf, combined, crcBuf])
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

function unfilterPass(rawBuf, rawOffset, passW, passH, bpp, rowBytes) {
  const stride = 1 + rowBytes
  const unfiltered = Buffer.alloc(passH * rowBytes)
  let currOffset = rawOffset

  for (let y = 0; y < passH; y++) {
    const filterType = rawBuf[currOffset]
    const currentLine = rawBuf.subarray(currOffset + 1, currOffset + stride)
    currOffset += stride

    const prevRowStart = (y - 1) * rowBytes
    const outRowStart = y * rowBytes

    for (let x = 0; x < rowBytes; x++) {
      const byteVal = currentLine[x]
      const left = x >= bpp ? unfiltered[outRowStart + x - bpp] : 0
      const up = y > 0 ? unfiltered[prevRowStart + x] : 0
      const upLeft = y > 0 && x >= bpp ? unfiltered[prevRowStart + x - bpp] : 0

      let val = 0
      switch (filterType) {
        case 0: val = byteVal; break
        case 1: val = (byteVal + left) & 0xff; break
        case 2: val = (byteVal + up) & 0xff; break
        case 3: val = (byteVal + Math.floor((left + up) / 2)) & 0xff; break
        case 4: val = (byteVal + paeth(left, up, upLeft)) & 0xff; break
        default: val = byteVal;
      }
      unfiltered[outRowStart + x] = val
    }
  }

  return { unfiltered, bytesRead: currOffset - rawOffset }
}

function decodePngToRgba(buf) {
  let offset = 8
  let ihdr = null
  const idatChunks = []
  let plte = null
  let trns = null

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset)
    const type = buf.toString('ascii', offset + 4, offset + 8)
    const data = buf.subarray(offset + 8, offset + 8 + len)

    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12]
      }
    } else if (type === 'PLTE') {
      plte = data
    } else if (type === 'tRNS') {
      trns = data
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    }
    offset += 8 + len + 4
  }

  if (!ihdr) throw new Error('No IHDR chunk')

  const width = ihdr.width
  const height = ihdr.height
  const compressed = Buffer.concat(idatChunks)
  const rawBuf = zlib.inflateSync(compressed)

  let channels = 1
  if (ihdr.colorType === 2) channels = 3 // RGB
  else if (ihdr.colorType === 3) channels = 1 // Indexed
  else if (ihdr.colorType === 4) channels = 2 // Grayscale + Alpha
  else if (ihdr.colorType === 6) channels = 4 // RGBA

  const bytesPerSample = ihdr.bitDepth === 16 ? 2 : 1
  const bpp = Math.max(1, Math.ceil((ihdr.bitDepth * channels) / 8))

  const rgba = Buffer.alloc(width * height * 4)

  const unpackPixel = (unfiltered, rowOffset, px) => {
    let r = 0, g = 0, b = 0, a = 255
    if (ihdr.colorType === 6) { // RGBA
      const inIdx = rowOffset + px * (4 * bytesPerSample)
      r = unfiltered[inIdx]
      g = unfiltered[inIdx + bytesPerSample]
      b = unfiltered[inIdx + bytesPerSample * 2]
      a = unfiltered[inIdx + bytesPerSample * 3]
    } else if (ihdr.colorType === 2) { // RGB
      const inIdx = rowOffset + px * (3 * bytesPerSample)
      r = unfiltered[inIdx]
      g = unfiltered[inIdx + bytesPerSample]
      b = unfiltered[inIdx + bytesPerSample * 2]
      a = 255
    } else if (ihdr.colorType === 3) { // Indexed
      const paletteIdx = unfiltered[rowOffset + px]
      if (plte) {
        r = plte[paletteIdx * 3] || 0
        g = plte[paletteIdx * 3 + 1] || 0
        b = plte[paletteIdx * 3 + 2] || 0
      }
      if (trns && trns[paletteIdx] !== undefined) {
        a = trns[paletteIdx]
      }
    } else if (ihdr.colorType === 0) { // Grayscale
      const val = unfiltered[rowOffset + px * bytesPerSample]
      r = val; g = val; b = val; a = 255
    } else if (ihdr.colorType === 4) { // Grayscale + Alpha
      const inIdx = rowOffset + px * (2 * bytesPerSample)
      const val = unfiltered[inIdx]
      r = val; g = val; b = val
      a = unfiltered[inIdx + bytesPerSample]
    }
    return { r, g, b, a }
  }

  if (ihdr.interlace === 0) {
    // Non-interlaced
    const rowBytes = Math.ceil((width * ihdr.bitDepth * channels) / 8)
    const { unfiltered } = unfilterPass(rawBuf, 0, width, height, bpp, rowBytes)

    for (let y = 0; y < height; y++) {
      const rowOffset = y * rowBytes
      const outRowOffset = y * width * 4
      for (let x = 0; x < width; x++) {
        const { r, g, b, a } = unpackPixel(unfiltered, rowOffset, x)
        const outIdx = outRowOffset + x * 4
        rgba[outIdx] = r
        rgba[outIdx + 1] = g
        rgba[outIdx + 2] = b
        rgba[outIdx + 3] = a
      }
    }
  } else {
    // Adam7 Interlaced
    const ADAM7_PASSES = [
      { x0: 0, y0: 0, dx: 8, dy: 8 },
      { x0: 4, y0: 0, dx: 8, dy: 8 },
      { x0: 0, y0: 4, dx: 4, dy: 8 },
      { x0: 2, y0: 0, dx: 4, dy: 4 },
      { x0: 0, y0: 2, dx: 2, dy: 4 },
      { x0: 1, y0: 0, dx: 2, dy: 2 },
      { x0: 0, y0: 1, dx: 1, dy: 2 }
    ]

    let rawOffset = 0
    for (let p = 0; p < 7; p++) {
      const { x0, y0, dx, dy } = ADAM7_PASSES[p]
      const passW = Math.max(0, Math.ceil((width - x0) / dx))
      const passH = Math.max(0, Math.ceil((height - y0) / dy))

      if (passW === 0 || passH === 0) continue

      const rowBytes = Math.ceil((passW * ihdr.bitDepth * channels) / 8)
      const { unfiltered, bytesRead } = unfilterPass(rawBuf, rawOffset, passW, passH, bpp, rowBytes)
      rawOffset += bytesRead

      for (let py = 0; py < passH; py++) {
        const targetY = y0 + py * dy
        const rowOffset = py * rowBytes
        for (let px = 0; px < passW; px++) {
          const targetX = x0 + px * dx
          const { r, g, b, a } = unpackPixel(unfiltered, rowOffset, px)
          const outIdx = (targetY * width + targetX) * 4
          rgba[outIdx] = r
          rgba[outIdx + 1] = g
          rgba[outIdx + 2] = b
          rgba[outIdx + 3] = a
        }
      }
    }
  }

  return { width, height, rgba }
}

function resizeRgba(srcPixels, srcW, srcH, dstW, dstH) {
  const dstPixels = Buffer.alloc(dstW * dstH * 4)
  const xRatio = srcW / dstW
  const yRatio = srcH / dstH

  for (let dy = 0; dy < dstH; dy++) {
    for (let dx = 0; dx < dstW; dx++) {
      const sx0 = Math.floor(dx * xRatio)
      const sx1 = Math.min(srcW - 1, Math.floor((dx + 1) * xRatio))
      const sy0 = Math.floor(dy * yRatio)
      const sy1 = Math.min(srcH - 1, Math.floor((dy + 1) * yRatio))

      let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0
      for (let sy = sy0; sy <= sy1; sy++) {
        for (let sx = sx0; sx <= sx1; sx++) {
          const sIdx = (sy * srcW + sx) * 4
          const a = srcPixels[sIdx + 3]
          rSum += srcPixels[sIdx] * (a / 255)
          gSum += srcPixels[sIdx + 1] * (a / 255)
          bSum += srcPixels[sIdx + 2] * (a / 255)
          aSum += a
          count++
        }
      }

      const dIdx = (dy * dstW + dx) * 4
      const avgA = aSum / count
      if (avgA > 0) {
        dstPixels[dIdx] = Math.min(255, Math.round((rSum / count) / (avgA / 255)))
        dstPixels[dIdx + 1] = Math.min(255, Math.round((gSum / count) / (avgA / 255)))
        dstPixels[dIdx + 2] = Math.min(255, Math.round((bSum / count) / (avgA / 255)))
        dstPixels[dIdx + 3] = Math.min(255, Math.round(avgA))
      } else {
        dstPixels[dIdx] = 0
        dstPixels[dIdx + 1] = 0
        dstPixels[dIdx + 2] = 0
        dstPixels[dIdx + 3] = 0
      }
    }
  }
  return dstPixels
}

function encodeRgbaToPng(pixels, width, height) {
  const rowBytes = width * 4
  const raw = Buffer.alloc(height * (1 + rowBytes))

  for (let y = 0; y < height; y++) {
    const rawOffset = y * (1 + rowBytes)
    raw[rawOffset] = 0 // Filter 0 (None)
    pixels.copy(raw, rawOffset + 1, y * rowBytes, (y + 1) * rowBytes)
  }

  const deflated = zlib.deflateSync(raw, { level: 9 })

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8
  ihdrData[9] = 6  // RGBA
  ihdrData[10] = 0 // Deflate
  ihdrData[11] = 0 // Filter 0
  ihdrData[12] = 0 // Progressive / Interlace: 0 (No interlace for fast web rendering)

  const ihdrChunk = makeChunk('IHDR', ihdrData)
  const idatChunk = makeChunk('IDAT', deflated)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk])
}

export function optimizePng(filePath, maxDim = 500) {
  if (!fs.existsSync(filePath)) return

  const origSize = fs.statSync(filePath).size
  const buf = fs.readFileSync(filePath)

  if (buf.readUInt32BE(0) !== 0x89504e47 || buf.readUInt32BE(4) !== 0x0d0a1a0a) return

  const { width, height, rgba } = decodePngToRgba(buf)
  const scale = Math.min(1, maxDim / Math.max(width, height))

  const dstW = Math.max(1, Math.round(width * scale))
  const dstH = Math.max(1, Math.round(height * scale))

  const resizedRgba = (dstW === width && dstH === height) ? rgba : resizeRgba(rgba, width, height, dstW, dstH)
  const outBuf = encodeRgbaToPng(resizedRgba, dstW, dstH)

  fs.writeFileSync(filePath, outBuf)
  const newSize = outBuf.length
  console.log(`[PNG Fixed] ${path.basename(filePath)}: from ${width}x${height} (${(origSize / 1024).toFixed(1)} KB) -> ${dstW}x${dstH} (${(newSize / 1024).toFixed(1)} KB)`)
}

// Target specifically logokiri3.png and ensure it is crystal clear
try {
  optimizePng(path.join(rootDir, 'logokiri3.png'), 500)
} catch (e) {
  console.error('Error optimizing logokiri3.png:', e)
}

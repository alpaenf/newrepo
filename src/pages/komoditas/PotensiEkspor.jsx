import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import ExportToolbar from '../../components/ExportToolbar.jsx'
import ExportMap from '../../components/ExportMap.jsx'
import EksporUmkmDetailPanel from '../../components/EksporUmkmDetailPanel.jsx'
import UmkmRankingList from '../../components/UmkmRankingList.jsx'
import EksporSummaryPanel from '../../components/EksporSummaryPanel.jsx'
import { ShieldCheck } from '../../components/icons.jsx'
import { exportUmkm, tierFromReadiness } from '../../data/exportData.js'
import { kabupatenBoundaries } from '../../data/kabupatenBoundaries.js'

const CSV_HEADERS = [
  'ID UMKM',
  'Nama Usaha',
  'Pemilik / PIC',
  'No. HP',
  'Kabupaten/Kota',
  'Kecamatan',
  'Latitude',
  'Longitude',
  'Komoditas',
  'HS Code',
  'Produksi Bulan Ini',
  'Satuan',
  'Status Pendanaan',
  'Sumber Pendanaan',
  'Jumlah Pendanaan',
  'Sertifikasi',
  'Negara Tujuan',
  'Nilai Ekspor (Rp)',
  'Riwayat Ekspor',
  'Link Google Maps',
  'Skor Kesiapan Ekspor'
]

function toCsvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function formatHistoryExport(history) {
  return history.map((h) => `${h.tahun}|${h.negara}|${h.volume}|${h.nilai}`).join('; ')
}

function parseHistoryExport(text) {
  if (!text) return []
  return text
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [tahun, negara, volume, nilai] = s.split('|').map((v) => v.trim())
      return {
        tahun: parseInt(tahun) || 0,
        negara: negara || '',
        volume: volume || '',
        nilai: parseInt((nilai || '').replace(/[^\d]/g, '')) || 0
      }
    })
}

function reconstructCoord(raw, kind) {
  const neg = String(raw).trim().startsWith('-')
  const digits = String(raw).replace(/[^\d]/g, '')
  if (!digits) return NaN
  if (kind === 'lat') {
    const n = parseFloat((neg ? '-' : '') + digits[0] + '.' + digits.slice(1))
    if (n >= -12 && n <= 6) return n
    return parseFloat((neg ? '-' : '') + digits.slice(0, 2) + '.' + digits.slice(2))
  }
  if (digits.length >= 5) {
    const n3 = parseFloat(digits.slice(0, 3) + '.' + digits.slice(3))
    if (n3 >= 95 && n3 <= 141) return n3
  }
  const n2 = parseFloat(digits.slice(0, 2) + '.' + digits.slice(2))
  if (n2 >= 95 && n2 <= 141) return n2
  return parseFloat(digits[0] + '.' + digits.slice(1))
}

function parseCoord(raw, kind) {
  if (raw == null) return NaN
  const s = String(raw).trim()
  if (!s) return NaN
  if (/^-?\d{1,3}(\.\d{3})+,\d+$/.test(s)) {
    return parseFloat(s.replace(/\./g, '').replace(',', '.'))
  }
  if (/^-?\d+,\d+$/.test(s)) return parseFloat(s.replace(',', '.'))
  const dots = (s.match(/\./g) || []).length
  if (dots <= 1 && /^-?\d+(\.\d+)?$/.test(s)) {
    const n = parseFloat(s)
    if (kind === 'lat' && n >= -12 && n <= 6) return n
    if (kind === 'lng' && n >= 95 && n <= 141) return n
    return reconstructCoord(s, kind)
  }
  return reconstructCoord(s, kind)
}

if (import.meta.env.DEV) {
  console.assert(Math.abs(parseCoord('-74.344.336', 'lat') - -7.4344336) < 1e-9)
  console.assert(Math.abs(parseCoord('10.937.591', 'lng') - 109.37591) < 1e-9)
  console.assert(Math.abs(parseCoord('-7.3882', 'lat') - -7.3882) < 1e-9)
  console.assert(Math.abs(parseCoord('109.3631', 'lng') - 109.3631) < 1e-9)
}

function parseGmapsUrl(url) {
  if (!url) return null
  try {
    const decodedUrl = decodeURIComponent(url)
    const match1 = decodedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match1) return { lat: parseFloat(match1[1]), lng: parseFloat(match1[2]) }
    const match2 = decodedUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match2) return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) }
    const match3 = decodedUrl.match(/\/maps\/(?:place|dir|search)\/(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match3) return { lat: parseFloat(match3[1]), lng: parseFloat(match3[2]) }
  } catch (err) {
    console.error('Failed to parse Google Maps URL:', err)
  }
  return null
}

function parseCsvText(text, fileIndex = 0) {
  const lines = text.split(/\r?\n/)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^[\uFEFF"]|["]$/g, ''))

  const findIdx = (...keywords) => {
    return headers.findIndex((h) => {
      const hl = h.toLowerCase()
      return keywords.some((kw) => {
        if (kw.length <= 3) return hl === kw || hl.startsWith(kw + ' ') || hl.endsWith(' ' + kw)
        return hl.includes(kw)
      })
    })
  }

  const idIdx = findIdx('id umkm', 'id')
  const nameIdx = findIdx('nama usaha', 'nama toko', 'nama warung', 'nama umkm', 'usaha', 'nama')
  const ownerIdx = findIdx('pemilik', 'pengusaha', 'pic', 'kontak person')
  const phoneIdx = findIdx('no. hp', 'no hp', 'telepon', 'telp', 'whatsapp', 'hp')
  const regencyIdx = findIdx('kabupaten', 'kota', 'kab')
  const kecamatanIdx = findIdx('kecamatan')
  const latIdx = findIdx('latitude', 'lat')
  const lngIdx = findIdx('longitude', 'lng', 'long')
  const komoditasIdx = findIdx('komoditas', 'komoditi')
  const hsIdx = findIdx('hs code', 'hs')
  const volumeIdx = findIdx('volume produksi', 'produksi bulan ini', 'produksi', 'volume')
  const satuanIdx = findIdx('satuan', 'unit')
  const omzetIdx = findIdx('omzet bulan ini', 'omset bulan ini', 'omzet', 'omset')
  const statusIdx = findIdx('status pendanaan', 'status')
  const sumberIdx = findIdx('sumber')
  const jumlahIdx = findIdx('jumlah pendanaan', 'jumlah')
  const sertifikasiIdx = findIdx('sertifikasi', 'sertif')
  const negaraIdx = findIdx('negara tujuan', 'negara')
  const nilaiIdx = findIdx('nilai ekspor', 'nilai')
  const riwayatIdx = findIdx('riwayat ekspor', 'riwayat')
  const mapsIdx = findIdx('link google maps', 'gmaps', 'link maps', 'link')
  const scoreIdx = findIdx('skor kesiapan', 'kesiapan', 'skor')

  if (nameIdx === -1) return []

  const parsedData = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const cols = []
    let insideQuotes = false
    let currentField = ''
    for (let c = 0; c < line.length; c++) {
      const char = line[c]
      if (char === '"') {
        if (insideQuotes) {
          if (line[c + 1] === '"') {
            currentField += '"'
            c++
          } else {
            insideQuotes = false
          }
        } else if (currentField.length === 0) {
          insideQuotes = true
        } else {
          currentField += '"'
        }
      } else if (char === ',' && !insideQuotes) {
        cols.push(currentField.trim())
        currentField = ''
      } else {
        currentField += char
      }
    }
    cols.push(currentField.trim())

    const cleanCols = cols.map((val) => val.trim())
    const get = (idx) => (idx !== -1 ? cleanCols[idx] : '')

    const name = get(nameIdx)
    const mapsLink = get(mapsIdx)

    let lat = latIdx !== -1 ? parseCoord(cleanCols[latIdx], 'lat') : NaN
    let lng = lngIdx !== -1 ? parseCoord(cleanCols[lngIdx], 'lng') : NaN
    if ((isNaN(lat) || isNaN(lng)) && mapsLink) {
      const coords = parseGmapsUrl(mapsLink)
      if (coords) {
        lat = coords.lat
        lng = coords.lng
      }
    }

    if (!name || isNaN(lat) || isNaN(lng)) continue

    const score = scoreIdx !== -1 ? parseInt(cleanCols[scoreIdx]) || 50 : 50
    const tier = tierFromReadiness(score)
    const volumeProduksi = volumeIdx !== -1 ? parseInt(cleanCols[volumeIdx]) || 0 : 0
    const nilaiEkspor = nilaiIdx !== -1 ? parseInt((get(nilaiIdx) || '').replace(/[^\d]/g, '')) || 0 : 0
    const omzet = omzetIdx !== -1 ? parseInt((get(omzetIdx) || '').replace(/[^\d]/g, '')) || 0 : 0
    const statusRaw = (get(statusIdx) || '').toLowerCase()
    const status = /\b(sudah|ya|mendapat|ada|funded)\b/.test(statusRaw) ? 'Sudah' : 'Belum'

    parsedData.push({
      id: get(idIdx) || `UMK-IMP-${fileIndex}-${i}`,
      name,
      owner: get(ownerIdx) || '-',
      phone: get(phoneIdx) || '-',
      regency: get(regencyIdx) || 'Lainnya',
      kecamatan: get(kecamatanIdx) || '-',
      lat,
      lng,
      komoditas: get(komoditasIdx) || 'Umum',
      hsCode: get(hsIdx) || '-',
      volumeProduksi,
      satuanProduksi: get(satuanIdx) || 'kg/bulan',
      pendanaan: {
        status,
        sumber: status === 'Sudah' ? get(sumberIdx) || 'KUR' : '',
        jumlah: status === 'Sudah' ? parseInt((get(jumlahIdx) || '').replace(/[^\d]/g, '')) || 0 : 0
      },
      sertifikasi: get(sertifikasiIdx)
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      negaraTujuan: get(negaraIdx)
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean),
      nilaiEkspor,
      omzet,
      historyExport: parseHistoryExport(get(riwayatIdx)),
      readinessScore: score,
      tier: tier.label,
      tierColor: tier.color,
      googleMapsUrl: mapsLink || '',
      recommendation:
        score >= 75
          ? 'Pertahankan kualitas dan sertifikasi, jaga konsistensi volume, serta perluas diversifikasi negara tujuan ekspor.'
          : score >= 50
          ? 'Tingkatkan kesiapan: lengkapi sertifikasi, stabilkan kapasitas produksi, dan fasilitasi akses pembiayaan.'
          : 'Perlu pendampingan: bantu proses sertifikasi, akses pembiayaan, serta perbaikan kemasan dan legalitas ekspor.'
    })
  }
  return parsedData
}

export default function PotensiEkspor({ isAdmin = true }) {
  const [komoditas, setKomoditas] = useState('Semua')
  const [kabupaten, setKabupaten] = useState('Semua')
  const [pendanaan, setPendanaan] = useState('Semua')
  const [selectedId, setSelectedId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState(exportUmkm)
  const captureRef = useRef(null)

  const filteredData = useMemo(() => {
    return data.filter((u) => {
      if (komoditas !== 'Semua' && u.komoditas !== komoditas) return false
      if (kabupaten !== 'Semua' && u.regency !== kabupaten) return false
      if (pendanaan !== 'Semua' && (u.pendanaan?.status ?? 'Belum') !== pendanaan) return false
      return true
    })
  }, [data, komoditas, kabupaten, pendanaan])

  const komoditasFilterOptions = useMemo(() => {
    return ['Semua', ...new Set(data.map((u) => u.komoditas))]
  }, [data])

  async function handleExport() {
    if (!captureRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(captureRef.current, { useCORS: true, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `peta-potensi-ekspor-${komoditas === 'Semua' ? 'semua' : komoditas.toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      window.alert('Gagal mengekspor peta. Coba lagi beberapa saat lagi.')
    } finally {
      setExporting(false)
    }
  }

  function handleExportExcel() {
    const rows = filteredData.map((u) => [
      u.id,
      u.name,
      u.owner,
      u.phone,
      u.regency,
      u.kecamatan,
      u.lat,
      u.lng,
      u.komoditas,
      u.hsCode,
      u.volumeProduksi,
      u.satuanProduksi,
      u.pendanaan?.status ?? 'Belum',
      u.pendanaan?.sumber ?? '',
      u.pendanaan?.jumlah ?? 0,
      u.sertifikasi.join('; '),
      u.negaraTujuan.join('; '),
      u.nilaiEkspor,
      formatHistoryExport(u.historyExport),
      u.googleMapsUrl || '',
      u.readinessScore
    ])

    const csvContent = [
      CSV_HEADERS.map(toCsvCell).join(','),
      ...rows.map((row) => row.map(toCsvCell).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-potensi-ekspor.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleImportExcel(filesInput) {
    const files = Array.isArray(filesInput) ? filesInput : [filesInput]
    if (!files || files.length === 0) return

    function worksheetToCsv(worksheet) {
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
      return rows
        .map((row) =>
          row
            .map((cell) => {
              const s = String(cell == null ? '' : cell)
              return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
            })
            .join(',')
        )
        .join('\n')
    }

    let allParsedData = []
    const errorMessages = []

    for (let fIdx = 0; fIdx < files.length; fIdx++) {
      const file = files[fIdx]
      try {
        const ext = file.name.split('.').pop().toLowerCase()
        let csvString = ''

        if (ext === 'xlsx' || ext === 'xls') {
          const arrayBuffer = await file.arrayBuffer()
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          csvString = worksheetToCsv(worksheet)
        } else {
          csvString = await file.text()
        }

        const fileData = parseCsvText(csvString, fIdx)
        if (fileData.length > 0) {
          allParsedData = allParsedData.concat(fileData)
        } else {
          errorMessages.push(`${file.name}: Tidak ada baris data valid yang terdeteksi.`)
        }
      } catch (err) {
        errorMessages.push(`${file.name}: ${err.message}`)
      }
    }

    if (allParsedData.length === 0) {
      window.alert(`Gagal membaca file:\n\n${errorMessages.join('\n')}`)
      return
    }

    setData(allParsedData)
    setSelectedId(null)
    const labelFiles = files.length > 1 ? `${files.length} file Excel/CSV` : files[0].name
    window.alert(`Berhasil memuat ${allParsedData.length} UMKM dari ${labelFiles}! Peta dan peringkat telah diperbarui.`)
  }

  function handleOpenPendanaan(umkmId) {
    window.alert(`Membuka pengajuan pendanaan untuk ${umkmId} (halaman terpisah).`)
  }

  const tierLegend = [
    { label: 'Siap Ekspor', color: '#22B07D' },
    { label: 'Potensial', color: '#F5A623' },
    { label: 'Perlu Pendampingan', color: '#E85D2F' }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-900">Potensi Ekspor</h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-0.5 sm:mt-1">
          {data.length === 0
            ? 'Peta UMKM siap ekspor. Silakan import file Excel/CSV untuk memuat data UMKM.'
            : `${filteredData.length} dari ${data.length} UMKM siap ekspor di Banyumas Raya.`}
        </p>
      </div>

      <ExportToolbar
        komoditas={komoditas}
        onKomoditasChange={(v) => {
          setKomoditas(v)
          setSelectedId(null)
        }}
        kabupaten={kabupaten}
        onKabupatenChange={(v) => {
          setKabupaten(v)
          setSelectedId(null)
        }}
        pendanaan={pendanaan}
        onPendanaanChange={(v) => {
          setPendanaan(v)
          setSelectedId(null)
        }}
        onExport={handleExport}
        exporting={exporting}
        onExportExcel={handleExportExcel}
        onImportExcel={handleImportExcel}
        komoditasOptions={komoditasFilterOptions}
        isAdmin={isAdmin}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 sm:gap-6 items-stretch">
        <div ref={captureRef} className="relative h-[420px] xs:h-[480px] sm:h-[540px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden border border-surface-border shadow-card">
          <ExportMap
            selectedId={selectedId}
            onSelect={setSelectedId}
            selectedKabupaten={kabupaten === 'Semua' ? null : kabupaten}
            onSelectKabupaten={(name) => {
              setKabupaten((prev) => (prev === name ? 'Semua' : name))
              setSelectedId(null)
            }}
            data={filteredData}
          />
          <div className="absolute bottom-2 left-2 z-[500] flex flex-col gap-1.5 bg-white/95 backdrop-blur rounded-lg shadow-card border border-surface-border px-2.5 py-1.5">
            <div className="flex items-center gap-3">
              {tierLegend.map((t) => (
                <span key={t.label} className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-ink-700 whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  {t.label}
                </span>
              ))}
            </div>
            <div className="border-t border-surface-border pt-1.5 flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-semibold text-ink-500 whitespace-nowrap">Wilayah Barlingmascakeb</span>
              {kabupatenBoundaries.map((kb) => (
                <span key={kb.kode} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-ink-700 whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: kb.color, opacity: 0.55 }} />
                  {kb.name}
                </span>
              ))}
            </div>
          </div>
          {selectedId ? (
            <EksporUmkmDetailPanel
              umkmId={selectedId}
              onClose={() => setSelectedId(null)}
              onOpenPendanaan={handleOpenPendanaan}
              data={filteredData}
            />
          ) : kabupaten !== 'Semua' ? (
            <EksporSummaryPanel
              kabupaten={kabupaten}
              data={data}
              onClose={() => setKabupaten('Semua')}
              onSelectUmkm={(id) => setSelectedId(id)}
            />
          ) : null}
        </div>

        <div className="h-[380px] sm:h-[500px] lg:h-[600px]">
          <UmkmRankingList
            selectedId={selectedId}
            onSelect={setSelectedId}
            data={filteredData}
            scopeLabel={kabupaten !== 'Semua' ? `Kab. ${kabupaten}` : null}
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 text-xs text-ink-300 bg-white border border-surface-border rounded-xl p-3 sm:p-3.5">
        <ShieldCheck size={15} className="text-ink-300 shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs leading-relaxed">
          Data potensi ekspor merupakan agregat profil UMKM binaan dan disajikan untuk mendukung fasilitasi
          ekspor, pembiayaan, dan pendampingan sertifikasi di wilayah Banyumas Raya.
        </p>
      </div>
    </div>
  )
}

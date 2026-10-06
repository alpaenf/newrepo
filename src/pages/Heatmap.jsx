import { useRef, useState, useMemo } from 'react'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import HeatmapToolbar from '../components/HeatmapToolbar.jsx'
import HeatmapMap from '../components/HeatmapMap.jsx'
import HeatmapLegend from '../components/HeatmapLegend.jsx'
import KecamatanDetailPanel from '../components/KecamatanDetailPanel.jsx'
import KecamatanRankingList from '../components/KecamatanRankingList.jsx'
import HeatmapPieChart from '../components/HeatmapPieChart.jsx'
import { ShieldCheck, Store, ArrowLeftRight, Banknote } from '../components/icons.jsx'
import { kecamatanZonation } from '../data/heatmapData.js'
import { qrisRealData, qrisMonthlyByCategory } from '../data/qrisData.js'

const formatRp = (v) => `Rp ${Math.round(v).toLocaleString('id-ID')}`

function parseGmapsUrl(url) {
  if (!url) return null
  try {
    const decodedUrl = decodeURIComponent(url)
    
    // Pattern 1: @latitude,longitude
    const match1 = decodedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match1) {
      return { lat: parseFloat(match1[1]), lng: parseFloat(match1[2]) }
    }
    
    // Pattern 2: q=latitude,longitude
    const match2 = decodedUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match2) {
      return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) }
    }

    // Pattern 3: maps/place/latitude,longitude
    const match3 = decodedUrl.match(/\/maps\/(?:place|dir|search)\/(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match3) {
      return { lat: parseFloat(match3[1]), lng: parseFloat(match3[2]) }
    }
  } catch (err) {
    console.error('Failed to parse Google Maps URL:', err)
  }
  return null
}

export default function Heatmap({ isAdmin = true }) {
  const [metric, setMetric] = useState('merchantDensity')
  const [range, setRange] = useState('2026')
  const [month, setMonth] = useState('08')
  const [category, setCategory] = useState('TOTAL')
  const [selectedId, setSelectedId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [importedData, setImportedData] = useState(null)
  const captureRef = useRef(null)

  const baseKecamatan = importedData || kecamatanZonation

  const data = useMemo(() => {
    const selectedYear = range
    const selectedCat = category

    // Sum of zonation scores for each kabupaten
    const regencyWeights = {}
    baseKecamatan.forEach(k => {
      const reg = k.regency.trim()
      if (!regencyWeights[reg]) {
        regencyWeights[reg] = 0
      }
      regencyWeights[reg] += k.zonationScore || 50
    })

    const mapped = baseKecamatan.map(k => {
      const reg = k.regency.trim()
      const kabRealData = qrisRealData[reg]?.[selectedYear] || {}
      const catRealData = kabRealData[selectedCat] || { volume: 0, nominal: 0 }
      const realMerchants = kabRealData.merchants || 0

      const totalWeight = regencyWeights[reg] || 1
      const proportion = (k.zonationScore || 50) / totalWeight

      const distributedMerchants = Math.round(realMerchants * proportion)
      const distributedVolume = Math.round(catRealData.volume * proportion)
      const distributedNominal = Math.round(catRealData.nominal * proportion)

      return {
        ...k,
        indicators: {
          ...k.indicators,
          merchants: distributedMerchants,
          transactionVolume7d: distributedVolume,
          transactionVolume30d: Math.round(distributedVolume * 4),
          transactionVolumeMonthly: distributedNominal,
        }
      }
    })

    // Normalize metric weights for Heatmap
    let maxMerchants = 1
    let maxVolume = 1
    mapped.forEach(k => {
      if (k.indicators.merchants > maxMerchants) maxMerchants = k.indicators.merchants
      if (k.indicators.transactionVolume7d > maxVolume) maxVolume = k.indicators.transactionVolume7d
    });

    return mapped.map(k => ({
      ...k,
      metricWeights: {
        ...k.metricWeights,
        merchantDensity: k.indicators.merchants / maxMerchants,
        transactionVolume: k.indicators.transactionVolume7d / maxVolume
      }
    }))
  }, [baseKecamatan, range, category])

  const kpiTotals = useMemo(() => {
    const selectedKecamatan = data.find(k => k.id === selectedId)
    const activeRegency = selectedKecamatan ? selectedKecamatan.regency.trim() : null

    let totalMerchants = 0
    let totalVolume = 0
    let totalNominal = 0

    const kabList = ['Banyumas', 'Cilacap', 'Purbalingga', 'Banjarnegara']
    kabList.forEach(kab => {
      if (!activeRegency || activeRegency.toLowerCase().includes(kab.toLowerCase())) {
        const kabData = qrisRealData[kab]?.[range] || {}
        totalMerchants += kabData.merchants || 0

        if (range === '2026' && month && month !== 'ALL' && qrisMonthlyByCategory['2026']?.[month]?.[kab]) {
          const mData = qrisMonthlyByCategory['2026'][month][kab]
          if (category === 'TOTAL') {
            ;['UMI', 'UKE', 'UME', 'UBE'].forEach(c => {
              totalVolume += mData[c]?.volume || 0
              totalNominal += mData[c]?.nominal || 0
            })
          } else if (mData[category]) {
            totalVolume += mData[category]?.volume || 0
            totalNominal += mData[category]?.nominal || 0
          } else {
            const catData = kabData[category] || { volume: 0, nominal: 0 }
            totalVolume += Math.round(catData.volume / 12)
            totalNominal += Math.round(catData.nominal / 12)
          }
        } else {
          const catData = kabData[category] || { volume: 0, nominal: 0 }
          totalVolume += catData.volume || 0
          totalNominal += catData.nominal || 0
        }
      }
    })

    return {
      merchants: totalMerchants,
      volume: totalVolume,
      nominal: totalNominal,
      regencyName: activeRegency
    }
  }, [data, selectedId, range, month, category])

  async function handleExport() {
    if (!captureRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(captureRef.current, { useCORS: true, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `heatmap-zonasi-${metric}-${range}-${category}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      window.alert('Gagal mengekspor peta. Coba lagi beberapa saat lagi.')
    } finally {
      setExporting(false)
    }
  }

  function handleExportExcel() {
    const headers = [
      'ID Kecamatan',
      'Kabupaten/Kota',
      'Kecamatan',
      'Latitude',
      'Longitude',
      'Skor Zonasi',
      'Kategori Zona',
      'Jumlah Merchant (Riil)',
      'Volume Transaksi (Riil)',
      'Nominal Transaksi (Rp Riil)',
      'Risiko Fraud (%)',
      'Pertumbuhan (%)',
      'Industri Dominan',
      'Link Google Maps'
    ]

    const rows = data.map((k) => [
      k.id,
      k.regency,
      k.name,
      k.lat,
      k.lng,
      k.zonationScore,
      k.tier,
      k.indicators.merchants,
      k.indicators.transactionVolume7d,
      k.indicators.transactionVolumeMonthly,
      Math.round(k.indicators.fraudRisk * 100),
      k.indicators.growthPct,
      k.dominantIndustry,
      k.googleMapsUrl || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-zonasi-qris-${range}-${category}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  function parseCsvText(text, fileIndex = 0) {
    const lines = text.split(/\r?\n/)
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/^[\uFEFF"]|["]$/g, ''))
    
    const nameIdx = headers.findIndex(h => h.toLowerCase().includes('kecamatan'))
    const regencyIdx = headers.findIndex(h => h.toLowerCase().includes('kabupaten') || h.toLowerCase().includes('kota'))
    const latIdx = headers.findIndex(h => h.toLowerCase().includes('latitude') || h.toLowerCase().includes('lat'))
    const lngIdx = headers.findIndex(h => h.toLowerCase().includes('longitude') || h.toLowerCase().includes('lng'))
    const scoreIdx = headers.findIndex(h => h.toLowerCase().includes('skor') || h.toLowerCase().includes('score') || h.toLowerCase().includes('zonasi'))
    const merchantsIdx = headers.findIndex(h => h.toLowerCase().includes('merchant'))
    const qrisIdx = headers.findIndex(h => h.toLowerCase().includes('qris'))
    const volumeIdx = headers.findIndex(h => h.toLowerCase().includes('volume') || h.toLowerCase().includes('transaksi'))
    const fraudIdx = headers.findIndex(h => h.toLowerCase().includes('fraud') || h.toLowerCase().includes('risiko'))
    const growthIdx = headers.findIndex(h => h.toLowerCase().includes('tumbuh') || h.toLowerCase().includes('growth') || h.toLowerCase().includes('pertumbuhan'))
    const industryIdx = headers.findIndex(h => h.toLowerCase().includes('industri') || h.toLowerCase().includes('industry'))
    const idIdx = headers.findIndex(h => h.toLowerCase().includes('id'))
    
    const mapsLinkIdx = headers.findIndex(
      h => h.toLowerCase().includes('link google maps') || 
           h.toLowerCase().includes('google maps link') || 
           h.toLowerCase().includes('link maps') || 
           h.toLowerCase().includes('gmaps') || 
           h.toLowerCase().includes('link')
    )
    const shopNameIdx = headers.findIndex(
      h => h.toLowerCase().includes('toko') || 
           h.toLowerCase().includes('warung') || 
           h.toLowerCase().includes('nama merchant') || 
           h.toLowerCase().includes('nama warung') || 
           h.toLowerCase().includes('nama toko') || 
           (h.toLowerCase().includes('nama') && !h.toLowerCase().includes('kecamatan') && !h.toLowerCase().includes('kabupaten'))
    )

    if (nameIdx === -1 && shopNameIdx === -1) {
      return []
    }

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
          insideQuotes = !insideQuotes
        } else if (char === ',' && !insideQuotes) {
          cols.push(currentField.trim())
          currentField = ''
        } else {
          currentField += char
        }
      }
      cols.push(currentField.trim())

      const cleanCols = cols.map(val => val.replace(/^["']|["']$/g, ''))

      const mapsLink = mapsLinkIdx !== -1 ? cleanCols[mapsLinkIdx] : ''
      const shopName = shopNameIdx !== -1 ? cleanCols[shopNameIdx] : ''
      const kecamatanName = nameIdx !== -1 ? cleanCols[nameIdx] : ''
      const displayName = shopName || kecamatanName

      let lat = latIdx !== -1 ? parseFloat(cleanCols[latIdx]) : NaN
      let lng = lngIdx !== -1 ? parseFloat(cleanCols[lngIdx]) : NaN

      if ((isNaN(lat) || isNaN(lng)) && mapsLink) {
        const coords = parseGmapsUrl(mapsLink)
        if (coords) {
          lat = coords.lat
          lng = coords.lng
        }
      }

      if (!displayName || isNaN(lat) || isNaN(lng)) continue

      const regency = regencyIdx !== -1 && cleanCols[regencyIdx] ? cleanCols[regencyIdx] : 'Lainnya'
      const zonationScore = scoreIdx !== -1 ? parseInt(cleanCols[scoreIdx]) || 50 : 50
      const id = idIdx !== -1 && cleanCols[idIdx] ? cleanCols[idIdx] : `KEC-IMP-${fileIndex}-${i}`
      
      const tier = zonationScore >= 75 ? 'Prime Zone' : zonationScore >= 50 ? 'Growth Zone' : 'Basic Zone'
      const tierColor = zonationScore >= 75 ? '#22B07D' : zonationScore >= 50 ? '#F5A623' : '#E85D2F'

      const merchants = merchantsIdx !== -1 ? parseInt(cleanCols[merchantsIdx]) || 100 : 100
      const qrisAdoption = qrisIdx !== -1 ? parseInt(cleanCols[qrisIdx]) || 50 : 50
      const transactionVolume7d = volumeIdx !== -1 ? parseInt(cleanCols[volumeIdx]) || 5000 : 5000
      const fraudRisk = fraudIdx !== -1 ? parseFloat(cleanCols[fraudIdx]) / 100 || 0.1 : 0.1
      const growthPct = growthIdx !== -1 ? parseFloat(cleanCols[growthIdx]) || 5 : 5
      const dominantIndustry = industryIdx !== -1 && cleanCols[industryIdx] ? cleanCols[industryIdx] : 'Umum'

      parsedData.push({
        id,
        name: displayName,
        regency,
        dominantIndustry,
        lat,
        lng,
        tier,
        tierColor,
        zonationScore,
        googleMapsUrl: mapsLink,
        metricWeights: {
          merchantDensity: zonationScore / 100,
          transactionVolume: Math.min(1, transactionVolume7d / 30000),
          fraudRisk
        },
        indicators: {
          merchants,
          qrisAdoption,
          transactionVolume7d,
          transactionVolume30d: transactionVolume7d * 4,
          transactionVolumeMonthly: transactionVolume7d * 4.3,
          fraudRisk,
          growthPct
        },
        recommendation:
          zonationScore >= 75
            ? 'Pertahankan momentum: jadikan kecamatan ini percontohan replikasi 3S (Simplifikasi, Standarisasi, Sistemisasi).'
            : zonationScore >= 50
            ? 'Tingkatkan adopsi QRIS lewat edukasi merchant baru.'
            : 'Perlu intervensi aktif: onboarding merchant tambahan dan pendampingan.'
      })
    }
    return parsedData
  }

  async function handleImportExcel(filesInput) {
    const files = Array.isArray(filesInput) ? filesInput : [filesInput]
    if (!files || files.length === 0) return

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
          csvString = XLSX.utils.sheet_to_csv(worksheet)
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

    setImportedData(allParsedData)
    setSelectedId(null)
    const labelFiles = files.length > 1 ? `${files.length} file Excel/CSV` : files[0].name
    window.alert(`Berhasil memuat ${allParsedData.length} titik lokasi dari ${labelFiles}! Peta dan peringkat telah diperbarui.`)
  }

  function handleOpenScorecard(kecamatanId) {
    window.alert(`Membuka Skor Kecamatan untuk ${kecamatanId} (halaman terpisah).`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">Heatmap Zonasi</h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5 sm:mt-1">
            {data.length === 0
              ? 'Peta zonasi interaktif. Silakan import file Excel/CSV untuk memetakan data wilayah dan industri dominan.'
              : `Peta zonasi interaktif ${data.length} kecamatan di kabupaten Banyumas Raya.`}
          </p>
        </div>
      </div>

      {/* KPI Cards for Real QRIS Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-ink-500">
              Total Merchant QRIS {kpiTotals.regencyName ? `· ${kpiTotals.regencyName}` : ''}
            </span>
            <div className="text-lg sm:text-2xl font-semibold text-ink-900 mt-1 tabular-nums">
              {kpiTotals.merchants.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-ink-400 font-medium">Merchant terdaftar</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 text-blue-600">
            <Store size={20} />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-ink-500">
              Volume Transaksi {kpiTotals.regencyName ? `· ${kpiTotals.regencyName}` : ''}
            </span>
            <div className="text-lg sm:text-2xl font-semibold text-ink-900 mt-1 tabular-nums">
              {kpiTotals.volume.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-ink-400 font-medium">Transaksi terproses</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-brand-soft text-brand">
            <ArrowLeftRight size={20} />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-ink-500">
              Nominal Transaksi {kpiTotals.regencyName ? `· ${kpiTotals.regencyName}` : ''}
            </span>
            <div className="text-lg sm:text-2xl font-semibold text-ink-900 mt-1 tabular-nums">
              {formatRp(kpiTotals.nominal)}
            </div>
            <span className="text-[10px] text-ink-400 font-medium">Nilai transaksi bruto</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Banknote size={20} />
          </div>
        </div>
      </div>

      {isAdmin && (
        <HeatmapToolbar
          metric={metric}
          onMetricChange={setMetric}
          range={range}
          onRangeChange={setRange}
          month={month}
          onMonthChange={setMonth}
          category={category}
          onCategoryChange={setCategory}
          onExport={handleExport}
          exporting={exporting}
          onExportExcel={handleExportExcel}
          onImportExcel={handleImportExcel}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 sm:gap-6 items-stretch">
        <div ref={captureRef} className="relative h-[420px] xs:h-[480px] sm:h-[540px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden border border-surface-border shadow-card">
          <HeatmapMap metric={metric} range={range} selectedId={selectedId} onSelect={setSelectedId} data={data} />
          <HeatmapLegend metric={metric} />
          {selectedId && (
            <KecamatanDetailPanel
              kecamatanId={selectedId}
              range={range}
              onClose={() => setSelectedId(null)}
              onOpenScorecard={handleOpenScorecard}
              data={data}
              isAdmin={isAdmin}
            />
          )}
        </div>

        <div className="h-[380px] sm:h-[500px] lg:h-[600px]">
          <KecamatanRankingList selectedId={selectedId} onSelect={setSelectedId} data={data} />
        </div>
      </div>

      {/* Pie Chart: Distribusi 4 Kategori (UMI, UKE, UME, UBE) & Diagram Batang Series */}
      <HeatmapPieChart
        range={range}
        onRangeChange={setRange}
        month={month}
        onMonthChange={setMonth}
        selectedId={selectedId}
        data={data}
      />

      <div className="flex items-start gap-2.5 text-xs text-ink-300 bg-white border border-surface-border rounded-xl p-3 sm:p-3.5">
        <ShieldCheck size={15} className="text-ink-300 shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs leading-relaxed">
          Heatmap pada peta merupakan agregat di sekitar titik pusat kecamatan, bukan koordinat
          individual merchant — sejalan dengan prinsip minimalisasi data pada tata kelola zona qris.
        </p>
      </div>
    </div>
  )
}
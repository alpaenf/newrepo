import { useRef, useState, useMemo } from 'react'
import html2canvas from 'html2canvas'
import {
  HeatmapToolbar,
  PajakMap,
  HeatmapLegend,
  PajakDetailPanel,
  KecamatanRankingList,
  KabupatenSummaryPanel,
  Landmark,
  ArrowLeft
} from '@/components'
import { pajakRawData, timeRangeOptions, kabupatenOptions } from '@/data/pajakData.js'
import { kabupatenPADData } from '@/data/kabupatenPADData.js'
import { banyumasPajakNegaraRaw, sdaSectorData } from '@/data/banyumasPajakNegaraData.js'
import { formatRupiah, formatNumber } from '@/utils/formatters.js'

const negaraMetricsOptions = [
  { key: 'penerimaan', label: 'Realisasi PPh Orang Pribadi' },
  { key: 'wajibPajak', label: 'Total Bayar Pajak' },
  { key: 'lapor', label: 'Total SDA' },
  { key: 'bayar', label: 'PPh Badan UMKM' }
]

export default function PajakNegara({ isAdmin = true }) {
  const [metric, setMetric] = useState('penerimaan') // 'penerimaan', 'wajibPajak', 'lapor', 'bayar'
  const [range, setRange] = useState('2024') // '2024', '2025', or '2026'
  const [kabupaten, setKabupaten] = useState('Banyumas') // KPP Pratama Purwokerto
  const [selectedId, setSelectedId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [viewMode, setViewMode] = useState('kabupaten') // start with county pin view mode
  const [selectedKabupatenId, setSelectedKabupatenId] = useState(null)
  const captureRef = useRef(null)

  const activeKab = useMemo(() => {
    return kabupatenOptions.find(k => k.key === kabupaten) || kabupatenOptions[0]
  }, [kabupaten])

  const legendTitle = useMemo(() => {
    const opt = negaraMetricsOptions.find(o => o.key === metric)
    return opt ? opt.label : ''
  }, [metric])

  const sortedKabupatenList = useMemo(() => {
    const list = [{ id: 'kab-banyumas', name: 'Banyumas' }]
    return list.map(kab => {
      let value = 0
      let displayValue = ''
      let isCount = false

      if (metric === 'penerimaan') {
        const baseVal = range === '2024' ? 641077660390 : range === '2025' ? 638283813809 : 295400000000
        value = baseVal
        displayValue = `Rp ${(value / 1e9).toFixed(1)} M`
      } else if (metric === 'wajibPajak') {
        const baseVal = range === '2024' ? 10850 : range === '2025' ? 10247 : 3289
        value = baseVal
        displayValue = new Intl.NumberFormat('id-ID').format(value) + ' orang'
        isCount = true
      } else if (metric === 'lapor') {
        const baseVal = range === '2024' ? 115177566395 : range === '2025' ? 58529127939 : 28329171069
        value = baseVal
        displayValue = `Rp ${(value / 1e9).toFixed(1)} M`
      } else if (metric === 'bayar') {
        const baseVal = range === '2024' ? 160269415097 : range === '2025' ? 159570953452 : 73850000000
        value = baseVal
        displayValue = `Rp ${(value / 1e9).toFixed(1)} M`
      }

      return {
        ...kab,
        value,
        displayValue,
        isCount
      }
    })
  }, [metric, range])



  const data = useMemo(() => {
    // Filter data berdasarkan kabupaten terpilih
    const filteredRaw = pajakRawData.filter(item => item.regency === kabupaten)

    // Cari nilai maksimum untuk penskalaan bobot heatmap
    const yearValues = filteredRaw.map(item => {
      let val = 0
      const name = item.name
      const entry = banyumasPajakNegaraRaw[name]
      if (entry) {
        const yd = entry.years[range] || entry.years['2024']
        if (metric === 'penerimaan') {
          val = yd.penerimaan
        } else if (metric === 'wajibPajak') {
          val = yd.bayar
        } else if (metric === 'lapor') {
          const sector = sdaSectorData.find(s => s.code === entry.sectorCode)
          val = sector ? sector[`y${range}`] || sector.y2024 : 0
        } else if (metric === 'bayar') {
          val = Math.round(yd.penerimaan * 0.25)
        }
      } else {
        const yd = item.years[range] || item.years['2024']
        val = yd[metric] || 0
      }
      return val
    })
    const maxVal = Math.max(...yearValues, 1)

    return filteredRaw.map(item => {
      const name = item.name
      const entry = banyumasPajakNegaraRaw[name]
      
      let yd = item.years[range] || item.years['2024']
      let currentVal = yd[metric] || 0
      let dominantIndustry = item.dominantIndustry
      let sectorCode = ""

      if (entry) {
        const entryYd = entry.years[range] || entry.years['2024']
        dominantIndustry = entry.dominantIndustry
        sectorCode = entry.sectorCode
        if (metric === 'penerimaan') {
          currentVal = entryYd.penerimaan
        } else if (metric === 'wajibPajak') {
          currentVal = entryYd.bayar
        } else if (metric === 'lapor') {
          const sector = sdaSectorData.find(s => s.code === entry.sectorCode)
          currentVal = sector ? sector[`y${range}`] || sector.y2024 : 0
        } else if (metric === 'bayar') {
          currentVal = Math.round(entryYd.penerimaan * 0.25)
        }
        yd = entryYd
      }

      const weight = currentVal / maxVal

      // Breakdown Pajak Pemerintah Pusat (seperti PPN dan PPh berdasarkan total realisasi dari gambar)
      let ppn = 0
      let pph = 0
      let penerimaanTotal = 0

      if (entry) {
        ppn = Math.round(yd.penerimaan * 0.60 / 1000000) // dalam Juta
        pph = Math.round(yd.penerimaan * 0.40 / 1000000) // dalam Juta
        penerimaanTotal = Math.round(yd.penerimaan / 1000000) // total dalam Juta
      } else {
        ppn = Math.round(yd.penerimaan * 0.60 / 1000000)
        pph = Math.round(yd.penerimaan * 0.40 / 1000000)
        penerimaanTotal = Math.round(yd.penerimaan / 1000000)
      }

      // Hitung pertumbuhan dibanding tahun sebelumnya
      let growthPct = 0
      if (entry) {
        if (range === '2025') {
          const prevVal = entry.years['2024'].penerimaan
          growthPct = Math.round(((yd.penerimaan - prevVal) / prevVal) * 100 * 10) / 10
        } else if (range === '2026') {
          const prevVal = entry.years['2025'].penerimaan
          growthPct = Math.round(((yd.penerimaan - prevVal) / prevVal) * 100 * 10) / 10
        }
      } else {
        if (range === '2025') {
          const prevVal = item.years['2024'].penerimaan
          growthPct = Math.round(((yd.penerimaan - prevVal) / prevVal) * 100 * 10) / 10
        } else if (range === '2026') {
          const prevVal = item.years['2025'].penerimaan
          growthPct = Math.round(((yd.penerimaan - prevVal) / prevVal) * 100 * 10) / 10
        }
      }

      const score = Math.round(weight * 100)
      const tier = score >= 75 ? 'Kategori Prima' : score >= 45 ? 'Kategori Berkembang' : 'Kategori Awal'
      const tierColor = score >= 75 ? '#22B07D' : score >= 45 ? '#F5A623' : '#E85D2F'

      let sdaSectorName = ""
      let sdaSectorValue = 0
      if (sectorCode) {
        const sector = sdaSectorData.find(s => s.code === sectorCode)
        if (sector) {
          sdaSectorName = sector.name
          sdaSectorValue = sector[`y${range}`] || sector.y2024
        }
      }

      return {
        id: item.id,
        name: item.name,
        regency: item.regency,
        dominantIndustry,
        lat: item.lat,
        lng: item.lng,
        tier,
        tierColor,
        zonationScore: score,
        metricWeights: {
          penerimaan: weight,
          wajibPajak: weight,
          lapor: weight,
          bayar: weight
        },
        indicators: {
          merchants: yd.wp,
          qrisAdoption: Math.round((yd.lapor / yd.wp) * 100),
          kepatuhanBayar: Math.round((yd.bayar / yd.wp) * 100),
          ppn,
          pph,
          penerimaanTotal,
          growthPct,
          fraudRisk: 0,
          sdaSectorName,
          sdaSectorValue
        },
        recommendation: score >= 75 
          ? 'Sektor industri/jasa berkontribusi tinggi. Optimalkan pengawasan transaksi PPN e-Commerce dan pemeriksaan SPT Masa PPh Badan.' 
          : score >= 45 
          ? 'Gencarkan sosialisasi PPh Final UMKM PP 55/2022 (tarif 0.5%) untuk onboarding pelaku usaha kecil ke ekosistem formal.' 
          : 'Perlu perluasan basis data perpajakan dan pemadanan NIK-NPWP untuk meningkatkan tax ratio wilayah.'
      }
    })
  }, [range, metric, kabupaten])

  async function handleExport() {
    if (!captureRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(captureRef.current, { useCORS: true, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `pajak-negara-heatmap-${metric}-${range}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      window.alert('Gagal mengekspor peta. Coba lagi beberapa saat lagi.')
    } finally {
      setExporting(false)
    }
  }

  function handleOpenScorecard(kecamatanId) {
    const k = data.find(item => item.id === kecamatanId)
    window.alert(`Membuka Laporan Pajak KPP Pratama untuk ${k ? k.name : kecamatanId}.`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">Analisis Pajak Pemerintah Pusat (PPN, PPh, SPT)</h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5 sm:mt-1">
            Pemetaan kontribusi PPh Orang Pribadi & Badan serta tingkat kepatuhan SPT Tahunan di Kabupaten Banyumas.
          </p>
        </div>

        {/* Action Controls / Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {viewMode === 'kecamatan' && (
            <button
              onClick={() => {
                setViewMode('kabupaten')
                setSelectedKabupatenId(null)
                setSelectedId(null)
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-border text-ink-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <ArrowLeft size={14} />
              Kembali ke Peta
            </button>
          )}
        </div>
      </div>

      {/* Alert Note - KPP Pratama Purwokerto Kemitraan */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 text-blue-800 flex items-start gap-2.5 shadow-sm text-xs sm:text-sm font-sans">
        <Landmark className="text-blue-500 shrink-0 mt-0.5 animate-pulse" size={16} />
        <div>
          <p className="font-semibold text-blue-900">Catatan Analisis Pajak Pemerintah Pusat</p>
          <p className="text-[11px] sm:text-xs text-blue-700 mt-0.5 leading-relaxed">
            Data perpajakan negara disajikan khusus untuk wilayah <strong>Kabupaten Banyumas</strong> atas kerja sama dan penyediaan data resmi dari <strong>Kantor Pelayanan Pajak (KPP) Pratama Purwokerto</strong>. Pilihan kabupaten lain tidak tersedia pada menu Pajak Pemerintah Pusat.
          </p>
        </div>
      </div>

      <HeatmapToolbar
        metric={metric}
        onMetricChange={setMetric}
        range={range}
        onRangeChange={setRange}
        onExport={handleExport}
        exporting={exporting}
        onImportExcel={() => window.alert('Fasilitas import data pajak dinonaktifkan pada mode demo.')}
        metricOptions={negaraMetricsOptions}
        timeRangeOptions={timeRangeOptions}
        showExport={false}
        isAdmin={isAdmin}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 sm:gap-6 items-stretch">
        <div ref={captureRef} className="relative h-[420px] xs:h-[480px] sm:h-[540px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden border border-surface-border shadow-card">
          <PajakMap
            metric={metric}
            range={range}
            selectedId={selectedId}
            onSelect={setSelectedId}
            data={data}
            selectedRegency={kabupaten}
            regencyCenter={activeKab.center}
            regencyZoom={activeKab.zoom}
            viewMode={viewMode}
            onSelectKabupaten={setSelectedKabupatenId}
            selectedKabupatenId={selectedKabupatenId}
            isDaerah={false}
          />
          <HeatmapLegend metric={metric} title={legendTitle} />

          {viewMode === 'kabupaten' && selectedKabupatenId && (
            <KabupatenSummaryPanel
              kabupaten={kabupatenPADData.find(k => k.id === selectedKabupatenId)}
              onClose={() => setSelectedKabupatenId(null)}
              onDrillDown={(kabName) => {
                setViewMode('kecamatan')
                setSelectedKabupatenId(null)
                setSelectedId(null)
              }}
              metric={metric}
            />
          )}

          {viewMode === 'kecamatan' && selectedId && (
            <PajakDetailPanel
              kecamatanId={selectedId}
              onClose={() => setSelectedId(null)}
              onOpenScorecard={handleOpenScorecard}
              data={data}
              isDaerah={false}
              metric={metric}
            />
          )}
        </div>

        <div className="h-[380px] sm:h-[500px] lg:h-[600px]">
          {viewMode === 'kabupaten' ? (
            <div className="bg-white border border-surface-border rounded-xl sm:rounded-2xl p-4 shadow-card h-full flex flex-col">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Peringkat Kabupaten</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                  {legendTitle}
                </span>
              </div>
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {sortedKabupatenList.map((kab, index) => {
                  const isActive = kab.id === selectedKabupatenId
                  return (
                    <div
                      key={kab.id}
                      onClick={() => setSelectedKabupatenId(kab.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                        isActive
                          ? 'bg-brand/5 border-brand/20 shadow-sm'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-slate-100 text-slate-700' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0 font-sans">
                        <p className="text-xs font-bold text-ink-800 truncate">Kab. {kab.name}</p>
                        <p className="text-[10px] text-ink-400">Pajak Pemerintah Pusat</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-blue-700">
                          {kab.displayValue}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <KecamatanRankingList selectedId={selectedId} onSelect={setSelectedId} data={data} scoreLabel="Skor Pajak" />
          )}
        </div>
      </div>

      <div className="flex items-start gap-2.5 text-xs text-ink-300 bg-white border border-surface-border rounded-xl p-3 sm:p-3.5">
        <Landmark size={15} className="text-ink-300 shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs leading-relaxed">
          Data dikompilasi secara resmi atas kerja sama eksklusif dengan Kantor Pelayanan Pajak (KPP) Pratama Purwokerto untuk wilayah Kabupaten Banyumas.
        </p>
      </div>
    </div>
  )
}

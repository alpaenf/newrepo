import { useRef, useState, useMemo } from 'react'
import html2canvas from 'html2canvas'
import HeatmapToolbar from '../components/HeatmapToolbar.jsx'
import PajakMap from '../components/PajakMap.jsx'
import HeatmapLegend from '../components/HeatmapLegend.jsx'
import PajakDetailPanel from '../components/PajakDetailPanel.jsx'
import KecamatanRankingList from '../components/KecamatanRankingList.jsx'
import KabupatenSummaryPanel from '../components/KabupatenSummaryPanel.jsx'
import { Landmark, ArrowLeft } from '../components/icons.jsx'
import { pajakRawData, pajakMetricsOptions, timeRangeOptions, kabupatenOptions } from '../data/pajakData.js'
import { kabupatenPADData } from '../data/kabupatenPADData.js'
const daerahMetricsOptions = [
  { key: 'penerimaan', label: 'Total PAD' },
  { key: 'lapor', label: 'Total PAD Nontunai' },
  { key: 'wajibPajak', label: 'Pajak Kanal QRIS' },
  { key: 'bayar', label: 'Retribusi Kanal QRIS' }
]

export default function PajakDaerah({ isAdmin = true }) {
  const [metric, setMetric] = useState('penerimaan') // 'penerimaan', 'wajibPajak', 'lapor', 'bayar'
  const [range, setRange] = useState('2024') // '2024', '2025', or '2026'
  const [kabupaten, setKabupaten] = useState('Banyumas') // 'Banyumas', 'Cilacap', 'Purbalingga', 'Banjarnegara', 'Kebumen'
  const [selectedId, setSelectedId] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [viewMode, setViewMode] = useState('kabupaten') // 'kabupaten' or 'kecamatan'
  const [selectedKabupatenId, setSelectedKabupatenId] = useState(null)
  const captureRef = useRef(null)

  const activeKab = useMemo(() => {
    if (viewMode === 'kabupaten') {
      // Banyumas Raya center/zoom overview
      return { key: 'Overview', label: 'Banyumas Raya', center: [-7.45, 109.35], zoom: 9.5 }
    }
    return kabupatenOptions.find(k => k.key === kabupaten) || kabupatenOptions[0]
  }, [kabupaten, viewMode])

  const data = useMemo(() => {
    // Di mode kabupaten, proses seluruh data kecamatan untuk visualisasi heatmap
    // Di mode kecamatan, filter berdasarkan kabupaten terpilih
    const filteredRaw = viewMode === 'kabupaten'
      ? pajakRawData
      : pajakRawData.filter(item => item.regency === kabupaten)

    // Cari nilai maksimum untuk penskalaan bobot heatmap
    const yearValues = filteredRaw.map(item => {
      const yd = item.years[range] || item.years['2024']
      return yd[metric] || 0
    })
    const maxVal = Math.max(...yearValues, 1)

    return filteredRaw.map(item => {
      const yd = item.years[range] || item.years['2024']
      const currentVal = yd[metric] || 0
      const weight = currentVal / maxVal

      // Breakdown simulasi untuk Pajak Daerah (sesuai total penerimaan dari gambar)
      const pbjt = Math.round(yd.penerimaan * 0.40 / 1000000) // dalam Juta untuk detail panel
      const pbb = Math.round(yd.penerimaan * 0.45 / 1000000)
      const bphtb = Math.round(yd.penerimaan * 0.15 / 1000000)
      const penerimaanTotal = Math.round(yd.penerimaan / 1000000) // total dalam Juta

      // Hitung pertumbuhan dibanding tahun sebelumnya
      let growthPct = 0
      if (range === '2025') {
        const prevVal = item.years['2024'].penerimaan
        if (prevVal > 0) {
          growthPct = Math.round(((yd.penerimaan - prevVal) / prevVal) * 100 * 10) / 10
        }
      } else if (range === '2026') {
        const prevVal = item.years['2025'].penerimaan
        if (prevVal > 0) {
          growthPct = Math.round(((yd.penerimaan - prevVal) / prevVal) * 100 * 10) / 10
        }
      }

      const score = Math.round(weight * 100)
      const tier = score >= 75 ? 'Kategori Prima' : score >= 45 ? 'Kategori Berkembang' : 'Kategori Awal'
      const tierColor = score >= 75 ? '#22B07D' : score >= 45 ? '#F5A623' : '#E85D2F'

      return {
        id: item.id,
        name: item.name,
        regency: item.regency,
        dominantIndustry: item.dominantIndustry,
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
          pbjt,
          pbb,
          bphtb,
          penerimaanTotal,
          growthPct,
          fraudRisk: 0
        },
        recommendation: score >= 75 
          ? 'Potensi prima. Lakukan digitalisasi pemungutan PBJT lewat e-Tax untuk meminimalkan loss transaksi.' 
          : score >= 45 
          ? 'Tingkatkan pendataan WP baru PBB-P2 dan optimalkan tapping box pada restoran.' 
          : 'Sosialisasi aktif kepatuhan PBB-P2 dan pemutakhiran NJOP objek pajak untuk mendongkrak penerimaan daerah.'
      }
    })
  }, [range, metric, kabupaten, viewMode])

  async function handleExport() {
    if (!captureRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(captureRef.current, { useCORS: true, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `pajak-daerah-heatmap-${metric}-${range}.png`
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
    window.alert(`Membuka Laporan Analisis Penerimaan Pajak Daerah untuk ${k ? k.name : kecamatanId}.`)
  }

  const sortedKabupatenList = useMemo(() => {
    return [...kabupatenPADData].sort((a, b) => b.padTotal - a.padTotal)
  }, [])

  const legendTitle = useMemo(() => {
    const opt = daerahMetricsOptions.find(o => o.key === metric)
    return opt ? opt.label : ''
  }, [metric])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink-900">Analisis Penerimaan Asli Daerah (Pajak Daerah dan Retribusi)</h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5 sm:mt-1">
            Pemetaan potensi fiskal daerah Banyumas Raya untuk Pajak Barang & Jasa Tertentu, PBB, BPHTB, dan Retribusi Daerah.
          </p>
        </div>

        {/* Action Controls / Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {viewMode === 'kecamatan' && (
            <>
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

              <div className="flex items-center gap-2">
                <label htmlFor="kabupaten-select" className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Kabupaten:</label>
                <select
                  id="kabupaten-select"
                  value={kabupaten}
                  onChange={(e) => {
                    setKabupaten(e.target.value)
                    setSelectedId(null)
                  }}
                  className="px-3.5 py-2 bg-white border border-surface-border rounded-xl text-xs font-bold text-ink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand cursor-pointer hover:bg-surface-muted transition-all"
                >
                  {kabupatenOptions.map(opt => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}
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
        metricOptions={daerahMetricsOptions}
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
          />
          <HeatmapLegend metric={metric} title={legendTitle} />

          {viewMode === 'kabupaten' && selectedKabupatenId && (
            <KabupatenSummaryPanel
              kabupaten={kabupatenPADData.find(k => k.id === selectedKabupatenId)}
              onClose={() => setSelectedKabupatenId(null)}
              onDrillDown={(kabName) => {
                setKabupaten(kabName)
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
              isDaerah={true}
            />
          )}
        </div>

        <div className="h-[380px] sm:h-[500px] lg:h-[600px]">
          {viewMode === 'kabupaten' ? (
            <div className="bg-white border border-surface-border rounded-xl sm:rounded-2xl p-4 shadow-card h-full flex flex-col">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Peringkat Kabupaten</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">PAD Total</span>
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
                        <p className="text-[10px] text-ink-400">Rasio Nontunai: {kab.rasio}%</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-blue-700">
                          Rp {(kab.padTotal / 1e9).toFixed(1)} M
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
          Peta heatmap Pajak Daerah ini dikompilasi dari basis data e-Tax Badan Pendapatan Daerah (Bapenda) kabupaten di Banyumas Raya, disinkronisasikan secara periodik guna analisis klastering ekonomi.
        </p>
      </div>
    </div>
  )
}

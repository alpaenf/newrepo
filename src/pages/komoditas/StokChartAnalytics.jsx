import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts'
import { ShieldCheck, BarChart3, AlertTriangle, TrendingUp, CheckCircle2, Layers, Filter } from '../../components/icons.jsx'

// Helper to extract numbers from string formatted "1,450 Ton" or "Rp 27.786/kg"
function parseNumber(valStr) {
  if (!valStr) return 0
  const num = parseFloat(String(valStr).replace(/[^0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}

function CustomBufferTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload

  const ratio = Math.round((data.realisasi / (data.buffer || 1)) * 100)
  const isAman = ratio >= 100
  const isMenipis = ratio >= 70 && ratio < 100
  const statusColor = isAman ? '#22B07D' : isMenipis ? '#F5A623' : '#E85D2F'

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-surface-border text-xs space-y-2 min-w-[220px] z-[1000] animate-float-in">
      <div className="flex items-center justify-between border-b border-surface-border pb-1.5">
        <span className="font-extrabold text-ink-900 text-sm truncate max-w-[150px]">{data.komoditas}</span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0"
          style={{ backgroundColor: `${statusColor}1A`, color: statusColor }}
        >
          {isAman ? 'Aman' : isMenipis ? 'Waspada' : 'Kritis'}
        </span>
      </div>
      <div className="text-[11px] text-ink-500 font-medium">
        {data.count ? `Jumlah Data: ${data.count} Gudang` : `Gudang: ${data.gudang} (${data.wilayah})`}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="bg-surface-muted p-2 rounded-xl text-center">
          <span className="text-[10px] text-ink-400 block font-semibold uppercase">Realisasi</span>
          <span className="font-extrabold text-ink-900 text-xs">{data.realisasi.toLocaleString('id-ID')} Ton</span>
        </div>
        <div className="bg-surface-muted p-2 rounded-xl text-center">
          <span className="text-[10px] text-ink-400 block font-semibold uppercase">Target Buffer</span>
          <span className="font-extrabold text-brand text-xs">{data.buffer.toLocaleString('id-ID')} Ton</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-surface-border text-[11px]">
        <span className="text-ink-500 font-medium">% Keterpenuhan:</span>
        <strong style={{ color: statusColor }} className="font-extrabold">{ratio}%</strong>
      </div>
    </div>
  )
}

function CustomPriceTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  const isHigh = data.harga > data.het

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-surface-border text-xs space-y-2 min-w-[220px] z-[1000] animate-float-in">
      <div className="flex items-center justify-between border-b border-surface-border pb-1.5">
        <span className="font-extrabold text-ink-900 text-sm truncate max-w-[150px]">{data.komoditas}</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
            isHigh ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isHigh ? 'Di Atas HET' : 'Harga Wajar'}
        </span>
      </div>
      <div className="text-[11px] text-ink-500 font-medium">
        Wilayah: <strong className="text-ink-900">{data.wilayah || 'Banyumas Raya'}</strong>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="bg-surface-muted p-2 rounded-xl text-center">
          <span className="text-[10px] text-ink-400 block font-semibold uppercase">Harga Pasar</span>
          <span className="font-extrabold text-ink-900 text-xs">Rp {data.harga.toLocaleString('id-ID')}/kg</span>
        </div>
        <div className="bg-surface-muted p-2 rounded-xl text-center">
          <span className="text-[10px] text-ink-400 block font-semibold uppercase">Acuan HET</span>
          <span className="font-extrabold text-brand text-xs">Rp {data.het.toLocaleString('id-ID')}/kg</span>
        </div>
      </div>
    </div>
  )
}

export default function StokChartAnalytics({ metric, stokData = [], komoditasFilter = 'Semua' }) {
  const [viewMode, setViewMode] = useState('agregat') // 'agregat' | 'top15' | 'scroll'

  // Filter stokData according to komoditasFilter
  const filteredList = useMemo(() => {
    return stokData.filter(item => {
      if (komoditasFilter === 'Semua') return true
      return item.komoditas?.toLowerCase().includes(komoditasFilter.toLowerCase())
    })
  }, [stokData, komoditasFilter])

  // Raw formatted items
  const rawBufferData = useMemo(() => {
    return filteredList.map(item => {
      const realisasi = parseNumber(item.stok)
      const buffer = parseNumber(item.minBuffer)
      const ratio = Math.round((realisasi / (buffer || 1)) * 100)
      return {
        id: item.id,
        komoditas: item.komoditas,
        shortName: item.komoditas.length > 18 ? item.komoditas.substring(0, 16) + '...' : item.komoditas,
        gudang: item.gudang,
        wilayah: item.wilayahName,
        realisasi,
        buffer,
        ratio,
        status: item.status
      }
    })
  }, [filteredList])

  // Aggregated data by commodity type
  const aggregatedBufferData = useMemo(() => {
    const map = new Map()
    rawBufferData.forEach(item => {
      let key = item.komoditas.split(' ')[0]
      if (item.komoditas.toLowerCase().includes('gula')) key = 'Gula Pasir'
      else if (item.komoditas.toLowerCase().includes('cabai') || item.komoditas.toLowerCase().includes('cabe')) key = 'Cabai'
      else if (item.komoditas.toLowerCase().includes('daging')) key = 'Daging'
      else if (item.komoditas.toLowerCase().includes('telur')) key = 'Telur'
      else if (item.komoditas.toLowerCase().includes('ikan')) key = 'Ikan'
      else if (item.komoditas.toLowerCase().includes('beras')) key = 'Beras'
      else if (item.komoditas.toLowerCase().includes('minyak')) key = 'Minyak'

      if (!map.has(key)) {
        map.set(key, {
          komoditas: key,
          shortName: key,
          gudang: 'Semua Gudang',
          wilayah: 'Banyumas Raya',
          realisasi: 0,
          buffer: 0,
          count: 0
        })
      }
      const existing = map.get(key)
      existing.realisasi += item.realisasi
      existing.buffer += item.buffer
      existing.count += 1
    })

    return Array.from(map.values()).map(item => ({
      ...item,
      ratio: Math.round((item.realisasi / (item.buffer || 1)) * 100),
      status: (item.realisasi / (item.buffer || 1)) >= 1 ? 'Aman' : (item.realisasi / (item.buffer || 1)) >= 0.7 ? 'Menipis' : 'Kritis'
    }))
  }, [rawBufferData])

  // Top 15 critical items
  const top15BufferData = useMemo(() => {
    return [...rawBufferData].sort((a, b) => a.ratio - b.ratio).slice(0, 15)
  }, [rawBufferData])

  // Select active chart dataset based on viewMode
  const activeBufferData = useMemo(() => {
    if (viewMode === 'top15') return top15BufferData
    if (viewMode === 'scroll') return rawBufferData
    // Default 'agregat'
    return rawBufferData.length > 20 ? aggregatedBufferData : rawBufferData
  }, [viewMode, rawBufferData, aggregatedBufferData, top15BufferData])

  // Price chart data
  const rawPriceData = useMemo(() => {
    return filteredList.map(item => {
      const harga = parseNumber(item.avgPrice) || (item.komoditas.includes('Beras') ? 14500 : item.komoditas.includes('Cabai') ? 48000 : 28000)
      const het = item.komoditas.includes('Beras') ? 12500 : item.komoditas.includes('Cabai') ? 40000 : item.komoditas.includes('Daging') ? 120000 : 25000
      return {
        id: item.id,
        komoditas: item.komoditas,
        shortName: item.komoditas.length > 18 ? item.komoditas.substring(0, 16) + '...' : item.komoditas,
        wilayah: item.wilayahName,
        harga,
        het
      }
    })
  }, [filteredList])

  const aggregatedPriceData = useMemo(() => {
    const map = new Map()
    rawPriceData.forEach(item => {
      let key = item.komoditas.split(' ')[0]
      if (item.komoditas.toLowerCase().includes('gula')) key = 'Gula Pasir'
      else if (item.komoditas.toLowerCase().includes('cabai') || item.komoditas.toLowerCase().includes('cabe')) key = 'Cabai'
      else if (item.komoditas.toLowerCase().includes('daging')) key = 'Daging'
      else if (item.komoditas.toLowerCase().includes('telur')) key = 'Telur'
      else if (item.komoditas.toLowerCase().includes('ikan')) key = 'Ikan'
      else if (item.komoditas.toLowerCase().includes('beras')) key = 'Beras'

      if (!map.has(key)) {
        map.set(key, {
          komoditas: key,
          shortName: key,
          wilayah: 'Banyumas Raya',
          sumHarga: 0,
          sumHet: 0,
          count: 0
        })
      }
      const existing = map.get(key)
      existing.sumHarga += item.harga
      existing.sumHet += item.het
      existing.count += 1
    })

    return Array.from(map.values()).map(item => ({
      komoditas: item.komoditas,
      shortName: item.shortName,
      wilayah: item.wilayah,
      harga: Math.round(item.sumHarga / item.count),
      het: Math.round(item.sumHet / item.count)
    }))
  }, [rawPriceData])

  const activePriceData = useMemo(() => {
    if (viewMode === 'top15') return rawPriceData.slice(0, 15)
    if (viewMode === 'scroll') return rawPriceData
    return rawPriceData.length > 20 ? aggregatedPriceData : rawPriceData
  }, [viewMode, rawPriceData, aggregatedPriceData])

  // XAxis Tick Interval Calculation to prevent text overlapping
  const getTickInterval = (len) => {
    if (viewMode === 'scroll') return 0
    if (len > 25) return Math.ceil(len / 12)
    if (len > 15) return 1
    return 0
  }

  if (metric === 'bufferStok') {
    const totalTerpenuhi = rawBufferData.filter(i => i.ratio >= 100).length
    const totalKritis = rawBufferData.filter(i => i.ratio < 70).length

    return (
      <div className="h-full w-full bg-white p-5 rounded-2xl flex flex-col justify-between space-y-4 animate-float-in">
        {/* Header Summary & View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand/10 text-brand rounded-xl shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-ink-900 text-sm sm:text-base leading-snug">
                Grafik Realisasi vs Target Buffer Stok
              </h3>
              <p className="text-xs text-ink-500">
                Membandingkan realisasi fisik gudang (Bar) dengan target minimum buffer BI (Garis).
              </p>
            </div>
          </div>

          {/* Controls: Mode Tampilan Grafik & Badge */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode('agregat')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'agregat' ? 'bg-brand text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mengelompokkan data per jenis komoditas utama agar rapi"
              >
                Agregat Ringkas
              </button>
              <button
                onClick={() => setViewMode('top15')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'top15' ? 'bg-brand text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilkan 15 item paling kritis/prioritas"
              >
                Top 15 Kritis
              </button>
              <button
                onClick={() => setViewMode('scroll')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'scroll' ? 'bg-brand text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilkan semua item dalam kontainer geser horizontal"
              >
                Geser (Semua)
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200">
              <CheckCircle2 size={13} />
              {totalTerpenuhi}
            </span>
            {totalKritis > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-extrabold rounded-full border border-rose-200">
                <AlertTriangle size={13} />
                {totalKritis}
              </span>
            )}
          </div>
        </div>

        {/* Recharts Container (Normal or Horizontal Scroll) */}
        <div className="w-full h-[360px] pt-2 overflow-x-auto scrollbar-thin">
          <div style={{ minWidth: viewMode === 'scroll' ? `${Math.max(700, activeBufferData.length * 36)}px` : '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={activeBufferData} margin={{ top: 20, right: 20, bottom: 45, left: 10 }}>
                <defs>
                  <linearGradient id="barGradientAman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="barGradientMenipis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5A623" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="barGradientKritis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#B91C1C" stopOpacity={0.75} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#ECEDF1" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke="#6B7280"
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#3D4152' }}
                  interval={getTickInterval(activeBufferData.length)}
                  angle={-25}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#3D4152' }}
                  unit=" T"
                />
                <Tooltip content={<CustomBufferTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 15, fontSize: 12, fontWeight: 700 }}
                />

                {/* Bar Realisasi Stok */}
                <Bar
                  dataKey="realisasi"
                  name="Realisasi Stok Gudang (Ton)"
                  radius={[6, 6, 0, 0]}
                  barSize={viewMode === 'scroll' ? 24 : activeBufferData.length > 25 ? 16 : 32}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {activeBufferData.map((entry, index) => {
                    const fillGrad = entry.ratio >= 100 ? 'url(#barGradientAman)' : entry.ratio >= 70 ? 'url(#barGradientMenipis)' : 'url(#barGradientKritis)'
                    return <Cell key={`cell-${index}`} fill={fillGrad} />
                  })}
                </Bar>

                {/* Line Target Buffer */}
                <Line
                  type="monotone"
                  dataKey="buffer"
                  name="Target Minimum Buffer (Ton)"
                  stroke="#045498"
                  strokeWidth={2.5}
                  dot={activeBufferData.length > 40 ? false : { r: 4, fill: '#045498', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#045498', stroke: '#ffffff', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  // Else: metric === 'avgPrice'
  return (
    <div className="h-full w-full bg-white p-5 rounded-2xl flex flex-col justify-between space-y-4 animate-float-in">
      {/* Header Summary & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand/10 text-brand rounded-xl shrink-0">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-ink-900 text-sm sm:text-base leading-snug">
              Grafik Rata-Rata Harga vs HET Pemerintah
            </h3>
            <p className="text-xs text-ink-500">
              Pantau kestabilan harga eceran pasar per kg terhadap acuan HET.
            </p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => setViewMode('agregat')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'agregat' ? 'bg-brand text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Agregat Ringkas
          </button>
          <button
            onClick={() => setViewMode('top15')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'top15' ? 'bg-brand text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Top 15
          </button>
          <button
            onClick={() => setViewMode('scroll')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'scroll' ? 'bg-brand text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Geser (Semua)
          </button>
        </div>
      </div>

      {/* Recharts BarChart */}
      <div className="w-full h-[360px] pt-2 overflow-x-auto scrollbar-thin">
        <div style={{ minWidth: viewMode === 'scroll' ? `${Math.max(700, activePriceData.length * 36)}px` : '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={activePriceData} margin={{ top: 20, right: 20, bottom: 45, left: 15 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#045498" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#073B73" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="hetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CBD5E1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#94A3B8" stopOpacity={0.6} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ECEDF1" vertical={false} />
              <XAxis
                dataKey="shortName"
                stroke="#6B7280"
                tick={{ fontSize: 10, fontWeight: 600, fill: '#3D4152' }}
                interval={getTickInterval(activePriceData.length)}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fontSize: 11, fontWeight: 600, fill: '#3D4152' }}
                tickFormatter={(v) => `Rp ${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomPriceTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12, fontWeight: 700 }}
              />

              <Bar
                dataKey="harga"
                name="Rata-Rata Harga Pasar (Rp/kg)"
                fill="url(#priceGradient)"
                radius={[6, 6, 0, 0]}
                barSize={viewMode === 'scroll' ? 24 : activePriceData.length > 25 ? 16 : 28}
                isAnimationActive={true}
                animationDuration={1000}
              />
              <Bar
                dataKey="het"
                name="Harga Eceran Tertinggi / HET (Rp/kg)"
                fill="url(#hetGradient)"
                radius={[6, 6, 0, 0]}
                barSize={viewMode === 'scroll' ? 24 : activePriceData.length > 25 ? 16 : 28}
                isAnimationActive={true}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

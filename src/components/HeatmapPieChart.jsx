import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts'
import { qrisRealData } from '../data/qrisData.js'

const KABUPATEN_LIST = [
  { id: 'ALL', name: 'Semua (Banyumas Raya)', shortName: 'Banyumas Raya' },
  { id: 'Banyumas', name: 'Kab. Banyumas', shortName: 'Banyumas' },
  { id: 'Cilacap', name: 'Kab. Cilacap', shortName: 'Cilacap' },
  { id: 'Purbalingga', name: 'Kab. Purbalingga', shortName: 'Purbalingga' },
  { id: 'Banjarnegara', name: 'Kab. Banjarnegara', shortName: 'Banjarnegara' }
]

const MONTH_LIST = [
  { id: 'ALL', name: 'Semua Bulan (Tahunan)', shortName: 'Tahunan', factor: 1.0 },
  { id: '01', name: 'Januari', shortName: 'Jan', factor: 0.076 },
  { id: '02', name: 'Februari', shortName: 'Feb', factor: 0.073 },
  { id: '03', name: 'Maret', shortName: 'Mar', factor: 0.088 },
  { id: '04', name: 'April', shortName: 'Apr', factor: 0.094 },
  { id: '05', name: 'Mei', shortName: 'Mei', factor: 0.085 },
  { id: '06', name: 'Juni', shortName: 'Jun', factor: 0.086 },
  { id: '07', name: 'Juli', shortName: 'Jul', factor: 0.083 },
  { id: '08', name: 'Agustus', shortName: 'Agu', factor: 0.087 },
  { id: '09', name: 'September', shortName: 'Sep', factor: 0.082 },
  { id: '10', name: 'Oktober', shortName: 'Okt', factor: 0.084 },
  { id: '11', name: 'November', shortName: 'Nov', factor: 0.079 },
  { id: '12', name: 'Desember', shortName: 'Des', factor: 0.093 }
]

const CATEGORY_META = {
  UMI: {
    key: 'UMI',
    label: 'Usaha Mikro',
    shortLabel: 'UMI',
    color: '#2563EB', // Blue
    bgLight: 'bg-blue-50/70',
    borderLight: 'border-blue-200',
    textMain: 'text-blue-700',
    dotColor: 'bg-blue-600',
    criteria: 'Omzet < Rp 300 Juta/tahun'
  },
  UKE: {
    key: 'UKE',
    label: 'Usaha Kecil',
    shortLabel: 'UKE',
    color: '#059669', // Emerald
    bgLight: 'bg-emerald-50/70',
    borderLight: 'border-emerald-200',
    textMain: 'text-emerald-700',
    dotColor: 'bg-emerald-600',
    criteria: 'Omzet Rp 300 Jt - Rp 2,5 M/tahun'
  },
  UME: {
    key: 'UME',
    label: 'Usaha Menengah',
    shortLabel: 'UME',
    color: '#D97706', // Amber
    bgLight: 'bg-amber-50/70',
    borderLight: 'border-amber-200',
    textMain: 'text-amber-700',
    dotColor: 'bg-amber-600',
    criteria: 'Omzet Rp 2,5 M - Rp 50 M/tahun'
  },
  UBE: {
    key: 'UBE',
    label: 'Usaha Besar',
    shortLabel: 'UBE',
    color: '#7C3AED', // Purple
    bgLight: 'bg-purple-50/70',
    borderLight: 'border-purple-200',
    textMain: 'text-purple-700',
    dotColor: 'bg-purple-600',
    criteria: 'Omzet > Rp 50 Miliar/tahun'
  }
}

function formatRupiahShort(value) {
  if (!value || isNaN(value)) return 'Rp 0'
  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Triliun`
  }
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Miliar`
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Juta`
  }
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`
}

function formatRupiahFull(value) {
  return `Rp ${Math.round(value || 0).toLocaleString('id-ID')}`
}

function formatVolumeShort(value) {
  if (!value || isNaN(value)) return '0 trx'
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Jt trx`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} rb trx`
  }
  return `${Math.round(value).toLocaleString('id-ID')} trx`
}

function CustomTooltip({ active, payload, viewType, periodLabel }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0].payload
  const meta = CATEGORY_META[item.key] || {}

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[240px] space-y-2 z-[9999]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="font-extrabold text-slate-900 text-sm">{meta.label} ({item.key})</span>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
          style={{ backgroundColor: `${item.color}18`, color: item.color }}
        >
          {item.percentage}%
        </span>
      </div>

      <div className="space-y-1.5 pt-0.5 text-slate-600">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Periode:</span>
          <span className="font-bold text-slate-800">{periodLabel}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Nominal Transaksi:</span>
          <span className="font-black text-slate-900">{formatRupiahFull(item.nominal)}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Volume Transaksi:</span>
          <span className="font-bold text-slate-800">{item.volume.toLocaleString('id-ID')} trx</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Rata-rata/Trx:</span>
          <span className="font-semibold text-slate-700">
            {item.volume > 0 ? formatRupiahFull(item.nominal / item.volume) : '-'}
          </span>
        </div>
        <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 italic">
          {meta.criteria}
        </div>
      </div>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  const pct = parseFloat(payload?.percentage || 0)
  if (pct < 3) return null

  return (
    <g className="pointer-events-none select-none">
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.8))',
          fontFamily: 'inherit'
        }}
      >
        <tspan x={x} dy="-0.4em" fontSize="11" fontWeight="800" fill="#ffffff">
          {payload.shortLabel}
        </tspan>
        <tspan x={x} dy="1.2em" fontSize="12" fontWeight="900" fill="#ffffff">
          {payload.percentage}%
        </tspan>
      </text>
    </g>
  )
}

export default function HeatmapPieChart({ range = '2026', selectedId = null, data = [] }) {
  const [selectedWilayah, setSelectedWilayah] = useState('ALL')
  const [selectedMonth, setSelectedMonth] = useState('ALL') // 'ALL' | '01'..'12'
  const [selectedYear, setSelectedYear] = useState(range)
  const [viewType, setViewType] = useState('nominal') // 'nominal' | 'volume'
  const [activeIndex, setActiveIndex] = useState(null)

  // Update selected year if toolbar range changes
  React.useEffect(() => {
    if (range) setSelectedYear(range)
  }, [range])

  const currentWilayah = selectedWilayah
  const currentMonthObj = useMemo(() => {
    return MONTH_LIST.find((m) => m.id === selectedMonth) || MONTH_LIST[0]
  }, [selectedMonth])

  const periodLabel = useMemo(() => {
    if (selectedMonth === 'ALL') {
      return `Tahun ${selectedYear}`
    }
    return `Bulan ${currentMonthObj.name} ${selectedYear}`
  }, [selectedMonth, currentMonthObj, selectedYear])

  // Categories to include
  const categories = ['UMI', 'UKE', 'UME', 'UBE']
  const fourKab = ['Banyumas', 'Cilacap', 'Purbalingga', 'Banjarnegara']

  // Aggregate data for current selected wilayah & selected month
  const chartData = useMemo(() => {
    const totals = {
      UMI: { nominal: 0, volume: 0 },
      UKE: { nominal: 0, volume: 0 },
      UME: { nominal: 0, volume: 0 },
      UBE: { nominal: 0, volume: 0 }
    }

    const monthFactor = currentMonthObj.factor || 1.0
    const activeKabList = currentWilayah === 'ALL' ? fourKab : [currentWilayah]

    activeKabList.forEach((kab) => {
      const kabData = qrisRealData[kab]?.[selectedYear] || {}
      categories.forEach((cat) => {
        if (kabData[cat]) {
          const rawNominal = kabData[cat].nominal || 0
          const rawVolume = kabData[cat].volume || 0

          totals[cat].nominal += Math.round(rawNominal * monthFactor)
          totals[cat].volume += Math.round(rawVolume * monthFactor)
        }
      })
    })

    const totalNominal = categories.reduce((sum, c) => sum + totals[c].nominal, 0)
    const totalVolume = categories.reduce((sum, c) => sum + totals[c].volume, 0)
    const activeTotal = viewType === 'nominal' ? totalNominal : totalVolume

    return categories.map((cat) => {
      const meta = CATEGORY_META[cat]
      const catVal = viewType === 'nominal' ? totals[cat].nominal : totals[cat].volume
      const pct = activeTotal > 0 ? ((catVal / activeTotal) * 100).toFixed(1) : '0.0'

      return {
        key: cat,
        name: `${meta.label} (${cat})`,
        shortLabel: cat,
        color: meta.color,
        value: catVal,
        nominal: totals[cat].nominal,
        volume: totals[cat].volume,
        percentage: pct,
        meta
      }
    })
  }, [currentWilayah, selectedYear, currentMonthObj, viewType])

  const totalSummary = useMemo(() => {
    const totalNominal = chartData.reduce((acc, c) => acc + c.nominal, 0)
    const totalVolume = chartData.reduce((acc, c) => acc + c.volume, 0)
    return {
      nominal: totalNominal,
      volume: totalVolume
    }
  }, [chartData])

  // Comparison data for all 4 kabupaten (adjusted for month)
  const kabComparison = useMemo(() => {
    const monthFactor = currentMonthObj.factor || 1.0

    return fourKab.map((kab) => {
      const kabData = qrisRealData[kab]?.[selectedYear] || {}
      const umi = kabData.UMI || { nominal: 0, volume: 0 }
      const uke = kabData.UKE || { nominal: 0, volume: 0 }
      const ume = kabData.UME || { nominal: 0, volume: 0 }
      const ube = kabData.UBE || { nominal: 0, volume: 0 }

      const adjNominal = (val) => Math.round(val * monthFactor)
      const adjVolume = (val) => Math.round(val * monthFactor)

      const totalKabNominal = adjNominal(umi.nominal) + adjNominal(uke.nominal) + adjNominal(ume.nominal) + adjNominal(ube.nominal)
      const totalKabVolume = adjVolume(umi.volume) + adjVolume(uke.volume) + adjVolume(ume.volume) + adjVolume(ube.volume)

      const getPct = (val, tot) => (tot > 0 ? (val / tot) * 100 : 0)

      const umiVal = viewType === 'nominal' ? adjNominal(umi.nominal) : adjVolume(umi.volume)
      const ukeVal = viewType === 'nominal' ? adjNominal(uke.nominal) : adjVolume(uke.volume)
      const umeVal = viewType === 'nominal' ? adjNominal(ume.nominal) : adjVolume(ume.volume)
      const ubeVal = viewType === 'nominal' ? adjNominal(ube.nominal) : adjVolume(ube.volume)
      const activeTotal = viewType === 'nominal' ? totalKabNominal : totalKabVolume

      return {
        kab,
        totalNominal: totalKabNominal,
        totalVolume: totalKabVolume,
        merchants: kabData.merchants || 0,
        shares: {
          UMI: getPct(umiVal, activeTotal),
          UKE: getPct(ukeVal, activeTotal),
          UME: getPct(umeVal, activeTotal),
          UBE: getPct(ubeVal, activeTotal)
        }
      }
    })
  }, [selectedYear, currentMonthObj, viewType])

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-surface-border space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-ink-900 tracking-tight">
                Segmentasi Skala Usaha QRIS (UMI, UKE, UME, UBE)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
              Proporsi data riil transaksi QRIS menurut skala usaha di 4 Kabupaten se-Banyumas Raya (<strong>{periodLabel}</strong>)
            </p>
          </div>

          {/* Controls: Month, Year, Metric Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* Month Filter Selector */}
            <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1.5 rounded-xl border border-surface-border">
              <span className="text-[11px] font-bold text-ink-500">📅 Periode:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-surface-border rounded-lg text-xs font-bold text-ink-900 py-1 px-2 focus:outline-none cursor-pointer shadow-sm"
              >
                {MONTH_LIST.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-xl border border-surface-border">
              {['2024', '2025', '2026'].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? 'bg-ink-900 text-white shadow-sm'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Metric Switcher */}
            <div className="inline-flex p-1 bg-surface-muted rounded-xl border border-surface-border">
              <button
                type="button"
                onClick={() => setViewType('nominal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewType === 'nominal'
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                Nominal
              </button>
              <button
                type="button"
                onClick={() => setViewType('volume')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewType === 'volume'
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                Volume
              </button>
            </div>
          </div>
        </div>

        {/* Wilayah Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {KABUPATEN_LIST.map((kab) => {
            const isActive = currentWilayah === kab.id
            return (
              <button
                key={kab.id}
                type="button"
                onClick={() => setSelectedWilayah(kab.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
                    : 'bg-surface-muted/50 text-ink-600 border-surface-border hover:bg-surface-muted hover:text-ink-900'
                }`}
              >
                {kab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content: Chart & Breakdown */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Donut Chart with Direct Slice Labels */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full h-[270px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={115}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  animationDuration={600}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.key}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={activeIndex === index ? 3 : 2}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.65}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip viewType={viewType} periodLabel={periodLabel} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Total Card Under Chart */}
          <div className="w-full mt-2 bg-surface-muted/60 border border-surface-border rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400 block">
                Total {viewType === 'nominal' ? 'Nominal' : 'Volume'} ({currentWilayah === 'ALL' ? 'Banyumas Raya' : `Kab. ${currentWilayah}`}) · {currentMonthObj.shortName} {selectedYear}
              </span>
              <span className="font-black text-ink-900 text-sm sm:text-base">
                {viewType === 'nominal' ? formatRupiahShort(totalSummary.nominal) : formatVolumeShort(totalSummary.volume)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium text-ink-400 block">
                {viewType === 'nominal' ? 'Total Volume' : 'Total Nominal'}
              </span>
              <span className="font-bold text-ink-700 text-xs">
                {viewType === 'nominal' ? formatVolumeShort(totalSummary.volume) : formatRupiahShort(totalSummary.nominal)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: 4 Detailed Category Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {chartData.map((cat, idx) => {
            const isHovered = activeIndex === idx
            return (
              <div
                key={cat.key}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? `${cat.meta.bgLight} ${cat.meta.borderLight} shadow-md scale-[1.02]`
                    : 'bg-white border-surface-border hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cat.meta.dotColor} shrink-0`} />
                    <div>
                      <span className="text-xs sm:text-sm font-black text-ink-900 block leading-tight">
                        {cat.meta.label}
                      </span>
                      <span className="text-[10px] text-ink-400 font-medium block">
                        {cat.meta.criteria}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                      isHovered ? 'bg-white shadow-sm' : cat.meta.bgLight
                    } ${cat.meta.textMain}`}
                  >
                    {cat.percentage}%
                  </span>
                </div>

                {/* Values */}
                <div className="space-y-1 mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-ink-500 font-medium">Nominal:</span>
                    <span className="text-xs sm:text-sm font-black text-ink-900">
                      {formatRupiahShort(cat.nominal)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-ink-500 font-medium">Volume:</span>
                    <span className="text-[11px] font-semibold text-ink-700">
                      {cat.volume.toLocaleString('id-ID')} trx
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Section: 4 Kabupaten Mini-Comparison Overview */}
      <div className="p-4 sm:p-6 bg-surface-muted/30 border-t border-surface-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-ink-500">
            Perbandingan Komposisi di 4 Wilayah Kabupaten ({periodLabel})
          </span>
          <span className="text-[11px] text-ink-400 font-medium hidden sm:inline">
            Klik kabupaten untuk filter detail
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kabComparison.map((item) => {
            const isSelected = currentWilayah === item.kab
            return (
              <div
                key={item.kab}
                onClick={() => setSelectedWilayah(item.kab)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-ink-900 shadow-md ring-1 ring-ink-900'
                    : 'bg-white border-surface-border hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-ink-900">
                    Kab. {item.kab}
                  </span>
                  <span className="text-[10px] text-ink-400 font-semibold">
                    {item.merchants.toLocaleString('id-ID')} merchant
                  </span>
                </div>

                <div className="text-sm font-black text-ink-900 mb-2">
                  {viewType === 'nominal' ? formatRupiahShort(item.totalNominal) : formatVolumeShort(item.totalVolume)}
                </div>

                {/* Stacked Mini Bar (UMI, UKE, UME, UBE) */}
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100" title={`UMI: ${item.shares.UMI.toFixed(1)}% | UKE: ${item.shares.UKE.toFixed(1)}% | UME: ${item.shares.UME.toFixed(1)}% | UBE: ${item.shares.UBE.toFixed(1)}%`}>
                  <div style={{ width: `${item.shares.UMI}%`, backgroundColor: CATEGORY_META.UMI.color }} />
                  <div style={{ width: `${item.shares.UKE}%`, backgroundColor: CATEGORY_META.UKE.color }} />
                  <div style={{ width: `${item.shares.UME}%`, backgroundColor: CATEGORY_META.UME.color }} />
                  <div style={{ width: `${item.shares.UBE}%`, backgroundColor: CATEGORY_META.UBE.color }} />
                </div>

                {/* Mini Legend */}
                <div className="flex items-center justify-between text-[9px] text-ink-400 font-bold mt-1.5">
                  <span className="text-blue-600">UMI {item.shares.UMI.toFixed(0)}%</span>
                  <span className="text-emerald-600">UKE {item.shares.UKE.toFixed(0)}%</span>
                  <span className="text-amber-600">UME {item.shares.UME.toFixed(0)}%</span>
                  <span className="text-purple-600">UBE {item.shares.UBE.toFixed(0)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

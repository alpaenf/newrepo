import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts'
import { Calendar, TrendingUp } from './icons.jsx'
import { qrisRealData, qrisMonthlyByCategory } from '../data/qrisData.js'

const KABUPATEN_LIST = [
  { id: 'ALL', name: 'Semua (Banyumas Raya)', shortName: 'Banyumas Raya' },
  { id: 'Banyumas', name: 'Kab. Banyumas', shortName: 'Banyumas' },
  { id: 'Cilacap', name: 'Kab. Cilacap', shortName: 'Cilacap' },
  { id: 'Purbalingga', name: 'Kab. Purbalingga', shortName: 'Purbalingga' },
  { id: 'Banjarnegara', name: 'Kab. Banjarnegara', shortName: 'Banjarnegara' }
]

const MONTH_LIST = [
  { id: 'ALL', name: 'Semua Bulan (Tahunan)', shortName: 'Tahunan' },
  { id: '01', name: 'Januari', shortName: 'Jan' },
  { id: '02', name: 'Februari', shortName: 'Feb' },
  { id: '03', name: 'Maret', shortName: 'Mar' },
  { id: '04', name: 'April', shortName: 'Apr' },
  { id: '05', name: 'Mei', shortName: 'Mei' },
  { id: '06', name: 'Juni', shortName: 'Jun' },
  { id: '07', name: 'Juli', shortName: 'Jul' },
  { id: '08', name: 'Agustus', shortName: 'Agu' },
  { id: '09', name: 'September', shortName: 'Sep' },
  { id: '10', name: 'Oktober', shortName: 'Okt' },
  { id: '11', name: 'November', shortName: 'Nov' },
  { id: '12', name: 'Desember', shortName: 'Des' }
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
    const num = value / 1_000_000_000_000
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} T`
  }
  if (value >= 1_000_000_000) {
    const num = value / 1_000_000_000
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} M`
  }
  if (value >= 1_000_000) {
    const num = value / 1_000_000
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} Jt`
  }
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`
}

function formatRupiahFull(value) {
  return `Rp ${Math.round(value || 0).toLocaleString('id-ID')}`
}

function formatVolumeShort(value) {
  if (!value || isNaN(value)) return '0 trx'
  if (value >= 1_000_000) {
    const num = value / 1_000_000
    return `${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} Jt trx`
  }
  if (value >= 1_000) {
    const num = value / 1_000
    return `${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} rb trx`
  }
  return `${Math.round(value).toLocaleString('id-ID')} trx`
}

function CustomPieTooltip({ active, payload, viewType, periodLabel }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0].payload
  const meta = CATEGORY_META[item.key] || {}

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[240px] space-y-2 z-[9999]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="font-semibold text-slate-900 text-sm">{meta.label} ({item.key})</span>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: `${item.color}18`, color: item.color }}
        >
          {item.percentage}%
        </span>
      </div>

      <div className="space-y-1.5 pt-0.5 text-slate-600">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Periode:</span>
          <span className="font-semibold text-slate-800">{periodLabel}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Nominal Transaksi:</span>
          <span className="font-semibold text-slate-900">{formatRupiahFull(item.nominal)}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Volume Transaksi:</span>
          <span className="font-semibold text-slate-800">{item.volume.toLocaleString('id-ID')} trx</span>
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

function CustomTrendTooltip({ active, payload, label, viewType }) {
  if (!active || !payload || !payload.length) return null

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0)

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[260px] space-y-2 z-[9999]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <span className="font-semibold text-slate-900 text-sm">{label}</span>
        <span className="text-[11px] font-semibold text-ink-500">
          Total: {viewType === 'nominal' ? formatRupiahShort(total) : formatVolumeShort(total)}
        </span>
      </div>

      <div className="space-y-1.5 pt-0.5">
        {payload.map((entry) => {
          const meta = CATEGORY_META[entry.dataKey] || {}
          const val = entry.value || 0
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0'

          return (
            <div key={entry.dataKey} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-semibold text-slate-700">{meta.label || entry.name} ({entry.dataKey}):</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">
                  {viewType === 'nominal' ? formatRupiahShort(val) : formatVolumeShort(val)}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">({pct}%)</span>
              </div>
            </div>
          )
        })}
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
        <tspan x={x} dy="-0.4em" fontSize="11" fontWeight="600" fill="#ffffff">
          {payload.shortLabel}
        </tspan>
        <tspan x={x} dy="1.2em" fontSize="12" fontWeight="700" fill="#ffffff">
          {payload.percentage}%
        </tspan>
      </text>
    </g>
  )
}

export default function HeatmapPieChart({ range = '2026', selectedId = null, data = [] }) {
  const [selectedWilayah, setSelectedWilayah] = useState('ALL')
  const [selectedMonth, setSelectedMonth] = useState('08') // Default: '08' (Agustus 2026 data riil)
  const [selectedYear, setSelectedYear] = useState(range)
  const [viewType, setViewType] = useState('nominal') // 'nominal' | 'volume'
  const [trendMode, setTrendMode] = useState('all') // 'all' (2024, 2025 akhir tahun + 2026 bulanan) | 'monthly2026' (khusus 2026 per bulan)
  const [activeIndex, setActiveIndex] = useState(null)

  // Update selected year if toolbar range changes
  React.useEffect(() => {
    if (range) setSelectedYear(range)
  }, [range])

  const currentWilayah = selectedWilayah
  const currentMonthObj = useMemo(() => {
    return MONTH_LIST.find((m) => m.id === selectedMonth) || MONTH_LIST.find((m) => m.id === '08') || MONTH_LIST[0]
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

  // Aggregate data for current selected wilayah & selected month (Pie Chart)
  const chartData = useMemo(() => {
    const totals = {
      UMI: { nominal: 0, volume: 0 },
      UKE: { nominal: 0, volume: 0 },
      UME: { nominal: 0, volume: 0 },
      UBE: { nominal: 0, volume: 0 }
    }

    const activeKabList = currentWilayah === 'ALL' ? fourKab : [currentWilayah]

    activeKabList.forEach((kab) => {
      if (selectedMonth === 'ALL') {
        for (let m = 1; m <= 12; m++) {
          const mKey = String(m).padStart(2, '0')
          const mData = qrisMonthlyByCategory[selectedYear]?.[mKey]?.[kab] || {}
          categories.forEach((cat) => {
            if (mData[cat]) {
              totals[cat].nominal += mData[cat].nominal || 0
              totals[cat].volume += mData[cat].volume || 0
            }
          })
        }
      } else {
        const mData = qrisMonthlyByCategory[selectedYear]?.[selectedMonth]?.[kab] || {}
        categories.forEach((cat) => {
          if (mData[cat]) {
            totals[cat].nominal += mData[cat].nominal || 0
            totals[cat].volume += mData[cat].volume || 0
          }
        })
      }
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
  }, [currentWilayah, selectedYear, selectedMonth, viewType])

  const totalSummary = useMemo(() => {
    const totalNominal = chartData.reduce((acc, c) => acc + c.nominal, 0)
    const totalVolume = chartData.reduce((acc, c) => acc + c.volume, 0)
    return {
      nominal: totalNominal,
      volume: totalVolume
    }
  }, [chartData])

  // Trend Data Generation (2024 Akhir Tahun, 2025 Akhir Tahun, dan 2026 per Bulan)
  const trendData = useMemo(() => {
    const activeKabList = currentWilayah === 'ALL' ? fourKab : [currentWilayah]
    const points = []

    if (trendMode === 'all') {
      // 2024 Akhir Tahun (Sum of all months 2024)
      const y2024 = { UMI: 0, UKE: 0, UME: 0, UBE: 0 }
      activeKabList.forEach((kab) => {
        for (let m = 1; m <= 12; m++) {
          const mKey = String(m).padStart(2, '0')
          const mData = qrisMonthlyByCategory['2024']?.[mKey]?.[kab] || {}
          categories.forEach((cat) => {
            const raw = viewType === 'nominal' ? (mData[cat]?.nominal || 0) : (mData[cat]?.volume || 0)
            y2024[cat] += raw
          })
        }
      })
      points.push({
        period: '2024 (Akhir Thn)',
        shortPeriod: "'24 Akhir",
        isAnnual: true,
        ...y2024,
        total: y2024.UMI + y2024.UKE + y2024.UME + y2024.UBE
      })

      // 2025 Akhir Tahun (Sum of all months 2025)
      const y2025 = { UMI: 0, UKE: 0, UME: 0, UBE: 0 }
      activeKabList.forEach((kab) => {
        for (let m = 1; m <= 12; m++) {
          const mKey = String(m).padStart(2, '0')
          const mData = qrisMonthlyByCategory['2025']?.[mKey]?.[kab] || {}
          categories.forEach((cat) => {
            const raw = viewType === 'nominal' ? (mData[cat]?.nominal || 0) : (mData[cat]?.volume || 0)
            y2025[cat] += raw
          })
        }
      })
      points.push({
        period: '2025 (Akhir Thn)',
        shortPeriod: "'25 Akhir",
        isAnnual: true,
        ...y2025,
        total: y2025.UMI + y2025.UKE + y2025.UME + y2025.UBE
      })
    }

    // 2026 Bulanan (Januari s.d. Desember)
    const monthlyItems = MONTH_LIST.filter((m) => m.id !== 'ALL')
    monthlyItems.forEach((m) => {
      const mTotals = { UMI: 0, UKE: 0, UME: 0, UBE: 0 }
      activeKabList.forEach((kab) => {
        const mData = qrisMonthlyByCategory['2026']?.[m.id]?.[kab] || {}
        categories.forEach((cat) => {
          const raw = viewType === 'nominal' ? (mData[cat]?.nominal || 0) : (mData[cat]?.volume || 0)
          mTotals[cat] += raw
        })
      })

      points.push({
        period: `${m.name} 2026`,
        shortPeriod: `${m.shortName} '26`,
        isAnnual: false,
        ...mTotals,
        total: mTotals.UMI + mTotals.UKE + mTotals.UME + mTotals.UBE
      })
    })

    return points
  }, [currentWilayah, viewType, trendMode])

  // Comparison data for all 4 kabupaten (adjusted for month)
  const kabComparison = useMemo(() => {
    return fourKab.map((kab) => {
      let umiNominal = 0, umiVolume = 0
      let ukeNominal = 0, ukeVolume = 0
      let umeNominal = 0, umeVolume = 0
      let ubeNominal = 0, ubeVolume = 0

      if (selectedMonth === 'ALL') {
        for (let m = 1; m <= 12; m++) {
          const mKey = String(m).padStart(2, '0')
          const kData = qrisMonthlyByCategory[selectedYear]?.[mKey]?.[kab] || {}
          umiNominal += kData.UMI?.nominal || 0
          umiVolume += kData.UMI?.volume || 0
          ukeNominal += kData.UKE?.nominal || 0
          ukeVolume += kData.UKE?.volume || 0
          umeNominal += kData.UME?.nominal || 0
          umeVolume += kData.UME?.volume || 0
          ubeNominal += kData.UBE?.nominal || 0
          ubeVolume += kData.UBE?.volume || 0
        }
      } else {
        const kData = qrisMonthlyByCategory[selectedYear]?.[selectedMonth]?.[kab] || {}
        umiNominal = kData.UMI?.nominal || 0
        umiVolume = kData.UMI?.volume || 0
        ukeNominal = kData.UKE?.nominal || 0
        ukeVolume = kData.UKE?.volume || 0
        umeNominal = kData.UME?.nominal || 0
        umeVolume = kData.UME?.volume || 0
        ubeNominal = kData.UBE?.nominal || 0
        ubeVolume = kData.UBE?.volume || 0
      }

      const totalKabNominal = umiNominal + ukeNominal + umeNominal + ubeNominal
      const totalKabVolume = umiVolume + ukeVolume + umeVolume + ubeVolume

      const getPct = (val, tot) => (tot > 0 ? (val / tot) * 100 : 0)

      const umiVal = viewType === 'nominal' ? umiNominal : umiVolume
      const ukeVal = viewType === 'nominal' ? ukeNominal : ukeVolume
      const umeVal = viewType === 'nominal' ? umeNominal : umeVolume
      const ubeVal = viewType === 'nominal' ? ubeNominal : ubeVolume
      const activeTotal = viewType === 'nominal' ? totalKabNominal : totalKabVolume

      const kabReal = qrisRealData[kab]?.[selectedYear] || {}

      return {
        kab,
        totalNominal: totalKabNominal,
        totalVolume: totalKabVolume,
        merchants: kabReal.merchants || 0,
        shares: {
          UMI: getPct(umiVal, activeTotal),
          UKE: getPct(ukeVal, activeTotal),
          UME: getPct(umeVal, activeTotal),
          UBE: getPct(ubeVal, activeTotal)
        }
      }
    })
  }, [selectedYear, selectedMonth, viewType])

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden space-y-0">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-surface-border space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-ink-900 tracking-tight">
                Segmentasi Skala Usaha QRIS (UMI, UKE, UME, UBE)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
              Proporsi data riil transaksi QRIS menurut skala usaha di 4 Kabupaten se-Banyumas Raya (<strong>{periodLabel}</strong>)
            </p>
          </div>

          {/* Controls: Month with SVG icon, Year, Metric Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* Month Filter Selector with SVG Icon (NO emoji) */}
            <div className="flex items-center gap-2 bg-surface-muted px-3 py-1.5 rounded-xl border border-surface-border shadow-xs">
              <Calendar size={14} className="text-brand shrink-0" />
              <span className="text-[11px] font-semibold text-ink-600">Periode:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 py-1 px-2.5 focus:outline-none cursor-pointer shadow-xs"
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
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
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewType === 'nominal'
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                Nominal (Rp)
              </button>
              <button
                type="button"
                onClick={() => setViewType('volume')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewType === 'volume'
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                Volume (Trx)
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
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
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

      {/* Main Content: Pie/Donut Chart & 4 Category Cards */}
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
                <Tooltip content={<CustomPieTooltip viewType={viewType} periodLabel={periodLabel} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Total Card Under Chart */}
          <div className="w-full mt-2 bg-surface-muted/60 border border-surface-border rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 block">
                Total {viewType === 'nominal' ? 'Nominal' : 'Volume'} ({currentWilayah === 'ALL' ? 'Banyumas Raya' : `Kab. ${currentWilayah}`}) · {currentMonthObj.shortName} {selectedYear}
              </span>
              <span className="font-semibold text-ink-900 text-sm sm:text-base">
                {viewType === 'nominal' ? formatRupiahShort(totalSummary.nominal) : formatVolumeShort(totalSummary.volume)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium text-ink-400 block">
                {viewType === 'nominal' ? 'Total Volume' : 'Total Nominal'}
              </span>
              <span className="font-semibold text-ink-700 text-xs">
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
                      <span className="text-xs sm:text-sm font-semibold text-ink-900 block leading-tight">
                        {cat.meta.label}
                      </span>
                      <span className="text-[10px] text-ink-400 font-medium block">
                        {cat.meta.criteria}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
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
                    <span className="text-xs sm:text-sm font-semibold text-ink-900">
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

      {/* NEW SECTION: Grafik Tren Skala Usaha (2024-2025 Akhir Tahun & 2026 Bulanan) */}
      <div className="p-4 sm:p-6 border-t border-surface-border space-y-4 bg-slate-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-brand shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-ink-900 tracking-tight">
                Tren Perkembangan Skala Usaha (2024 - 2025 Akhir Tahun & 2026 Per Bulan)
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              Grafik historis akhir tahun (2024, 2025) dilanjutkan dengan rincian data per bulan di tahun 2026 ({currentWilayah === 'ALL' ? 'Banyumas Raya' : `Kab. ${currentWilayah}`})
            </p>
          </div>

          {/* Trend Mode Switcher */}
          <div className="inline-flex p-1 bg-white rounded-xl border border-surface-border shadow-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTrendMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                trendMode === 'all'
                  ? 'bg-ink-900 text-white shadow-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Historis + 2026
            </button>
            <button
              type="button"
              onClick={() => setTrendMode('monthly2026')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                trendMode === 'monthly2026'
                  ? 'bg-ink-900 text-white shadow-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Khusus Bulanan 2026
            </button>
          </div>
        </div>

        {/* Trend Area Chart */}
        <div className="bg-white p-3 sm:p-5 rounded-xl border border-surface-border shadow-xs">
          <div className="w-full h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 12, right: 20, left: 10, bottom: 12 }}>
                <defs>
                  <linearGradient id="gradUMI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_META.UMI.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_META.UMI.color} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradUKE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_META.UKE.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_META.UKE.color} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradUME" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_META.UME.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_META.UME.color} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradUBE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_META.UBE.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_META.UBE.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="shortPeriod"
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  tickFormatter={(v) => (viewType === 'nominal' ? formatRupiahShort(v) : formatVolumeShort(v))}
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={85}
                  dx={-4}
                />
                <Tooltip content={<CustomTrendTooltip viewType={viewType} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                  formatter={(value) => {
                    const meta = CATEGORY_META[value]
                    return <span className="text-slate-700 font-semibold">{meta?.label || value}</span>
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="UMI"
                  stroke={CATEGORY_META.UMI.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradUMI)"
                />
                <Area
                  type="monotone"
                  dataKey="UKE"
                  stroke={CATEGORY_META.UKE.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradUKE)"
                />
                <Area
                  type="monotone"
                  dataKey="UME"
                  stroke={CATEGORY_META.UME.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradUME)"
                />
                <Area
                  type="monotone"
                  dataKey="UBE"
                  stroke={CATEGORY_META.UBE.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradUBE)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: 4 Kabupaten Mini-Comparison Overview */}
      <div className="p-4 sm:p-6 bg-surface-muted/30 border-t border-surface-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
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
                  <span className="text-xs font-semibold text-ink-900">
                    Kab. {item.kab}
                  </span>
                  <span className="text-[10px] text-ink-400 font-medium">
                    {item.merchants.toLocaleString('id-ID')} merchant
                  </span>
                </div>

                <div className="text-sm font-semibold text-ink-900 mb-2">
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
                <div className="flex items-center justify-between text-[9px] text-ink-400 font-semibold mt-1.5">
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

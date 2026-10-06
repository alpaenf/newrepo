import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts'
import { qrisRealData } from '../data/qrisData.js'

const CATEGORY_META = {
  UMI: {
    key: 'UMI',
    label: 'Usaha Mikro (UMI)',
    shortLabel: 'UMI',
    fullName: 'Usaha Mikro',
    color: '#3B82F6', // Blue
    bgSoft: 'bg-blue-50',
    borderSoft: 'border-blue-200',
    textMain: 'text-blue-700',
    dotColor: 'bg-blue-500',
    desc: 'Omzet < Rp 300 Juta / tahun'
  },
  UKE: {
    key: 'UKE',
    label: 'Usaha Kecil (UKE)',
    shortLabel: 'UKE',
    fullName: 'Usaha Kecil',
    color: '#10B981', // Emerald
    bgSoft: 'bg-emerald-50',
    borderSoft: 'border-emerald-200',
    textMain: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    desc: 'Omzet Rp 300 Jt - Rp 2,5 M'
  },
  UME: {
    key: 'UME',
    label: 'Usaha Menengah (UME)',
    shortLabel: 'UME',
    fullName: 'Usaha Menengah',
    color: '#F59E0B', // Amber
    bgSoft: 'bg-amber-50',
    borderSoft: 'border-amber-200',
    textMain: 'text-amber-700',
    dotColor: 'bg-amber-500',
    desc: 'Omzet Rp 2,5 M - Rp 50 M'
  },
  UBE: {
    key: 'UBE',
    label: 'Usaha Besar (UBE)',
    shortLabel: 'UBE',
    fullName: 'Usaha Besar',
    color: '#8B5CF6', // Purple
    bgSoft: 'bg-purple-50',
    borderSoft: 'border-purple-200',
    textMain: 'text-purple-700',
    dotColor: 'bg-purple-500',
    desc: 'Omzet > Rp 50 Miliar'
  }
}

function formatRupiahShort(value) {
  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`
  }
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Jt`
  }
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`
}

function formatVolumeShort(value) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Jt trx`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} rb trx`
  }
  return `${Math.round(value).toLocaleString('id-ID')} trx`
}

function CustomPieTooltip({ active, payload, viewType }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0].payload
  const meta = CATEGORY_META[item.key] || {}

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-surface-border text-xs min-w-[220px] space-y-2 z-50">
      <div className="flex items-center justify-between border-b border-surface-border pb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="font-extrabold text-ink-900 text-sm">{meta.fullName || item.name}</span>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
          style={{ backgroundColor: `${item.color}15`, color: item.color }}
        >
          {item.key}
        </span>
      </div>

      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-ink-500 font-medium">Nominal:</span>
          <span className="font-extrabold text-ink-900">{formatRupiahShort(item.nominal)}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-ink-500 font-medium">Volume:</span>
          <span className="font-extrabold text-ink-900">{item.volume.toLocaleString('id-ID')} transaksi</span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-surface-border">
          <span className="text-ink-500 font-medium">Porsi ({viewType === 'nominal' ? 'Nominal' : 'Volume'}):</span>
          <span className="font-black text-sm" style={{ color: item.color }}>
            {item.percentage}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default function HeatmapPieChart({ range = '2026', selectedId = null, data = [] }) {
  const [viewType, setViewType] = useState('nominal') // 'nominal' | 'volume'
  const [activeIndex, setActiveIndex] = useState(null)

  // Find active regency if a kecamatan is selected
  const activeRegency = useMemo(() => {
    if (!selectedId || !data || data.length === 0) return null
    const found = data.find((k) => k.id === selectedId)
    return found ? found.regency.trim() : null
  }, [selectedId, data])

  // Compute aggregated real data for the 4 categories (UMI, UKE, UME, UBE)
  const chartData = useMemo(() => {
    const categories = ['UMI', 'UKE', 'UME', 'UBE']
    const kabList = ['Banyumas', 'Cilacap', 'Purbalingga', 'Banjarnegara']

    const totals = {
      UMI: { nominal: 0, volume: 0 },
      UKE: { nominal: 0, volume: 0 },
      UME: { nominal: 0, volume: 0 },
      UBE: { nominal: 0, volume: 0 }
    }

    kabList.forEach((kab) => {
      if (!activeRegency || activeRegency.toLowerCase().includes(kab.toLowerCase())) {
        const kabData = qrisRealData[kab]?.[range] || {}
        categories.forEach((cat) => {
          if (kabData[cat]) {
            totals[cat].nominal += kabData[cat].nominal || 0
            totals[cat].volume += kabData[cat].volume || 0
          }
        })
      }
    })

    const grandTotalNominal = categories.reduce((sum, cat) => sum + totals[cat].nominal, 0)
    const grandTotalVolume = categories.reduce((sum, cat) => sum + totals[cat].volume, 0)

    const grandTotal = viewType === 'nominal' ? grandTotalNominal : grandTotalVolume

    return categories.map((cat) => {
      const val = viewType === 'nominal' ? totals[cat].nominal : totals[cat].volume
      const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0.0'
      const meta = CATEGORY_META[cat]

      return {
        key: cat,
        name: meta.fullName,
        shortLabel: meta.shortLabel,
        color: meta.color,
        value: val,
        nominal: totals[cat].nominal,
        volume: totals[cat].volume,
        percentage: pct,
        meta
      }
    })
  }, [range, activeRegency, viewType])

  const totalValue = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-surface-border shadow-card space-y-5">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-ink-900">
              Distribusi Skala Usaha QRIS (UMI, UKE, UME, UBE)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
            Komparasi segmentasi {activeRegency ? `Kabupaten ${activeRegency}` : 'Banyumas Raya'} · Tahun {range}
          </p>
        </div>

        {/* Segmented Switcher (Nominal vs Volume) */}
        <div className="inline-flex p-1 bg-surface-muted rounded-xl border border-surface-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewType('nominal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewType === 'volume'
                ? 'bg-white text-ink-900 shadow-sm'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            Volume (Trx)
          </button>
        </div>
      </div>

      {/* Main Grid: Pie Chart on Left, 4 Category Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Pie Chart Display */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[280px]">
          <div className="w-full h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.key}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={activeIndex === index ? 3 : 2}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                      className="transition-all duration-300 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip viewType={viewType} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Info in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink-400">
              Total {viewType === 'nominal' ? 'Nominal' : 'Volume'}
            </span>
            <span className="text-sm sm:text-base font-black text-ink-900 max-w-[140px] truncate">
              {viewType === 'nominal' ? formatRupiahShort(totalValue) : formatVolumeShort(totalValue)}
            </span>
            <span className="text-[10px] text-ink-400 font-medium">4 Kategori</span>
          </div>
        </div>

        {/* 4 Category Cards Breakdown */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {chartData.map((cat, idx) => {
            const isHovered = activeIndex === idx
            return (
              <div
                key={cat.key}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? `${cat.meta.bgSoft} ${cat.meta.borderSoft} shadow-md scale-[1.02]`
                    : 'bg-surface-muted/40 border-surface-border hover:bg-surface-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cat.meta.dotColor} shrink-0`} />
                    <span className="text-xs sm:text-sm font-extrabold text-ink-900">
                      {cat.name}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isHovered ? 'bg-white shadow-sm' : cat.meta.bgSoft
                    } ${cat.meta.textMain}`}
                  >
                    {cat.key} · {cat.percentage}%
                  </span>
                </div>

                {/* Values (Nominal + Volume) */}
                <div className="space-y-1 mt-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-ink-500 font-medium">Nominal:</span>
                    <span className="text-xs sm:text-sm font-black text-ink-900">
                      {formatRupiahShort(cat.nominal)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-ink-500 font-medium">Volume:</span>
                    <span className="text-[11px] sm:text-xs font-semibold text-ink-700">
                      {cat.volume.toLocaleString('id-ID')} trx
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-border/60 rounded-full h-1.5 mt-2.5 overflow-hidden">
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
    </div>
  )
}

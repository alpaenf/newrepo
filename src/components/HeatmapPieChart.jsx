import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts'
import { Calendar, TrendingUp, BarChart3, Layers } from './icons.jsx'
import { qrisRealData, qrisMonthlyByCategory, qrisMonthlyMerchants } from '../data/qrisData.js'
import { YEAR_OPTIONS, parseYearRange } from '../data/heatmapData.js'

// Urutan resmi: Banjarnegara (1), Banyumas (2), Cilacap (3), Purbalingga (4)
const KABUPATEN_LIST = [
  { id: 'ALL', name: 'Semua (Banyumas Raya)', shortName: 'Banyumas Raya' },
  { id: 'Banjarnegara', name: 'Kab. Banjarnegara', shortName: 'Banjarnegara' },
  { id: 'Banyumas', name: 'Kab. Banyumas', shortName: 'Banyumas' },
  { id: 'Cilacap', name: 'Kab. Cilacap', shortName: 'Cilacap' },
  { id: 'Purbalingga', name: 'Kab. Purbalingga', shortName: 'Purbalingga' }
]

export const KABUPATEN_META = {
  Banjarnegara: {
    id: 'Banjarnegara',
    name: 'Kab. Banjarnegara',
    shortName: 'Banjarnegara',
    color: '#D97706', // Warm Amber / Emas
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    textMain: 'text-amber-700',
    dotColor: 'bg-amber-500'
  },
  Banyumas: {
    id: 'Banyumas',
    name: 'Kab. Banyumas',
    shortName: 'Banyumas',
    color: '#2563EB', // Blue BI
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    textMain: 'text-blue-700',
    dotColor: 'bg-blue-600'
  },
  Cilacap: {
    id: 'Cilacap',
    name: 'Kab. Cilacap',
    shortName: 'Cilacap',
    color: '#059669', // Emerald Green
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    textMain: 'text-emerald-700',
    dotColor: 'bg-emerald-600'
  },
  Purbalingga: {
    id: 'Purbalingga',
    name: 'Kab. Purbalingga',
    shortName: 'Purbalingga',
    color: '#7C3AED', // Royal Purple
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    textMain: 'text-purple-700',
    dotColor: 'bg-purple-600'
  }
}

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
  { id: '09', name: 'September', shortName: 'Sep', disabled: true },
  { id: '10', name: 'Oktober', shortName: 'Okt', disabled: true },
  { id: '11', name: 'November', shortName: 'Nov', disabled: true },
  { id: '12', name: 'Desember', shortName: 'Des', disabled: true }
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
  },
  'BLU/PSO': {
    key: 'BLU/PSO',
    label: 'BLU / PSO',
    shortLabel: 'BLU',
    color: '#0284C7', // Sky Blue
    bgLight: 'bg-sky-50/70',
    borderLight: 'border-sky-200',
    textMain: 'text-sky-700',
    dotColor: 'bg-sky-600',
    criteria: 'Badan Layanan Umum / Pelayanan Publik'
  },
  Lainnya: {
    key: 'Lainnya',
    label: 'Lainnya',
    shortLabel: 'Lainnya',
    color: '#64748B', // Slate
    bgLight: 'bg-slate-50/70',
    borderLight: 'border-slate-200',
    textMain: 'text-slate-700',
    dotColor: 'bg-slate-600',
    criteria: 'Transaksi Khusus & Non-Kategori'
  }
}

const CATEGORY_KEYS = ['UMI', 'UKE', 'UME', 'UBE', 'BLU/PSO', 'Lainnya']

const CATEGORY_FILTER_OPTIONS = [
  { id: 'ALL', label: 'Semua Skala (6 Kategori)' },
  { id: 'UMI', label: 'Khusus Mikro (UMI)', color: CATEGORY_META.UMI.color },
  { id: 'UKE', label: 'Khusus Kecil (UKE)', color: CATEGORY_META.UKE.color },
  { id: 'UME', label: 'Khusus Menengah (UME)', color: CATEGORY_META.UME.color },
  { id: 'UBE', label: 'Khusus Besar (UBE)', color: CATEGORY_META.UBE.color },
  { id: 'BLU/PSO', label: 'Khusus BLU / PSO', color: CATEGORY_META['BLU/PSO'].color },
  { id: 'Lainnya', label: 'Khusus Lainnya', color: CATEGORY_META.Lainnya.color }
]

function getGradientId(catKey) {
  return `grad_${catKey.replace(/[^a-zA-Z0-9]/g, '_')}`
}

function getKabGradientId(kab) {
  return `trend_kab_grad_${kab.replace(/[^a-zA-Z0-9]/g, '_')}`
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

function formatVolumeFull(value) {
  return `${Math.round(value || 0).toLocaleString('id-ID')} trx`
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
          <span className="font-bold text-slate-900">{formatVolumeFull(item.volume)}</span>
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

function getYearColor(index, totalYears, catFilter) {
  if (totalYears <= 1) {
    return CATEGORY_META[catFilter]?.color || '#2563EB'
  }

  if (catFilter === 'UMI') {
    const blues = ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#172554']
    const step = Math.min(blues.length - 1, Math.floor((index / (totalYears - 1)) * (blues.length - 1)))
    return blues[step]
  }
  if (catFilter === 'UKE') {
    const greens = ['#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#064E3B']
    const step = Math.min(greens.length - 1, Math.floor((index / (totalYears - 1)) * (greens.length - 1)))
    return greens[step]
  }
  if (catFilter === 'UME') {
    const ambers = ['#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#78350F']
    const step = Math.min(ambers.length - 1, Math.floor((index / (totalYears - 1)) * (ambers.length - 1)))
    return ambers[step]
  }
  if (catFilter === 'UBE') {
    const purples = ['#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#4C1D95']
    const step = Math.min(purples.length - 1, Math.floor((index / (totalYears - 1)) * (purples.length - 1)))
    return purples[step]
  }
  if (catFilter === 'BLU/PSO') {
    const skyBlues = ['#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985']
    const step = Math.min(skyBlues.length - 1, Math.floor((index / (totalYears - 1)) * (skyBlues.length - 1)))
    return skyBlues[step]
  }
  if (catFilter === 'Lainnya') {
    const slates = ['#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A']
    const step = Math.min(slates.length - 1, Math.floor((index / (totalYears - 1)) * (slates.length - 1)))
    return slates[step]
  }

  // categoryFilter === 'ALL'
  const allPalette = ['#94A3B8', '#64748B', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED', '#059669', '#D97706', '#DC2626']
  const step = Math.min(allPalette.length - 1, Math.floor((index / (totalYears - 1)) * (allPalette.length - 1)))
  return allPalette[step]
}

function CustomBarSeriesTooltip({ active, payload, label, viewType, periodLabel, isRange, categoryFilter, yearsInRange }) {
  if (!active || !payload || !payload.length) return null

  const itemData = payload[0]?.payload || {}

  // If in Range mode and showing All categories (stacked per year):
  if (isRange && categoryFilter === 'ALL' && yearsInRange && yearsInRange.length > 0) {
    const totalAllYears = yearsInRange.reduce((sum, yr) => sum + (Number(itemData[yr]) || 0), 0)

    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[310px] max-w-[420px] space-y-2.5 z-[9999]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <span className="font-bold text-slate-900 text-sm block">{label}</span>
            <span className="text-[10px] text-slate-400 font-medium">{periodLabel} (6 Skala Usaha)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">
              Total {viewType === 'nominal' ? 'Nominal' : 'Volume'}
            </span>
            <span className="font-bold text-slate-900 text-xs text-blue-700">
              {viewType === 'nominal' ? formatRupiahShort(totalAllYears) : formatVolumeFull(totalAllYears)}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-0.5 max-h-[320px] overflow-y-auto pr-0.5">
          {yearsInRange.map((yr) => {
            const yrTotal = Number(itemData[yr]) || 0

            return (
              <div key={yr} className="bg-slate-50/90 p-2 rounded-lg border border-slate-100/90 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                    Tahun {yr}
                  </span>
                  <span className="text-slate-900 font-bold">
                    {viewType === 'nominal' ? formatRupiahShort(yrTotal) : formatVolumeFull(yrTotal)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-600 pl-1">
                  {CATEGORY_KEYS.map((catKey) => {
                    const catVal = Number(itemData[`${yr}_${catKey}`]) || 0
                    const meta = CATEGORY_META[catKey] || {}
                    return (
                      <div key={catKey} className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500 truncate mr-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor || 'bg-slate-500'} shrink-0`} />
                          {catKey}:
                        </span>
                        <span className="font-semibold text-slate-800 shrink-0">
                          {viewType === 'nominal' ? formatRupiahShort(catVal) : formatVolumeFull(catVal)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const total = payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0)

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[270px] space-y-2 z-[9999]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <span className="font-bold text-slate-900 text-sm block">{label}</span>
          <span className="text-[10px] text-slate-400 font-medium">{periodLabel}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 block uppercase">
            {isRange
              ? (categoryFilter !== 'ALL' ? `Total ${categoryFilter}` : `Total ${viewType === 'nominal' ? 'Nominal' : 'Volume'}`)
              : `Total ${viewType === 'nominal' ? 'Nominal' : 'Volume'}`}
          </span>
          <span className="font-bold text-slate-900 text-xs">
            {viewType === 'nominal' ? formatRupiahShort(total) : formatVolumeFull(total)}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-0.5">
        {payload.map((entry) => {
          const meta = CATEGORY_META[entry.dataKey] || {}
          const val = Number(entry.value) || 0
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0'
          const entryDisplayName = entry.name || (meta.label ? `${meta.label} (${entry.dataKey})` : `Tahun ${entry.dataKey}`)

          return (
            <div key={entry.dataKey} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="font-semibold text-slate-700">{entryDisplayName}:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {viewType === 'nominal' ? formatRupiahShort(val) : formatVolumeFull(val)}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">({pct}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CustomTrendTooltip({ active, payload, label, viewType, trendSplitBy, trendCategoryFilter }) {
  if (!active || !payload || !payload.length) return null

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0)
  const isWilayahMode = trendSplitBy === 'wilayah'

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[280px] space-y-2 z-[9999]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <div>
          <span className="font-semibold text-slate-900 text-sm block">{label}</span>
          {isWilayahMode && trendCategoryFilter !== 'ALL' && (
            <span className="text-[10px] text-blue-600 font-semibold block">
              Skala: {CATEGORY_META[trendCategoryFilter]?.label} ({trendCategoryFilter})
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-900 block">
            {isWilayahMode ? 'Total Gabungan:' : 'Total:'} {viewType === 'nominal' ? formatRupiahShort(total) : formatVolumeFull(total)}
          </span>
          {viewType === 'nominal' && (
            <span className="text-[9.5px] text-slate-400 font-mono block">
              {formatRupiahFull(total)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5 pt-0.5">
        {payload.map((entry) => {
          const val = entry.value || 0
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0'
          const kabMeta = KABUPATEN_META[entry.dataKey]
          const catMeta = CATEGORY_META[entry.dataKey]
          const displayName = kabMeta ? kabMeta.name : (catMeta?.label || entry.name)

          return (
            <div key={entry.dataKey} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-semibold text-slate-700">
                  {displayName}
                  {catMeta && !kabMeta ? ` (${entry.dataKey})` : ''}:
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-right">
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {viewType === 'nominal' ? formatRupiahShort(val) : formatVolumeFull(val)}
                  </span>
                  {viewType === 'nominal' && (
                    <span className="text-[9.5px] text-slate-400 font-normal block font-mono">
                      {formatRupiahFull(val)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 self-center">({pct}%)</span>
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
  if (pct < 3.5) return null

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
        <tspan x={x} dy="-0.4em" fontSize="11" fontWeight="700">
          {payload.shortLabel || payload.key}
        </tspan>
        <tspan x={x} dy="1.15em" fontSize="10" fontWeight="600" opacity={0.95}>
          {payload.percentage}%
        </tspan>
      </text>
    </g>
  )
}

export default function HeatmapPieChart({
  range,
  onRangeChange,
  month,
  onMonthChange,
  selectedId,
  data
}) {
  // Multi-select Wilayah (Array of kab IDs: e.g. ['ALL'] or ['Banjarnegara', 'Purbalingga'])
  const [selectedWilayah, setSelectedWilayah] = useState(['ALL'])
  const [selectedMonth, setSelectedMonth] = useState(month || '08') // Default: '08' (Agustus 2026 data riil)
  const [selectedYear, setSelectedYear] = useState(range || '2026')
  const [viewType, setViewType] = useState('nominal') // 'nominal' | 'volume'
  const [trendStartYear, setTrendStartYear] = useState('2026')
  const [trendEndYear, setTrendEndYear] = useState('2026')
  const [barChartMode, setBarChartMode] = useState('grouped') // 'grouped' | 'stacked'
  const [categoryFilter, setCategoryFilter] = useState('ALL') // 'ALL' | 'UMI' | 'UKE' | 'UME' | 'UBE' | 'BLU/PSO' | 'Lainnya'
  const [trendCategoryFilter, setTrendCategoryFilter] = useState('ALL')
  const [trendSplitMode, setTrendSplitMode] = useState(null) // null = auto, 'wilayah' | 'skala'
  const [activeIndex, setActiveIndex] = useState(null)

  // Categories to include (All 6 Scales)
  const categories = CATEGORY_KEYS
  // Urutan resmi: 1. Banjarnegara, 2. Banyumas, 3. Cilacap, 4. Purbalingga
  const fourKab = ['Banjarnegara', 'Banyumas', 'Cilacap', 'Purbalingga']

  const isAllWilayah = useMemo(() => {
    return (
      !selectedWilayah ||
      selectedWilayah.includes('ALL') ||
      selectedWilayah.length === 0 ||
      selectedWilayah.length >= fourKab.length
    )
  }, [selectedWilayah])

  const activeKabList = useMemo(() => {
    if (isAllWilayah) return fourKab
    return fourKab.filter((k) => selectedWilayah.includes(k))
  }, [isAllWilayah, selectedWilayah])

  // Mode split grafik tren: apakah per wilayah atau per skala usaha
  const effectiveSplitBy = useMemo(() => {
    if (trendSplitMode) return trendSplitMode
    // Otomatis: jika user memilih 2 atau 3 wilayah (multi-wilayah), tampilkan garis per wilayah untuk perbandingan
    if (!isAllWilayah && activeKabList.length > 1) {
      return 'wilayah'
    }
    return 'skala'
  }, [trendSplitMode, isAllWilayah, activeKabList.length])

  const wilayahLabel = useMemo(() => {
    if (isAllWilayah) return 'Banyumas Raya (Semua Wilayah)'
    if (activeKabList.length === 1) return `Kab. ${activeKabList[0]}`
    if (activeKabList.length === 2) return `Kab. ${activeKabList[0]} & Kab. ${activeKabList[1]}`
    return `${activeKabList.length} Wilayah (${activeKabList.map((k) => `Kab. ${k}`).join(', ')})`
  }, [isAllWilayah, activeKabList])

  const toggleWilayah = (kabId) => {
    setTrendSplitMode(null)
    if (kabId === 'ALL') {
      setSelectedWilayah(['ALL'])
      return
    }

    if (isAllWilayah) {
      setSelectedWilayah([kabId])
      return
    }

    if (selectedWilayah.includes(kabId)) {
      const next = selectedWilayah.filter((k) => k !== kabId)
      if (next.length === 0) {
        setSelectedWilayah(['ALL'])
      } else {
        setSelectedWilayah(next)
      }
    } else {
      const next = [...selectedWilayah, kabId]
      if (next.length >= fourKab.length) {
        setSelectedWilayah(['ALL'])
      } else {
        setSelectedWilayah(next)
      }
    }
  }

  const currentWilayah = isAllWilayah ? 'ALL' : activeKabList.length === 1 ? activeKabList[0] : activeKabList.join(', ')

  const handleTrendRangeChange = (newStart, newEnd) => {
    let s = parseInt(newStart, 10) || 2024
    let e = parseInt(newEnd, 10) || 2026
    if (s > e) e = s
    setTrendStartYear(String(s))
    setTrendEndYear(String(e))
  }

  // Update selected year if toolbar range changes
  React.useEffect(() => {
    if (range && range !== selectedYear) {
      setSelectedYear(range)
      if (range !== '2026') {
        setSelectedMonth('ALL')
      }
    }
  }, [range])

  // Sync with external month prop — auto-reset ke Agustus jika bulan tidak tersedia
  React.useEffect(() => {
    const incomingMonth = month || '08'
    const monthObj = MONTH_LIST.find((m) => m.id === incomingMonth)
    const safeMonth = monthObj?.disabled ? '08' : incomingMonth
    if (safeMonth !== selectedMonth) {
      setSelectedMonth(safeMonth)
    }
  }, [month])

  const { startYear, endYear, isRange } = parseYearRange(selectedYear)

  const yearsInRange = useMemo(() => {
    const sNum = parseInt(startYear, 10) || 2026
    const eNum = parseInt(endYear, 10) || sNum
    const list = []
    for (let y = sNum; y <= eNum; y++) {
      list.push(String(y))
    }
    return list
  }, [startYear, endYear])

  const handleYearRangeChange = (newStart, newEnd) => {
    let s = parseInt(newStart, 10) || 2026
    let e = parseInt(newEnd, 10) || s
    if (s > e) e = s
    const val = s === e ? String(s) : `${s}-${e}`
    setSelectedYear(val)
    if (onRangeChange) {
      onRangeChange(val)
    }
    if (val !== '2026') {
      setSelectedMonth('ALL')
      if (onMonthChange) onMonthChange('ALL')
    } else {
      const defaultM = selectedMonth === 'ALL' ? '08' : selectedMonth
      setSelectedMonth(defaultM)
      if (onMonthChange) onMonthChange(defaultM)
    }
  }

  const handleMonthChange = (newM) => {
    // Guard: jangan pilih bulan yang belum tersedia
    const monthObj = MONTH_LIST.find((m) => m.id === newM)
    if (monthObj?.disabled) return
    setSelectedMonth(newM)
    if (onMonthChange) {
      onMonthChange(newM)
    }
  }

  const currentMonthObj = useMemo(() => {
    return MONTH_LIST.find((m) => m.id === selectedMonth) || MONTH_LIST.find((m) => m.id === '08') || MONTH_LIST[0]
  }, [selectedMonth])

  const periodLabel = useMemo(() => {
    const { startYear: s, endYear: e, isRange: r } = parseYearRange(selectedYear)
    if (r) {
      return `Rentang Tahun ${s} - ${e}`
    }
    if (s !== '2026') {
      return `Akhir Tahun ${s}`
    }
    if (selectedMonth === 'ALL') {
      return 'Tahun 2026 (Tahunan)'
    }
    return `Bulan ${currentMonthObj.name} 2026`
  }, [selectedYear, selectedMonth, currentMonthObj])

  // Helper to fetch category data for a kabupaten based on active year range & month
  const getCatData = (kab, rangeStr, mKey, catKey) => {
    const { startYear: s, endYear: e, isRange: r } = parseYearRange(rangeStr)
    const sNum = parseInt(s, 10) || 2026
    const eNum = parseInt(e, 10) || sNum

    if (!r) {
      const yr = s
      if (yr !== '2026') {
        const kabData = qrisRealData[kab]?.[yr]
        if (kabData) {
          const catData = kabData[catKey] || { nominal: 0, volume: 0 }
          return {
            nominal: catData.nominal || 0,
            volume: catData.volume || 0
          }
        }
        const base2024 = qrisRealData[kab]?.['2024']?.[catKey] || { nominal: 0, volume: 0 }
        const diffYears = Math.max(1, 2024 - (parseInt(yr, 10) || 2024))
        const scale = Math.max(0.08, Math.pow(0.72, diffYears))
        return {
          nominal: Math.round(base2024.nominal * scale),
          volume: Math.round(base2024.volume * scale)
        }
      }

      // Single Year 2026:
      if (mKey === 'ALL') {
        const kabData = qrisRealData[kab]?.['2026']
        if (kabData && kabData[catKey]) {
          return {
            nominal: kabData[catKey].nominal || 0,
            volume: kabData[catKey].volume || 0
          }
        }
        let nom = 0, vol = 0
        for (let m = 1; m <= 12; m++) {
          const mStr = String(m).padStart(2, '0')
          const mData = qrisMonthlyByCategory['2026']?.[mStr]?.[kab]?.[catKey]
          nom += mData?.nominal || 0
          vol += mData?.volume || 0
        }
        return { nominal: nom, volume: vol }
      }

      // Specific month in 2026:
      const mData = qrisMonthlyByCategory['2026']?.[mKey]?.[kab]?.[catKey] || {}
      return {
        nominal: mData.nominal || 0,
        volume: mData.volume || 0
      }
    }

    // Multi-Year Range (e.g. 2024 - 2026):
    let totalNom = 0
    let totalVol = 0

    for (let y = sNum; y <= eNum; y++) {
      const yStr = String(y)
      if (yStr === '2026') {
        const kabData = qrisRealData[kab]?.['2026']
        if (kabData && kabData[catKey]) {
          totalNom += kabData[catKey].nominal || 0
          totalVol += kabData[catKey].volume || 0
        } else {
          for (let m = 1; m <= 12; m++) {
            const mStr = String(m).padStart(2, '0')
            const mData = qrisMonthlyByCategory['2026']?.[mStr]?.[kab]?.[catKey]
            totalNom += mData?.nominal || 0
            totalVol += mData?.volume || 0
          }
        }
      } else {
        const kabData = qrisRealData[kab]?.[yStr]
        if (kabData) {
          const catData = kabData[catKey] || { nominal: 0, volume: 0 }
          totalNom += catData.nominal || 0
          totalVol += catData.volume || 0
        } else {
          const base2024 = qrisRealData[kab]?.['2024']?.[catKey] || { nominal: 0, volume: 0 }
          const diffYears = Math.max(1, 2024 - y)
          const scale = Math.max(0.08, Math.pow(0.72, diffYears))
          totalNom += Math.round(base2024.nominal * scale)
          totalVol += Math.round(base2024.volume * scale)
        }
      }
    }

    return { nominal: totalNom, volume: totalVol }
  }

  // Multi-Series Bar Chart Data for comparing selected Kabupaten side-by-side (Per Wilayah)
  const barChartData = useMemo(() => {
    return activeKabList.map((kab) => {
      if (isRange) {
        const row = {
          kab,
          name: `Kab. ${kab}`,
          shortName: kab
        }
        let totalKab = 0
        yearsInRange.forEach((yr) => {
          let yrTotal = 0
          let yrTotalNominal = 0
          let yrTotalVolume = 0

          categories.forEach((cat) => {
            const catData = getCatData(kab, yr, 'ALL', cat)
            const catVal = viewType === 'nominal' ? catData.nominal : catData.volume
            row[`${yr}_${cat}`] = catVal
            row[`${yr}_${cat}_nominal`] = catData.nominal
            row[`${yr}_${cat}_volume`] = catData.volume
            yrTotal += catVal
            yrTotalNominal += catData.nominal
            yrTotalVolume += catData.volume
          })

          if (categoryFilter === 'ALL') {
            row[yr] = yrTotal
            row[`nominal_${yr}`] = yrTotalNominal
            row[`volume_${yr}`] = yrTotalVolume
            totalKab += yrTotal
          } else {
            const catVal = row[`${yr}_${categoryFilter}`] || 0
            row[yr] = catVal
            row[`nominal_${yr}`] = row[`${yr}_${categoryFilter}_nominal`] || 0
            row[`volume_${yr}`] = row[`${yr}_${categoryFilter}_volume`] || 0
            totalKab += catVal
          }
        })
        row.total = totalKab
        return row
      }

      // Single-Year Mode:
      const row = {
        kab,
        name: `Kab. ${kab}`,
        shortName: kab
      }
      let total = 0
      categories.forEach((cat) => {
        const catData = getCatData(kab, selectedYear, selectedMonth, cat)
        const catVal = viewType === 'nominal' ? catData.nominal : catData.volume
        row[cat] = catVal
        row[`nominal_${cat}`] = catData.nominal
        row[`volume_${cat}`] = catData.volume
        total += catVal
      })
      row.total = total
      return row
    })
  }, [activeKabList, selectedYear, selectedMonth, viewType, isRange, yearsInRange, categoryFilter])

  // Aggregate data for current selected wilayah & selected month (Pie Chart)
  const chartData = useMemo(() => {
    const totals = {}
    categories.forEach((cat) => {
      totals[cat] = { nominal: 0, volume: 0 }
    })

    activeKabList.forEach((kab) => {
      categories.forEach((cat) => {
        const catData = getCatData(kab, selectedYear, selectedMonth, cat)
        totals[cat].nominal += catData.nominal
        totals[cat].volume += catData.volume
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
        shortLabel: meta.shortLabel || cat,
        color: meta.color,
        value: catVal,
        nominal: totals[cat].nominal,
        volume: totals[cat].volume,
        percentage: pct,
        meta
      }
    })
  }, [activeKabList, selectedYear, selectedMonth, viewType])

  const totalSummary = useMemo(() => {
    const totalNominal = chartData.reduce((acc, c) => acc + c.nominal, 0)
    const totalVolume = chartData.reduce((acc, c) => acc + c.volume, 0)
    return {
      nominal: totalNominal,
      volume: totalVolume
    }
  }, [chartData])

  // Trend Data Generation based on selected trendStartYear and trendEndYear
  const trendData = useMemo(() => {
    const points = []

    const sNum = parseInt(trendStartYear, 10) || 2024
    const eNum = parseInt(trendEndYear, 10) || 2026

    // Historical annual points for years < 2026 in the range
    for (let y = sNum; y <= Math.min(eNum, 2025); y++) {
      const yTotals = {}
      categories.forEach((c) => { yTotals[c] = 0 })

      const kabTotals = {}
      const kabCatVals = {}

      activeKabList.forEach((kab) => {
        let kabSum = 0
        categories.forEach((cat) => {
          const raw = getCatData(kab, String(y), 'ALL', cat)
          const val = viewType === 'nominal' ? raw.nominal : raw.volume
          yTotals[cat] += val
          kabSum += val
          kabCatVals[`${kab}_${cat}`] = val
        })
        kabTotals[kab] = kabSum
      })

      const totY = categories.reduce((s, c) => s + yTotals[c], 0)

      // Nilai per masing-masing kabupaten untuk perbandingan multi-wilayah:
      const kabPointValues = {}
      activeKabList.forEach((kab) => {
        if (trendCategoryFilter === 'ALL') {
          kabPointValues[kab] = kabTotals[kab] || 0
        } else {
          kabPointValues[kab] = kabCatVals[`${kab}_${trendCategoryFilter}`] || 0
        }
      })

      points.push({
        period: `Akhir Tahun ${y}`,
        shortPeriod: `'${String(y).slice(2)}`,
        isAnnual: true,
        ...yTotals,
        ...kabPointValues,
        total: totY
      })
    }

    // If 2026 is included in the range:
    if (eNum >= 2026) {
      // 2026 Bulanan (Januari s.d. Agustus — data tersedia)
      const monthlyItems = MONTH_LIST.filter((m) => m.id !== 'ALL' && !m.disabled)
      monthlyItems.forEach((m) => {
        const mTotals = {}
        categories.forEach((c) => { mTotals[c] = 0 })

        const kabTotals = {}
        const kabCatVals = {}

        activeKabList.forEach((kab) => {
          let kabSum = 0
          categories.forEach((cat) => {
            const raw = getCatData(kab, '2026', m.id, cat)
            const val = viewType === 'nominal' ? (raw?.nominal || 0) : (raw?.volume || 0)
            mTotals[cat] += val
            kabSum += val
            kabCatVals[`${kab}_${cat}`] = val
          })
          kabTotals[kab] = kabSum
        })

        const totM = categories.reduce((s, c) => s + mTotals[c], 0)

        // Nilai per masing-masing kabupaten untuk perbandingan multi-wilayah:
        const kabPointValues = {}
        activeKabList.forEach((kab) => {
          if (trendCategoryFilter === 'ALL') {
            kabPointValues[kab] = kabTotals[kab] || 0
          } else {
            kabPointValues[kab] = kabCatVals[`${kab}_${trendCategoryFilter}`] || 0
          }
        })

        points.push({
          period: `${m.name} 2026`,
          shortPeriod: `${m.shortName} '26`,
          isAnnual: false,
          ...mTotals,
          ...kabPointValues,
          total: totM
        })
      })
    }

    return points
  }, [activeKabList, viewType, trendStartYear, trendEndYear, trendCategoryFilter])

  // Comparison data for all 4 kabupaten in official sequence: Banjarnegara, Banyumas, Cilacap, Purbalingga
  const kabComparison = useMemo(() => {
    return fourKab.map((kab) => {
      let totalKabNominal = 0
      let totalKabVolume = 0
      const catVals = {}

      categories.forEach((cat) => {
        const catData = getCatData(kab, selectedYear, selectedMonth, cat)
        totalKabNominal += catData.nominal
        totalKabVolume += catData.volume
        catVals[cat] = viewType === 'nominal' ? catData.nominal : catData.volume
      })

      const activeTotal = viewType === 'nominal' ? totalKabNominal : totalKabVolume
      const getPct = (val, tot) => (tot > 0 ? (val / tot) * 100 : 0)

      const shares = {}
      categories.forEach((cat) => {
        shares[cat] = getPct(catVals[cat], activeTotal)
      })

      const kabReal = qrisRealData[kab]?.[selectedYear] || {}
      let mMerchants = kabReal.merchants || 0
      if (selectedMonth && selectedMonth !== 'ALL' && qrisMonthlyMerchants?.[selectedYear]?.[selectedMonth]?.[kab]) {
        mMerchants = qrisMonthlyMerchants[selectedYear][selectedMonth][kab]
      }

      return {
        kab,
        totalNominal: totalKabNominal,
        totalVolume: totalKabVolume,
        merchants: mMerchants,
        shares
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
                Segmentasi Skala Usaha QRIS (6 Kategori Usaha)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
              Proporsi data riil transaksi QRIS menurut skala usaha di 4 Kabupaten se-Banyumas Raya (<strong>{periodLabel}</strong>)
            </p>
          </div>

          {/* Controls: Year, Month, Metric Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* Year Range Selector: Dari [Tahun] s.d. [Tahun] */}
            <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1.5 rounded-xl border border-surface-border shadow-xs whitespace-nowrap">
              <span className="text-[11px] font-semibold text-ink-600">Rentang:</span>
              <select
                value={startYear}
                onChange={(e) => handleYearRangeChange(e.target.value, endYear)}
                className="py-1 px-2 bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 focus:outline-none shadow-xs cursor-pointer"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <span className="text-xs font-medium text-ink-400">s.d.</span>
              <select
                value={endYear}
                onChange={(e) => handleYearRangeChange(startYear, e.target.value)}
                className="py-1 px-2 bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 focus:outline-none shadow-xs cursor-pointer"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter Selector for single 2026, or Akhir Tahun / Akumulasi Badge */}
            {!isRange && startYear === '2026' ? (
              <div className="flex items-center gap-2 bg-surface-muted px-3 py-1.5 rounded-xl border border-surface-border shadow-xs">
                <Calendar size={14} className="text-brand shrink-0" />
                <span className="text-[11px] font-semibold text-ink-600">Periode:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 py-1 px-2.5 focus:outline-none cursor-pointer shadow-xs"
                >
                  {MONTH_LIST.map((m) => (
                    <option key={m.id} value={m.id} disabled={!!m.disabled}>
                      {m.disabled ? `${m.name} (Belum tersedia)` : m.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                <Calendar size={14} className="text-slate-500 shrink-0" />
                <span>{isRange ? `Akumulasi ${startYear} - ${endYear}` : `Akhir Tahun ${startYear}`}</span>
                <span className="text-[10px] text-slate-500 font-normal">(Riwayat)</span>
              </div>
            )}

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

        {/* Wilayah Tabs & Category Filter Pills */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
              {/* Button Semua */}
              <button
                type="button"
                onClick={() => toggleWilayah('ALL')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isAllWilayah
                    ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
                    : 'bg-surface-muted/50 text-ink-600 border-surface-border hover:bg-surface-muted hover:text-ink-900'
                }`}
              >
                Semua (Banyumas Raya)
              </button>

              {/* 4 Kabupaten */}
              {fourKab.map((kabName) => {
                const isSelected = !isAllWilayah && selectedWilayah.includes(kabName)
                const kabColor = KABUPATEN_META[kabName]?.color || '#94A3B8'
                return (
                  <button
                    key={kabName}
                    type="button"
                    onClick={() => toggleWilayah(kabName)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-1 ring-blue-500'
                        : 'bg-surface-muted/50 text-ink-600 border-surface-border hover:bg-surface-muted hover:text-ink-900'
                    }`}
                    title={isSelected ? 'Klik untuk membatalkan pilihan' : 'Klik untuk memilih/membandingkan wilayah ini'}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isSelected ? '#FFFFFF' : kabColor }}
                    />
                    {isSelected && <span className="font-bold">✓</span>}
                    Kab. {kabName}
                  </button>
                )
              })}
            </div>

            {!isAllWilayah && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs">
                  {activeKabList.length} Wilayah Terpilih ({activeKabList.map((k) => `Kab. ${k}`).join(', ')})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedWilayah(['ALL'])}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 shadow-xs"
                >
                  ✕ Reset ke Semua
                </button>
              </div>
            )}
          </div>

          {/* Quick Category Focus Dropdown */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-2 bg-surface-muted/80 px-2.5 py-1 rounded-xl border border-surface-border shadow-xs">
              <Layers size={13} className="text-brand shrink-0" />
              <span className="text-[11px] font-semibold text-ink-600">Filter Skala Usaha:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 py-1 px-2.5 focus:outline-none cursor-pointer shadow-xs"
              >
                {CATEGORY_FILTER_OPTIONS.map((catOpt) => (
                  <option key={catOpt.id} value={catOpt.id}>
                    {catOpt.label}
                  </option>
                ))}
              </select>
            </div>
            {categoryFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setCategoryFilter('ALL')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-200 shadow-xs"
              >
                ✕ Reset ke Semua Skala
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Pie/Donut Chart & 6 Category Cards */}
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
                  paddingAngle={2.5}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  animationDuration={600}
                >
                  {chartData.map((entry, index) => {
                    const isFocus = categoryFilter === 'ALL' || categoryFilter === entry.key
                    return (
                      <Cell
                        key={`cell-${entry.key}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={activeIndex === index || categoryFilter === entry.key ? 3 : 2}
                        opacity={isFocus ? (activeIndex === null || activeIndex === index ? 1 : 0.85) : 0.25}
                        className="transition-all duration-200 cursor-pointer"
                      />
                    )
                  })}
                </Pie>
                <Tooltip content={<CustomPieTooltip viewType={viewType} periodLabel={periodLabel} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Total Card Under Chart */}
          <div className="w-full mt-2 bg-surface-muted/60 border border-surface-border rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 block">
                Total {viewType === 'nominal' ? 'Nominal' : 'Volume'} ({wilayahLabel}) · {currentMonthObj.shortName} {selectedYear}
              </span>
              <span className="font-semibold text-ink-900 text-sm sm:text-base">
                {viewType === 'nominal' ? formatRupiahShort(totalSummary.nominal) : formatVolumeFull(totalSummary.volume)}
              </span>
              {viewType === 'nominal' && (
                <span className="text-[10px] text-ink-500 font-mono block">
                  {formatRupiahFull(totalSummary.nominal)}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium text-ink-400 block">
                {viewType === 'nominal' ? 'Total Volume' : 'Total Nominal'}
              </span>
              <span className="font-semibold text-ink-700 text-xs">
                {viewType === 'nominal' ? formatVolumeFull(totalSummary.volume) : formatRupiahShort(totalSummary.nominal)}
              </span>
              {viewType !== 'nominal' && (
                <span className="text-[10px] text-ink-500 font-mono block">
                  {formatRupiahFull(totalSummary.nominal)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: 6 Detailed Category Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chartData.map((cat, idx) => {
            const isHovered = activeIndex === idx
            const isCategoryActive = categoryFilter === cat.key
            return (
              <div
                key={cat.key}
                onClick={() => setCategoryFilter(categoryFilter === cat.key ? 'ALL' : cat.key)}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isCategoryActive
                    ? `${cat.meta.bgLight} ${cat.meta.borderLight} shadow-md ring-2 ring-offset-1 ring-blue-500/40 scale-[1.02]`
                    : isHovered
                    ? `${cat.meta.bgLight} ${cat.meta.borderLight} shadow-sm scale-[1.01]`
                    : 'bg-white border-surface-border hover:border-slate-300 shadow-sm'
                }`}
                title="Klik untuk memfilter khusus kategori ini"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.meta.dotColor} shrink-0`} />
                      <div className="truncate">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-ink-900 truncate block">
                            {cat.meta.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        isHovered || isCategoryActive ? 'bg-white shadow-xs' : cat.meta.bgLight
                      } ${cat.meta.textMain}`}
                    >
                      {cat.percentage}%
                    </span>
                  </div>

                  <span className="text-[10px] text-ink-400 font-medium block truncate mb-2">
                    {cat.meta.criteria}
                  </span>
                </div>

                {/* Values & Progress */}
                <div>
                  <div className="space-y-0.5 pt-2 border-t border-slate-100/80">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-ink-500 font-medium">Nominal:</span>
                      <span className="text-xs font-bold text-ink-900">
                        {formatRupiahShort(cat.nominal)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-ink-500 font-medium">Volume:</span>
                      <span className="text-[11px] font-bold text-ink-800">
                        {formatVolumeFull(cat.volume)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION: Diagram Batang Series Komparasi Antar Wilayah */}
      <div className="p-4 sm:p-6 border-t border-surface-border space-y-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-brand shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-ink-900 tracking-tight">
                {isRange
                  ? categoryFilter === 'ALL'
                    ? `Diagram Batang: Komposisi 6 Skala per Tahun (${startYear} - ${endYear})`
                    : `Diagram Batang: Khusus ${CATEGORY_META[categoryFilter]?.label} (${categoryFilter}) per Tahun (${startYear} - ${endYear})`
                  : categoryFilter === 'ALL'
                    ? 'Diagram Batang Series: Perbandingan Antar Wilayah'
                    : `Diagram Batang: Khusus ${CATEGORY_META[categoryFilter]?.label} (${categoryFilter})`}
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              {isRange
                ? categoryFilter === 'ALL'
                  ? barChartMode === 'stacked'
                    ? `Komparasi komposisi 6 skala usaha di tiap tahun (${startYear} s.d. ${endYear}) per kabupaten se-Banyumas Raya`
                    : `Perkembangan total ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} tiap tahun (${startYear} s.d. ${endYear}) di 4 kabupaten se-Banyumas Raya`
                  : `Perkembangan ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} khusus kategori ${CATEGORY_META[categoryFilter]?.label} per tahun (${startYear} s.d. ${endYear}) di 4 kabupaten`
                : categoryFilter === 'ALL'
                  ? `Komparasi langsung nilai ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} seluruh skala usaha di 4 kabupaten · ${periodLabel}`
                  : `Fokus perbandingan nilai ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} khusus kategori ${CATEGORY_META[categoryFilter]?.label} di 4 kabupaten · ${periodLabel}`}
            </p>
          </div>

          {/* Controls: Year selector, Month selector / badge, and Bar Mode */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Year Range Selector: Dari [Tahun] s.d. [Tahun] */}
            <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1 rounded-xl border border-surface-border shadow-xs whitespace-nowrap">
              <span className="text-[11px] font-semibold text-ink-600">Rentang:</span>
              <select
                value={startYear}
                onChange={(e) => handleYearRangeChange(e.target.value, endYear)}
                className="py-1 px-2 bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 focus:outline-none shadow-xs cursor-pointer"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <span className="text-xs font-medium text-ink-400">s.d.</span>
              <select
                value={endYear}
                onChange={(e) => handleYearRangeChange(startYear, e.target.value)}
                className="py-1 px-2 bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 focus:outline-none shadow-xs cursor-pointer"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Month Selector / Badge */}
            {!isRange && startYear === '2026' ? (
              <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1 rounded-xl border border-surface-border shadow-xs">
                <Calendar size={13} className="text-brand shrink-0" />
                <span className="text-[11px] font-semibold text-ink-600">Bulan:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 py-1 px-2.5 focus:outline-none cursor-pointer shadow-xs"
                >
                  {MONTH_LIST.map((m) => (
                    <option key={m.id} value={m.id} disabled={!!m.disabled}>
                      {m.disabled ? `${m.name} (Belum tersedia)` : m.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                <Calendar size={13} className="text-slate-500 shrink-0" />
                <span>{isRange ? `Akumulasi ${startYear} - ${endYear}` : `Akhir Tahun ${startYear}`}</span>
                <span className="text-[10px] text-slate-500 font-normal">(Riwayat)</span>
              </div>
            )}

            {/* Skala Usaha Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1 rounded-xl border border-surface-border shadow-xs">
              <Layers size={13} className="text-brand shrink-0" />
              <span className="text-[11px] font-semibold text-ink-600">Skala:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-surface-border rounded-lg text-xs font-semibold text-ink-900 py-1 px-2 focus:outline-none cursor-pointer shadow-xs max-w-[170px]"
              >
                {CATEGORY_FILTER_OPTIONS.map((catOpt) => (
                  <option key={catOpt.id} value={catOpt.id}>
                    {catOpt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bar Chart Mode Switcher */}
            {categoryFilter === 'ALL' && (
              <div className="inline-flex p-1 bg-surface-muted rounded-xl border border-surface-border shadow-xs">
                <button
                  type="button"
                  onClick={() => setBarChartMode('stacked')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    barChartMode === 'stacked'
                      ? 'bg-ink-900 text-white shadow-sm'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {isRange ? 'Komposisi Skala' : 'Bertumpuk'}
                </button>
                <button
                  type="button"
                  onClick={() => setBarChartMode('grouped')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    barChartMode === 'grouped'
                      ? 'bg-ink-900 text-white shadow-sm'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {isRange ? 'Total Tahunan' : 'Berdampingan'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recharts Multi-Series / Focused Bar Chart */}
        <div className="bg-slate-50/50 p-3 sm:p-5 rounded-xl border border-surface-border shadow-xs">
          <div className="w-full h-[320px] sm:h-[370px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 16, right: 20, left: 10, bottom: 28 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                  dy={8}
                  height={36}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(v) => (viewType === 'nominal' ? formatRupiahShort(v) : formatVolumeShort(v))}
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={85}
                  dx={-4}
                />
                <Tooltip content={<CustomBarSeriesTooltip viewType={viewType} periodLabel={periodLabel} isRange={isRange} categoryFilter={categoryFilter} yearsInRange={yearsInRange} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '14px', fontSize: '11px', fontWeight: 600 }}
                  formatter={(value) => {
                    if (isRange && categoryFilter !== 'ALL') {
                      return <span className="text-slate-700 font-semibold">{value.startsWith('Tahun') ? value : `Tahun ${value}`}</span>
                    }
                    if (isRange && categoryFilter === 'ALL' && barChartMode === 'grouped') {
                      return <span className="text-slate-700 font-semibold">{value.startsWith('Tahun') ? value : `Tahun ${value}`}</span>
                    }
                    const meta = CATEGORY_META[value]
                    return <span className="text-slate-700 font-semibold">{meta?.label || value}</span>
                  }}
                />

                {isRange ? (
                  categoryFilter === 'ALL' ? (
                    barChartMode === 'grouped' ? (
                      // Solid Bar Total per Year in Range
                      yearsInRange.map((yr, idx) => (
                        <Bar
                          key={yr}
                          dataKey={yr}
                          name={`Tahun ${yr}`}
                          fill={getYearColor(idx, yearsInRange.length, 'ALL')}
                          radius={[4, 4, 0, 0]}
                          maxBarSize={Math.max(12, Math.min(36, Math.floor(160 / yearsInRange.length)))}
                        />
                      ))
                    ) : (
                      // Stacked 6 Scales per Year (UMI, UKE, UME, UBE, BLU/PSO, Lainnya)
                      yearsInRange.map((yr, yrIdx) => (
                        <React.Fragment key={yr}>
                          {categories.map((cat, catIdx) => (
                            <Bar
                              key={`${yr}_${cat}`}
                              dataKey={`${yr}_${cat}`}
                              name={CATEGORY_META[cat]?.label || cat}
                              stackId={yr}
                              fill={CATEGORY_META[cat]?.color}
                              legendType={yrIdx === 0 ? 'circle' : 'none'}
                              radius={catIdx === categories.length - 1 ? [4, 4, 0, 0] : undefined}
                              maxBarSize={Math.max(14, Math.min(40, Math.floor(160 / yearsInRange.length)))}
                            />
                          ))}
                        </React.Fragment>
                      ))
                    )
                  ) : (
                    // Single Category Focus per Year
                    yearsInRange.map((yr, idx) => (
                      <Bar
                        key={yr}
                        dataKey={yr}
                        name={`Tahun ${yr}`}
                        fill={getYearColor(idx, yearsInRange.length, categoryFilter)}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={Math.max(12, Math.min(36, Math.floor(160 / yearsInRange.length)))}
                      />
                    ))
                  )
                ) : categoryFilter === 'ALL' ? (
                  // SINGLE YEAR - ALL CATEGORIES
                  categories.map((cat, catIdx) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      name={CATEGORY_META[cat]?.label || cat}
                      fill={CATEGORY_META[cat]?.color}
                      stackId={barChartMode === 'stacked' ? 'seriesStack' : undefined}
                      radius={
                        barChartMode === 'stacked'
                          ? catIdx === categories.length - 1
                            ? [4, 4, 0, 0]
                            : undefined
                          : [4, 4, 0, 0]
                      }
                      maxBarSize={barChartMode === 'stacked' ? 56 : 24}
                    />
                  ))
                ) : (
                  // SINGLE YEAR - SPECIFIC CATEGORY
                  <Bar
                    dataKey={categoryFilter}
                    name={`${CATEGORY_META[categoryFilter]?.label} (${categoryFilter})`}
                    fill={CATEGORY_META[categoryFilter]?.color}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={56}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Comparison Cards below Bar Chart */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-200/80">
            {isRange ? (() => {
              const startYr = yearsInRange[0]
              const endYr = yearsInRange[yearsInRange.length - 1]

              let totalStartYr = 0
              let totalEndYr = 0
              let totalAllRange = 0

              const kabGrowths = fourKab.map((kab) => {
                const row = barChartData.find((k) => k.kab === kab) || {}
                const startVal = row[startYr] || 0
                const endVal = row[endYr] || 0
                const totalVal = row.total || 0
                totalStartYr += startVal
                totalEndYr += endVal
                totalAllRange += totalVal
                const growth = startVal > 0 ? ((endVal - startVal) / startVal) * 100 : 0
                return { kab, startVal, endVal, totalVal, growth }
              })

              kabGrowths.sort((a, b) => b.growth - a.growth)
              const topGrowthKab = kabGrowths[0]
              const banyumasRow = kabGrowths.find((k) => k.kab === 'Banyumas') || kabGrowths[0]
              const totalGrowth = totalStartYr > 0 ? ((totalEndYr - totalStartYr) / totalStartYr) * 100 : 0
              const catLabel = categoryFilter === 'ALL' ? 'Semua Skala' : CATEGORY_META[categoryFilter]?.label || categoryFilter

              return (
                <>
                  <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-200 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-700 block">
                      Akumulasi {startYr}-{endYr} ({catLabel})
                    </span>
                    <span className="font-bold text-slate-900 block mt-0.5">Banyumas Raya</span>
                    <span className="text-[11px] text-blue-800 font-bold block">
                      {viewType === 'nominal' ? formatRupiahShort(totalAllRange) : formatVolumeFull(totalAllRange)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{yearsInRange.length} Tahun Riwayat</span>
                  </div>

                  <div className="bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-emerald-700 block">
                      Pertumbuhan {startYr} → {endYr}
                    </span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {totalGrowth >= 0 ? `+${totalGrowth.toFixed(1)}%` : `${totalGrowth.toFixed(1)}%`}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(totalStartYr) : formatVolumeFull(totalStartYr)} →{' '}
                      {viewType === 'nominal' ? formatRupiahShort(totalEndYr) : formatVolumeFull(totalEndYr)}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                      Kab. Banyumas ({endYr})
                    </span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasRow.endVal) : formatVolumeFull(banyumasRow.endVal)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      +{banyumasRow.growth.toFixed(1)}% sejak {startYr}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                      Pertumbuhan Tertinggi
                    </span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      Kab. {topGrowthKab.kab}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      +{topGrowthKab.growth.toFixed(1)}% ({startYr} - {endYr})
                    </span>
                  </div>
                </>
              )
            })() : categoryFilter === 'UMI' ? (() => {
              const totalUmi = barChartData.reduce((s, k) => s + (k.UMI || 0), 0)
              const banyumasVal = barChartData.find(k => k.kab === 'Banyumas')?.UMI || 0
              const cilacapVal = barChartData.find(k => k.kab === 'Cilacap')?.UMI || 0
              const purbalinggaVal = barChartData.find(k => k.kab === 'Purbalingga')?.UMI || 0
              const banjarnegaraVal = barChartData.find(k => k.kab === 'Banjarnegara')?.UMI || 0
              const banyumasPct = totalUmi > 0 ? ((banyumasVal / totalUmi) * 100).toFixed(1) : 0
              const cilacapPct = totalUmi > 0 ? ((cilacapVal / totalUmi) * 100).toFixed(1) : 0
              const purbalinggaPct = totalUmi > 0 ? ((purbalinggaVal / totalUmi) * 100).toFixed(1) : 0
              const banjarnegaraPct = totalUmi > 0 ? ((banjarnegaraVal / totalUmi) * 100).toFixed(1) : 0

              return (
                <>
                  <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-200 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-700 block">Total Khusus Mikro (UMI)</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Banyumas Raya (4 Kab)</span>
                    <span className="text-[11px] text-blue-800 font-bold block">
                      {viewType === 'nominal' ? formatRupiahShort(totalUmi) : formatVolumeFull(totalUmi)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Periode {periodLabel}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-600 block">Kab. Banjarnegara (Mikro)</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal' ? formatRupiahShort(banjarnegaraVal) : formatVolumeFull(banjarnegaraVal)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{banjarnegaraPct}% porsi UMI</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-600 block">Kab. Banyumas (Mikro)</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasVal) : formatVolumeFull(banyumasVal)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{banyumasPct}% porsi UMI (Terbesar)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-600 block">Cilacap & Purbalingga</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal'
                        ? `${formatRupiahShort(cilacapVal)} & ${formatRupiahShort(purbalinggaVal)}`
                        : `${formatVolumeFull(cilacapVal)} & ${formatVolumeFull(purbalinggaVal)}`}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{cilacapPct}% & {purbalinggaPct}% porsi UMI</span>
                  </div>
                </>
              )
            })() : categoryFilter !== 'ALL' ? (() => {
              const totalCat = barChartData.reduce((s, k) => s + (k[categoryFilter] || 0), 0)
              const sortedKabs = [...fourKab].map(kab => {
                const val = barChartData.find(k => k.kab === kab)?.[categoryFilter] || 0
                const pct = totalCat > 0 ? ((val / totalCat) * 100).toFixed(1) : 0
                return { kab, val, pct }
              }).sort((a, b) => b.val - a.val)

              return (
                <>
                  <div className="p-2.5 rounded-lg border text-xs shadow-xs" style={{ backgroundColor: `${CATEGORY_META[categoryFilter]?.color}15`, borderColor: `${CATEGORY_META[categoryFilter]?.color}40` }}>
                    <span className="text-[10px] font-semibold uppercase block" style={{ color: CATEGORY_META[categoryFilter]?.color }}>Total {CATEGORY_META[categoryFilter]?.label}</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Banyumas Raya (4 Kab)</span>
                    <span className="text-[11px] font-bold block" style={{ color: CATEGORY_META[categoryFilter]?.color }}>
                      {viewType === 'nominal' ? formatRupiahShort(totalCat) : formatVolumeFull(totalCat)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Periode {periodLabel}</span>
                  </div>
                  {sortedKabs.slice(0, 3).map((item) => (
                    <div key={item.kab} className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                      <span className="text-[10px] font-semibold uppercase text-slate-500 block">Kab. {item.kab}</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {viewType === 'nominal' ? formatRupiahShort(item.val) : formatVolumeFull(item.val)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{item.pct}% porsi {categoryFilter}</span>
                    </div>
                  ))}
                </>
              )
            })() : (() => {
              const banyumasUMI = barChartData.find(k => k.kab === 'Banyumas')?.UMI || 0
              const banyumasUKE = barChartData.find(k => k.kab === 'Banyumas')?.UKE || 0
              const banyumasUME = barChartData.find(k => k.kab === 'Banyumas')?.UME || 0
              const purbalinggaUBE = barChartData.find(k => k.kab === 'Purbalingga')?.UBE || 0
              return (
                <>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-600 block">UMI Terbesar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasUMI) : formatVolumeFull(banyumasUMI)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-emerald-600 block">UKE Terbesar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasUKE) : formatVolumeFull(banyumasUKE)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-amber-600 block">UME Terbesar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasUME) : formatVolumeFull(banyumasUME)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-purple-600 block">UBE Terbesar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Kab. Purbalingga</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(purbalinggaUBE) : formatVolumeFull(purbalinggaUBE)}
                    </span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {/* SECTION: Head-to-Head Comparison (Tampil otomatis saat memilih 2 Kabupaten) */}
      {activeKabList.length === 2 && (() => {
        const kabA = activeKabList[0]
        const kabB = activeKabList[1]
        const compA = kabComparison.find((k) => k.kab === kabA) || {}
        const compB = kabComparison.find((k) => k.kab === kabB) || {}

        const nomA = compA.totalNominal || 0
        const nomB = compB.totalNominal || 0
        const volA = compA.totalVolume || 0
        const volB = compB.totalVolume || 0

        const diffNom = Math.abs(nomA - nomB)
        const diffVol = Math.abs(volA - volB)
        const higherNomKab = nomA >= nomB ? kabA : kabB
        const higherVolKab = volA >= volB ? kabA : kabB

        return (
          <div className="p-4 sm:p-6 border-t border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-xs">
                  Mode Komparasi 2 Wilayah
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Perbandingan Langsung: Kab. {kabA} VS Kab. {kabB}
                </h3>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-white/80 px-2.5 py-1 rounded-lg border border-blue-200">
                Periode: {periodLabel}
              </span>
            </div>

            {/* Quick Metrics Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Kab A Card */}
              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Kab. {kabA}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{compA.merchants?.toLocaleString('id-ID')} merchant</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Nominal:</span>
                  <span className="text-base font-extrabold text-slate-900 block">{formatRupiahShort(nomA)}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">{formatRupiahFull(nomA)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Volume:</span>
                  <span className="font-bold text-slate-800">{formatVolumeFull(volA)}</span>
                </div>
              </div>

              {/* Difference / Selisih Card */}
              <div className="bg-white/95 p-4 rounded-xl border border-indigo-200 shadow-sm flex flex-col justify-between space-y-2 text-center">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Selisih Perbandingan (Gap)
                </span>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Selisih Nominal:
                  </span>
                  <span className="text-lg font-black text-indigo-950 block">
                    {formatRupiahShort(diffNom)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    ({formatRupiahFull(diffNom)})
                  </span>
                  <div className="mt-1">
                    <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-200">
                      Kab. {higherNomKab} lebih unggul +{nomA > 0 && nomB > 0 ? (Math.abs(nomA - nomB) / Math.min(nomA, nomB) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                  Selisih Volume: <strong className="text-slate-900">{formatVolumeFull(diffVol)}</strong>
                </div>
              </div>

              {/* Kab B Card */}
              <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Kab. {kabB}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{compB.merchants?.toLocaleString('id-ID')} merchant</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Nominal:</span>
                  <span className="text-base font-extrabold text-slate-900 block">{formatRupiahShort(nomB)}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">{formatRupiahFull(nomB)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Volume:</span>
                  <span className="font-bold text-slate-800">{formatVolumeFull(volB)}</span>
                </div>
              </div>
            </div>

            {/* Per-Category Comparison Grid */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">
                Perbandingan Nominal & Proporsi per 6 Skala Usaha:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {categories.map((catKey) => {
                  const meta = CATEGORY_META[catKey] || {}
                  const valA = getCatData(kabA, selectedYear, selectedMonth, catKey)
                  const valB = getCatData(kabB, selectedYear, selectedMonth, catKey)
                  const numA = viewType === 'nominal' ? valA.nominal : valA.volume
                  const numB = viewType === 'nominal' ? valB.nominal : valB.volume
                  const shareA = compA.shares?.[catKey] || 0
                  const shareB = compB.shares?.[catKey] || 0

                  return (
                    <div key={catKey} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${meta.dotColor || 'bg-blue-600'}`} />
                          {meta.label} ({catKey})
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Kab. {kabA}:</span>
                          <span className="font-bold text-blue-700">
                            {viewType === 'nominal' ? formatRupiahShort(numA) : formatVolumeFull(numA)} ({shareA.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Kab. {kabB}:</span>
                          <span className="font-bold text-purple-700">
                            {viewType === 'nominal' ? formatRupiahShort(numB) : formatVolumeFull(numB)} ({shareB.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* SECTION: Grafik Tren Skala Usaha */}
      <div className="p-4 sm:p-6 border-t border-surface-border space-y-4 bg-slate-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-brand shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-ink-900 tracking-tight">
                {effectiveSplitBy === 'wilayah'
                  ? trendCategoryFilter === 'ALL'
                    ? `Tren Perbandingan Total Transaksi Antar-Wilayah (${activeKabList.length} Kabupaten)`
                    : `Tren Perbandingan: Khusus ${CATEGORY_META[trendCategoryFilter]?.label} (${trendCategoryFilter})`
                  : trendCategoryFilter === 'ALL'
                  ? 'Tren Perkembangan Skala Usaha'
                  : `Tren Perkembangan: Khusus ${CATEGORY_META[trendCategoryFilter]?.label} (${trendCategoryFilter})`}
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              {effectiveSplitBy === 'wilayah'
                ? trendCategoryFilter === 'ALL'
                  ? `Grafik tren membandingkan total transaksi antar ${activeKabList.length} wilayah (${activeKabList.map(k => `Kab. ${k}`).join(', ')}) rentang ${trendStartYear} s.d. ${trendEndYear}`
                  : `Fokus grafik membandingkan ${activeKabList.length} wilayah (${activeKabList.map(k => `Kab. ${k}`).join(', ')}) khusus kategori ${CATEGORY_META[trendCategoryFilter]?.label} (${CATEGORY_META[trendCategoryFilter]?.criteria}) · Rentang ${trendStartYear} s.d. ${trendEndYear}`
                : trendCategoryFilter === 'ALL'
                ? `Grafik tren rentang ${trendStartYear} s.d. ${trendEndYear}${trendEndYear === '2026' ? ' dilanjutkan data bulanan 2026' : ''} (${wilayahLabel})`
                : `Fokus grafik perkembangan rentang ${trendStartYear} s.d. ${trendEndYear} khusus kategori ${CATEGORY_META[trendCategoryFilter]?.label} (${CATEGORY_META[trendCategoryFilter]?.criteria}) · ${wilayahLabel}`}
            </p>
          </div>

          {/* Trend Controls: Mode Toggle, Skala Dropdown & Year Range Selector */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Mode Split Toggle: Muncul jika ada 2 atau lebih kabupaten aktif */}
            {activeKabList.length > 1 && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-surface-border shadow-xs text-xs">
                <button
                  type="button"
                  onClick={() => setTrendSplitMode('wilayah')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    effectiveSplitBy === 'wilayah'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`Tampilkan garis grafik perbandingan untuk ${activeKabList.length} wilayah yang dipilih`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Bandingkan Wilayah ({activeKabList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTrendSplitMode('skala')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    effectiveSplitBy === 'skala'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Tampilkan grafik berdasarkan skala usaha gabungan"
                >
                  Skala Usaha
                </button>
              </div>
            )}

            {/* Skala Usaha Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-surface-border shadow-xs">
              <Layers size={13} className="text-brand shrink-0" />
              <span className="text-[11px] font-semibold text-ink-600">Skala:</span>
              <select
                value={trendCategoryFilter}
                onChange={(e) => setTrendCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-surface-border rounded-lg text-xs font-semibold text-ink-900 py-1 px-2.5 focus:outline-none cursor-pointer shadow-xs max-w-[170px]"
              >
                {CATEGORY_FILTER_OPTIONS.map((catOpt) => (
                  <option key={catOpt.id} value={catOpt.id}>
                    {catOpt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Range Selector: Dari [Tahun] s.d. [Tahun] */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-surface-border shadow-xs whitespace-nowrap">
              <span className="text-[11px] font-semibold text-ink-600">Rentang:</span>
              <select
                value={trendStartYear}
                onChange={(e) => handleTrendRangeChange(e.target.value, trendEndYear)}
                className="py-1 px-2 bg-slate-50 border border-surface-border rounded-lg text-xs font-semibold text-ink-900 focus:outline-none shadow-xs cursor-pointer"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <span className="text-xs font-medium text-ink-400">s.d.</span>
              <select
                value={trendEndYear}
                onChange={(e) => handleTrendRangeChange(trendStartYear, e.target.value)}
                className="py-1 px-2 bg-slate-50 border border-surface-border rounded-lg text-xs font-semibold text-ink-900 focus:outline-none shadow-xs cursor-pointer"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Trend Area Chart */}
        <div className="bg-white p-3 sm:p-5 rounded-xl border border-surface-border shadow-xs">
          <div className="w-full h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 12, right: 20, left: 10, bottom: 12 }}>
                <defs>
                  {/* Category Gradients */}
                  {categories.map((cat) => (
                    <linearGradient key={cat} id={getGradientId(cat)} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CATEGORY_META[cat]?.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={CATEGORY_META[cat]?.color} stopOpacity={0.0} />
                    </linearGradient>
                  ))}
                  {/* Kabupaten Gradients for Per-Wilayah Comparison */}
                  {fourKab.map((kab) => (
                    <linearGradient key={kab} id={getKabGradientId(kab)} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={KABUPATEN_META[kab]?.color || '#2563EB'} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={KABUPATEN_META[kab]?.color || '#2563EB'} stopOpacity={0.0} />
                    </linearGradient>
                  ))}
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
                <Tooltip
                  content={
                    <CustomTrendTooltip
                      viewType={viewType}
                      trendSplitBy={effectiveSplitBy}
                      trendCategoryFilter={trendCategoryFilter}
                    />
                  }
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                  formatter={(value) => {
                    if (KABUPATEN_META[value]) {
                      return <span className="text-slate-700 font-semibold">{KABUPATEN_META[value].name}</span>
                    }
                    const meta = CATEGORY_META[value]
                    return <span className="text-slate-700 font-semibold">{meta?.label || value}</span>
                  }}
                />

                {effectiveSplitBy === 'wilayah' ? (
                  // Multi-Line per Kabupaten: Tampilkan 1 garis per masing-masing wilayah terpilih!
                  activeKabList.map((kab) => (
                    <Area
                      key={kab}
                      type="monotone"
                      dataKey={kab}
                      name={KABUPATEN_META[kab]?.name || `Kab. ${kab}`}
                      stroke={KABUPATEN_META[kab]?.color || '#2563EB'}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill={`url(#${getKabGradientId(kab)})`}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
                    />
                  ))
                ) : trendCategoryFilter === 'ALL' ? (
                  categories.map((cat) => (
                    <Area
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      name={`${CATEGORY_META[cat]?.label} (${cat})`}
                      stroke={CATEGORY_META[cat]?.color}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill={`url(#${getGradientId(cat)})`}
                    />
                  ))
                ) : (
                  <Area
                    type="monotone"
                    dataKey={trendCategoryFilter}
                    name={`${CATEGORY_META[trendCategoryFilter]?.label} (${trendCategoryFilter})`}
                    stroke={CATEGORY_META[trendCategoryFilter]?.color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#${getGradientId(trendCategoryFilter)})`}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: 4 Kabupaten Mini-Comparison Overview */}
      <div className="p-4 sm:p-6 bg-surface-muted/30 border-t border-surface-border space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Perbandingan Komposisi di 4 Wilayah Kabupaten ({periodLabel})
            </span>
            {!isAllWilayah && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {activeKabList.length} Wilayah Dipilih
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isAllWilayah && (
              <button
                type="button"
                onClick={() => setSelectedWilayah(['ALL'])}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors px-2 py-0.5 bg-white rounded-lg border border-blue-200 shadow-xs"
              >
                ✕ Reset ke Semua Wilayah
              </button>
            )}
            <span className="text-[11px] text-ink-400 font-medium hidden sm:inline">
              Klik kartu untuk memilih/membandingkan wilayah (bisa pilih 1, 2, atau 3)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kabComparison.map((item) => {
            const isSelected = !isAllWilayah && selectedWilayah.includes(item.kab)
            return (
              <div
                key={item.kab}
                onClick={() => toggleWilayah(item.kab)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/40 scale-[1.01]'
                    : isAllWilayah
                    ? 'bg-white border-surface-border hover:border-slate-300 shadow-sm hover:scale-[1.005]'
                    : 'bg-white/80 border-dashed border-slate-300 opacity-75 hover:opacity-100 hover:border-blue-400 hover:scale-[1.005]'
                }`}
                title={isSelected ? 'Klik untuk membatalkan pilihan' : `Klik untuk menambahkan Kab. ${item.kab} ke perbandingan`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-ink-900">
                      Kab. {item.kab}
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[9px] rounded font-semibold uppercase flex items-center gap-0.5">
                        ✓ Aktif
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-ink-400 font-medium">
                    {item.merchants.toLocaleString('id-ID')} merchant
                  </span>
                </div>

                <div className="text-sm font-semibold text-ink-900 mb-0.5">
                  {viewType === 'nominal' ? formatRupiahShort(item.totalNominal) : formatVolumeFull(item.totalVolume)}
                </div>
                {viewType === 'nominal' && (
                  <div className="text-[10px] text-ink-400 font-mono mb-2 truncate">
                    {formatRupiahFull(item.totalNominal)}
                  </div>
                )}

                {/* Stacked Mini Bar across 6 categories */}
                <div
                  className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100"
                  title={categories.map((c) => `${c}: ${(item.shares[c] || 0).toFixed(1)}%`).join(' | ')}
                >
                  {categories.map((c) => (
                    <div
                      key={c}
                      style={{
                        width: `${item.shares[c] || 0}%`,
                        backgroundColor: CATEGORY_META[c]?.color
                      }}
                    />
                  ))}
                </div>

                {/* Mini Legend */}
                <div className="flex items-center justify-between text-[8.5px] text-ink-500 font-semibold mt-1.5">
                  <span style={{ color: CATEGORY_META.UMI.color }}>UMI {(item.shares.UMI || 0).toFixed(0)}%</span>
                  <span style={{ color: CATEGORY_META.UKE.color }}>UKE {(item.shares.UKE || 0).toFixed(0)}%</span>
                  <span style={{ color: CATEGORY_META.UME.color }}>UME {(item.shares.UME || 0).toFixed(0)}%</span>
                  <span style={{ color: CATEGORY_META.UBE.color }}>UBE {(item.shares.UBE || 0).toFixed(0)}%</span>
                  <span style={{ color: CATEGORY_META['BLU/PSO'].color }}>BLU {(item.shares['BLU/PSO'] || 0).toFixed(0)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

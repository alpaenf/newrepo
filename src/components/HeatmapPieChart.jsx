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
import { qrisRealData, qrisMonthlyByCategory } from '../data/qrisData.js'
import { YEAR_OPTIONS, parseYearRange } from '../data/heatmapData.js'

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

const YEAR_LIST = [
  { id: '2026', name: 'Tahun 2026', shortName: '2026' },
  { id: '2025', name: 'Tahun 2025', shortName: '2025' },
  { id: '2024', name: 'Tahun 2024', shortName: '2024' },
  { id: '2023', name: 'Tahun 2023', shortName: '2023' },
  { id: '2022', name: 'Tahun 2022', shortName: '2022' },
  { id: '2021', name: 'Tahun 2021', shortName: '2021' },
  { id: '2020', name: 'Tahun 2020', shortName: '2020' },
  { id: '2019', name: 'Tahun 2019', shortName: '2019' },
  { id: '2018', name: 'Tahun 2018', shortName: '2018' },
  { id: '2017', name: 'Tahun 2017', shortName: '2017' }
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
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[290px] space-y-2.5 z-[9999]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <span className="font-bold text-slate-900 text-sm block">{label}</span>
            <span className="text-[10px] text-slate-400 font-medium">{periodLabel} (4 Skala Usaha)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">
              Total {viewType === 'nominal' ? 'Nominal' : 'Volume'}
            </span>
            <span className="font-bold text-slate-900 text-xs text-blue-700">
              {viewType === 'nominal' ? formatRupiahShort(totalAllYears) : formatVolumeShort(totalAllYears)}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-0.5">
          {yearsInRange.map((yr) => {
            const yrTotal = Number(itemData[yr]) || 0
            const umiVal = Number(itemData[`${yr}_UMI`]) || 0
            const ukeVal = Number(itemData[`${yr}_UKE`]) || 0
            const umeVal = Number(itemData[`${yr}_UME`]) || 0
            const ubeVal = Number(itemData[`${yr}_UBE`]) || 0

            return (
              <div key={yr} className="bg-slate-50/90 p-2 rounded-lg border border-slate-100/90 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                    Tahun {yr}
                  </span>
                  <span className="text-slate-900 font-bold">
                    {viewType === 'nominal' ? formatRupiahShort(yrTotal) : formatVolumeShort(yrTotal)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-600 pl-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      UMI:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {viewType === 'nominal' ? formatRupiahShort(umiVal) : formatVolumeShort(umiVal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      UKE:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {viewType === 'nominal' ? formatRupiahShort(ukeVal) : formatVolumeShort(ukeVal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      UME:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {viewType === 'nominal' ? formatRupiahShort(umeVal) : formatVolumeShort(umeVal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                      UBE:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {viewType === 'nominal' ? formatRupiahShort(ubeVal) : formatVolumeShort(ubeVal)}
                    </span>
                  </div>
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
            {viewType === 'nominal' ? formatRupiahShort(total) : formatVolumeShort(total)}
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
                  {viewType === 'nominal' ? formatRupiahShort(val) : formatVolumeShort(val)}
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

export default function HeatmapPieChart({
  range = '2026',
  onRangeChange = null,
  month = '08',
  onMonthChange = null,
  selectedId = null,
  data = []
}) {
  const [selectedWilayah, setSelectedWilayah] = useState('ALL')
  const [selectedMonth, setSelectedMonth] = useState(month || '08') // Default: '08' (Agustus 2026 data riil)
  const [selectedYear, setSelectedYear] = useState(range || '2026')
  const [viewType, setViewType] = useState('nominal') // 'nominal' | 'volume'
  const [trendMode, setTrendMode] = useState('all') // 'all' (2024, 2025 akhir tahun + 2026 bulanan) | 'monthly2026' (khusus 2026 per bulan)
  const [barChartMode, setBarChartMode] = useState('grouped') // 'grouped' (berdampingan) | 'stacked' (bertumpuk)
  const [categoryFilter, setCategoryFilter] = useState('ALL') // 'ALL' | 'UMI' (Khusus Mikro) | 'UKE' | 'UME' | 'UBE'
  const [trendCategoryFilter, setTrendCategoryFilter] = useState('ALL') // 'ALL' | 'UMI' | 'UKE' | 'UME' | 'UBE'
  const [activeIndex, setActiveIndex] = useState(null)

  // Update selected year if toolbar range changes
  React.useEffect(() => {
    if (range && range !== selectedYear) {
      setSelectedYear(range)
      if (range !== '2026') {
        setSelectedMonth('ALL')
      }
    }
  }, [range])

  // Sync with external month prop
  React.useEffect(() => {
    if (month && month !== selectedMonth) {
      setSelectedMonth(month)
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
    setSelectedMonth(newM)
    if (onMonthChange) {
      onMonthChange(newM)
    }
  }

  const currentWilayah = selectedWilayah
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

  // Categories to include
  const categories = ['UMI', 'UKE', 'UME', 'UBE']
  const fourKab = ['Banyumas', 'Cilacap', 'Purbalingga', 'Banjarnegara']

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
        for (let m = 1; m <= 12; m++) {
          const mStr = String(m).padStart(2, '0')
          const mData = qrisMonthlyByCategory['2026']?.[mStr]?.[kab]?.[catKey]
          totalNom += mData?.nominal || 0
          totalVol += mData?.volume || 0
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

  // Multi-Series Bar Chart Data for comparing 4 Kabupaten side-by-side (Per Wilayah)
  const barChartData = useMemo(() => {
    return fourKab.map((kab) => {
      if (isRange) {
        const row = {
          kab,
          name: `Kab. ${kab}`,
          shortName: kab
        }
        let totalKab = 0
        yearsInRange.forEach((yr) => {
          const umi = getCatData(kab, yr, 'ALL', 'UMI')
          const uke = getCatData(kab, yr, 'ALL', 'UKE')
          const ume = getCatData(kab, yr, 'ALL', 'UME')
          const ube = getCatData(kab, yr, 'ALL', 'UBE')

          const umiVal = viewType === 'nominal' ? umi.nominal : umi.volume
          const ukeVal = viewType === 'nominal' ? uke.nominal : uke.volume
          const umeVal = viewType === 'nominal' ? ume.nominal : ume.volume
          const ubeVal = viewType === 'nominal' ? ube.nominal : ube.volume
          const yrTotal = umiVal + ukeVal + umeVal + ubeVal

          row[`${yr}_UMI`] = umiVal
          row[`${yr}_UKE`] = ukeVal
          row[`${yr}_UME`] = umeVal
          row[`${yr}_UBE`] = ubeVal

          if (categoryFilter === 'ALL') {
            row[yr] = yrTotal
            row[`nominal_${yr}`] = umi.nominal + uke.nominal + ume.nominal + ube.nominal
            row[`volume_${yr}`] = umi.volume + uke.volume + ume.volume + ube.volume
            totalKab += yrTotal
          } else {
            const catVal = row[`${yr}_${categoryFilter}`] || 0
            row[yr] = catVal
            const catRaw = categoryFilter === 'UMI' ? umi : categoryFilter === 'UKE' ? uke : categoryFilter === 'UME' ? ume : ube
            row[`nominal_${yr}`] = catRaw.nominal
            row[`volume_${yr}`] = catRaw.volume
            totalKab += catVal
          }
        })
        row.total = totalKab
        return row
      }

      // Single-Year Mode:
      const umi = getCatData(kab, selectedYear, selectedMonth, 'UMI')
      const uke = getCatData(kab, selectedYear, selectedMonth, 'UKE')
      const ume = getCatData(kab, selectedYear, selectedMonth, 'UME')
      const ube = getCatData(kab, selectedYear, selectedMonth, 'UBE')

      const umiVal = viewType === 'nominal' ? umi.nominal : umi.volume
      const ukeVal = viewType === 'nominal' ? uke.nominal : uke.volume
      const umeVal = viewType === 'nominal' ? ume.nominal : ume.volume
      const ubeVal = viewType === 'nominal' ? ube.nominal : ube.volume
      const total = umiVal + ukeVal + umeVal + ubeVal

      return {
        kab,
        name: `Kab. ${kab}`,
        shortName: kab,
        UMI: umiVal,
        UKE: ukeVal,
        UME: umeVal,
        UBE: ubeVal,
        total,
        nominalUMI: umi.nominal,
        nominalUKE: uke.nominal,
        nominalUME: ume.nominal,
        nominalUBE: ube.nominal,
        volumeUMI: umi.volume,
        volumeUKE: uke.volume,
        volumeUME: ume.volume,
        volumeUBE: ube.volume
      }
    })
  }, [selectedYear, selectedMonth, viewType, isRange, yearsInRange, categoryFilter])

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
      // 2024 Akhir Tahun
      const y2024 = { UMI: 0, UKE: 0, UME: 0, UBE: 0 }
      activeKabList.forEach((kab) => {
        categories.forEach((cat) => {
          const raw = getCatData(kab, '2024', 'ALL', cat)
          y2024[cat] += viewType === 'nominal' ? raw.nominal : raw.volume
        })
      })
      points.push({
        period: '2024 (Akhir Thn)',
        shortPeriod: "'24 Akhir",
        isAnnual: true,
        ...y2024,
        total: y2024.UMI + y2024.UKE + y2024.UME + y2024.UBE
      })

      // 2025 Akhir Tahun
      const y2025 = { UMI: 0, UKE: 0, UME: 0, UBE: 0 }
      activeKabList.forEach((kab) => {
        categories.forEach((cat) => {
          const raw = getCatData(kab, '2025', 'ALL', cat)
          y2025[cat] += viewType === 'nominal' ? raw.nominal : raw.volume
        })
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

  // Comparison data for all 4 kabupaten (adjusted for month & year)
  const kabComparison = useMemo(() => {
    return fourKab.map((kab) => {
      const umi = getCatData(kab, selectedYear, selectedMonth, 'UMI')
      const uke = getCatData(kab, selectedYear, selectedMonth, 'UKE')
      const ume = getCatData(kab, selectedYear, selectedMonth, 'UME')
      const ube = getCatData(kab, selectedYear, selectedMonth, 'UBE')

      const totalKabNominal = umi.nominal + uke.nominal + ume.nominal + ube.nominal
      const totalKabVolume = umi.volume + uke.volume + ume.volume + ube.volume

      const getPct = (val, tot) => (tot > 0 ? (val / tot) * 100 : 0)

      const umiVal = viewType === 'nominal' ? umi.nominal : umi.volume
      const ukeVal = viewType === 'nominal' ? uke.nominal : uke.volume
      const umeVal = viewType === 'nominal' ? ume.nominal : ume.volume
      const ubeVal = viewType === 'nominal' ? ube.nominal : ube.volume
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
                    <option key={m.id} value={m.id}>
                      {m.name}
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

          {/* Quick Category Focus Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-0.5 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-ink-500 shrink-0 mr-1">Filter Kategori:</span>
            {[
              { id: 'ALL', label: 'Semua Skala (4 Kategori)' },
              { id: 'UMI', label: 'Khusus Mikro (UMI)', color: CATEGORY_META.UMI.color },
              { id: 'UKE', label: 'Khusus Kecil (UKE)', color: CATEGORY_META.UKE.color },
              { id: 'UME', label: 'Khusus Menengah (UME)', color: CATEGORY_META.UME.color },
              { id: 'UBE', label: 'Khusus Besar (UBE)', color: CATEGORY_META.UBE.color }
            ].map((catOpt) => {
              const isSelected = categoryFilter === catOpt.id
              return (
                <button
                  key={catOpt.id}
                  type="button"
                  onClick={() => setCategoryFilter(catOpt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {catOpt.color && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: catOpt.color }}
                    />
                  )}
                  <span>{catOpt.label}</span>
                </button>
              )
            })}
          </div>
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
                  {chartData.map((entry, index) => {
                    const isFocus = categoryFilter === 'ALL' || categoryFilter === entry.key
                    return (
                      <Cell
                        key={`cell-${entry.key}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={activeIndex === index || categoryFilter === entry.key ? 3 : 2}
                        opacity={isFocus ? (activeIndex === null || activeIndex === index ? 1 : 0.8) : 0.25}
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
            const isCategoryActive = categoryFilter === cat.key
            return (
              <div
                key={cat.key}
                onClick={() => setCategoryFilter(categoryFilter === cat.key ? 'ALL' : cat.key)}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isCategoryActive
                    ? `${cat.meta.bgLight} ${cat.meta.borderLight} shadow-md ring-2 ring-offset-1 ring-blue-500/40 scale-[1.02]`
                    : isHovered
                    ? `${cat.meta.bgLight} ${cat.meta.borderLight} shadow-sm scale-[1.01]`
                    : 'bg-white border-surface-border hover:border-slate-300 shadow-sm'
                }`}
                title="Klik untuk memfilter khusus kategori ini"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cat.meta.dotColor} shrink-0`} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-ink-900 block leading-tight">
                          {cat.meta.label}
                        </span>
                        {isCategoryActive && (
                          <span className="px-1.5 py-0.2 bg-slate-900 text-white text-[9px] rounded font-semibold uppercase">
                            Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-400 font-medium block">
                        {cat.meta.criteria}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                      isHovered || isCategoryActive ? 'bg-white shadow-sm' : cat.meta.bgLight
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

      {/* SECTION: Diagram Batang Series Komparasi Antar Wilayah */}
      <div className="p-4 sm:p-6 border-t border-surface-border space-y-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-brand shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-ink-900 tracking-tight">
                {isRange
                  ? categoryFilter === 'ALL'
                    ? `Diagram Batang: Komposisi 4 Skala per Tahun (${startYear} - ${endYear})`
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
                    ? `Komparasi komposisi 4 skala usaha (UMI, UKE, UME, UBE) di tiap tahun (${startYear} s.d. ${endYear}) per kabupaten se-Banyumas Raya`
                    : `Perkembangan total ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} tiap tahun (${startYear} s.d. ${endYear}) di 4 kabupaten se-Banyumas Raya`
                  : `Perkembangan ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} khusus kategori ${CATEGORY_META[categoryFilter]?.label} per tahun (${startYear} s.d. ${endYear}) di 4 kabupaten`
                : categoryFilter === 'ALL'
                  ? `Komparasi langsung nilai ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} skala UMI, UKE, UME, dan UBE di 4 kabupaten · ${periodLabel}`
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
                    <option key={m.id} value={m.id}>
                      {m.name}
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
                  {isRange ? 'Komposisi 4 Skala' : 'Bertumpuk'}
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

        {/* Filter Skala Usaha (Semua Skala, Khusus Mikro, Khusus Kecil, Khusus Menengah, Khusus Besar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-ink-600 shrink-0 mr-1">Filter Skala:</span>
          {[
            { id: 'ALL', label: 'Semua Skala (4 Kategori)' },
            { id: 'UMI', label: 'Khusus Mikro (UMI)', color: CATEGORY_META.UMI.color },
            { id: 'UKE', label: 'Khusus Kecil (UKE)', color: CATEGORY_META.UKE.color },
            { id: 'UME', label: 'Khusus Menengah (UME)', color: CATEGORY_META.UME.color },
            { id: 'UBE', label: 'Khusus Besar (UBE)', color: CATEGORY_META.UBE.color }
          ].map((catOpt) => {
            const isSelected = categoryFilter === catOpt.id
            return (
              <button
                key={catOpt.id}
                type="button"
                onClick={() => setCategoryFilter(catOpt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-offset-1 ring-blue-500/30 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {catOpt.color && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: catOpt.color }}
                  />
                )}
                <span>{catOpt.label}</span>
              </button>
            )
          })}
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
                      // Stacked 4 Scales per Year (UMI, UKE, UME, UBE)
                      yearsInRange.map((yr, yrIdx) => (
                        <React.Fragment key={yr}>
                          <Bar
                            dataKey={`${yr}_UMI`}
                            name="Usaha Mikro (UMI)"
                            stackId={yr}
                            fill={CATEGORY_META.UMI.color}
                            legendType={yrIdx === 0 ? 'circle' : 'none'}
                            maxBarSize={Math.max(14, Math.min(40, Math.floor(160 / yearsInRange.length)))}
                          />
                          <Bar
                            dataKey={`${yr}_UKE`}
                            name="Usaha Kecil (UKE)"
                            stackId={yr}
                            fill={CATEGORY_META.UKE.color}
                            legendType={yrIdx === 0 ? 'circle' : 'none'}
                            maxBarSize={Math.max(14, Math.min(40, Math.floor(160 / yearsInRange.length)))}
                          />
                          <Bar
                            dataKey={`${yr}_UME`}
                            name="Usaha Menengah (UME)"
                            stackId={yr}
                            fill={CATEGORY_META.UME.color}
                            legendType={yrIdx === 0 ? 'circle' : 'none'}
                            maxBarSize={Math.max(14, Math.min(40, Math.floor(160 / yearsInRange.length)))}
                          />
                          <Bar
                            dataKey={`${yr}_UBE`}
                            name="Usaha Besar (UBE)"
                            stackId={yr}
                            fill={CATEGORY_META.UBE.color}
                            legendType={yrIdx === 0 ? 'circle' : 'none'}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={Math.max(14, Math.min(40, Math.floor(160 / yearsInRange.length)))}
                          />
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
                  <>
                    <Bar
                      dataKey="UMI"
                      name="Usaha Mikro (UMI)"
                      fill={CATEGORY_META.UMI.color}
                      stackId={barChartMode === 'stacked' ? 'seriesStack' : undefined}
                      radius={barChartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={barChartMode === 'stacked' ? 56 : 32}
                    />
                    <Bar
                      dataKey="UKE"
                      name="Usaha Kecil (UKE)"
                      fill={CATEGORY_META.UKE.color}
                      stackId={barChartMode === 'stacked' ? 'seriesStack' : undefined}
                      radius={barChartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={barChartMode === 'stacked' ? 56 : 32}
                    />
                    <Bar
                      dataKey="UME"
                      name="Usaha Menengah (UME)"
                      fill={CATEGORY_META.UME.color}
                      stackId={barChartMode === 'stacked' ? 'seriesStack' : undefined}
                      radius={barChartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={barChartMode === 'stacked' ? 56 : 32}
                    />
                    <Bar
                      dataKey="UBE"
                      name="Usaha Besar (UBE)"
                      fill={CATEGORY_META.UBE.color}
                      stackId={barChartMode === 'stacked' ? 'seriesStack' : undefined}
                      radius={barChartMode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={barChartMode === 'stacked' ? 56 : 32}
                    />
                  </>
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
                      {viewType === 'nominal' ? formatRupiahShort(totalAllRange) : formatVolumeShort(totalAllRange)}
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
                      {viewType === 'nominal' ? formatRupiahShort(totalStartYr) : formatVolumeShort(totalStartYr)} →{' '}
                      {viewType === 'nominal' ? formatRupiahShort(totalEndYr) : formatVolumeShort(totalEndYr)}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                      Kab. Banyumas ({endYr})
                    </span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasRow.endVal) : formatVolumeShort(banyumasRow.endVal)}
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
                      {viewType === 'nominal' ? formatRupiahShort(totalUmi) : formatVolumeShort(totalUmi)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Periode {periodLabel}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-600 block">Kab. Banyumas (Mikro)</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasVal) : formatVolumeShort(banyumasVal)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{banyumasPct}% porsi UMI (Terbesar)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-600 block">Kab. Cilacap (Mikro)</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal' ? formatRupiahShort(cilacapVal) : formatVolumeShort(cilacapVal)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{cilacapPct}% porsi UMI (Kedua)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-blue-600 block">Purbalingga & Banjarnegara</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {viewType === 'nominal'
                        ? `${formatRupiahShort(purbalinggaVal)} & ${formatRupiahShort(banjarnegaraVal)}`
                        : `${formatVolumeShort(purbalinggaVal)} & ${formatVolumeShort(banjarnegaraVal)}`}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{purbalinggaPct}% & {banjarnegaraPct}% porsi UMI</span>
                  </div>
                </>
              )
            })() : categoryFilter !== 'ALL' ? (() => {
              const totalCat = barChartData.reduce((s, k) => s + (k[categoryFilter] || 0), 0)
              return (
                <>
                  <div className="p-2.5 rounded-lg border text-xs shadow-xs" style={{ backgroundColor: `${CATEGORY_META[categoryFilter]?.color}15`, borderColor: `${CATEGORY_META[categoryFilter]?.color}40` }}>
                    <span className="text-[10px] font-semibold uppercase block" style={{ color: CATEGORY_META[categoryFilter]?.color }}>Total {CATEGORY_META[categoryFilter]?.label}</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Banyumas Raya (4 Kab)</span>
                    <span className="text-[11px] font-bold block" style={{ color: CATEGORY_META[categoryFilter]?.color }}>
                      {viewType === 'nominal' ? formatRupiahShort(totalCat) : formatVolumeShort(totalCat)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Periode {periodLabel}</span>
                  </div>
                  {['Banyumas', 'Cilacap', 'Purbalingga'].map((kab) => {
                    const val = barChartData.find(k => k.kab === kab)?.[categoryFilter] || 0
                    const pct = totalCat > 0 ? ((val / totalCat) * 100).toFixed(1) : 0
                    return (
                      <div key={kab} className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                        <span className="text-[10px] font-semibold uppercase text-slate-500 block">Kab. {kab}</span>
                        <span className="font-bold text-slate-900 block mt-0.5">
                          {viewType === 'nominal' ? formatRupiahShort(val) : formatVolumeShort(val)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">{pct}% porsi {categoryFilter}</span>
                      </div>
                    )
                  })}
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
                      {viewType === 'nominal' ? formatRupiahShort(banyumasUMI) : formatVolumeShort(banyumasUMI)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-emerald-600 block">UKE Terbesar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasUKE) : formatVolumeShort(banyumasUKE)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-amber-600 block">UME Terbesar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(banyumasUME) : formatVolumeShort(banyumasUME)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                    <span className="text-[10px] font-semibold uppercase text-purple-600 block">UBE Terbesar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Kab. Purbalingga</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {viewType === 'nominal' ? formatRupiahShort(purbalinggaUBE) : formatVolumeShort(purbalinggaUBE)}
                    </span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {/* SECTION: Grafik Tren Skala Usaha */}
      <div className="p-4 sm:p-6 border-t border-surface-border space-y-4 bg-slate-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-brand shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-ink-900 tracking-tight">
                {trendCategoryFilter === 'ALL'
                  ? 'Tren Perkembangan Skala Usaha'
                  : `Tren Perkembangan: Khusus ${CATEGORY_META[trendCategoryFilter]?.label} (${trendCategoryFilter})`}
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              {trendCategoryFilter === 'ALL'
                ? `Grafik historis akhir tahun (2024, 2025) dilanjutkan dengan rincian data per bulan di tahun 2026 (${currentWilayah === 'ALL' ? 'Banyumas Raya' : `Kab. ${currentWilayah}`})`
                : `Fokus grafik perkembangan bulanan khusus kategori ${CATEGORY_META[trendCategoryFilter]?.label} (${CATEGORY_META[trendCategoryFilter]?.criteria}) · ${currentWilayah === 'ALL' ? 'Banyumas Raya' : `Kab. ${currentWilayah}`}`}
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

        {/* Filter Skala Usaha untuk Grafik Tren */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-200/60">
          <span className="text-[11px] font-semibold text-ink-600 shrink-0 mr-1">Filter Skala:</span>
          {[
            { id: 'ALL', label: 'Semua Skala (4 Kategori)' },
            { id: 'UMI', label: 'Khusus Mikro (UMI)', color: CATEGORY_META.UMI.color },
            { id: 'UKE', label: 'Khusus Kecil (UKE)', color: CATEGORY_META.UKE.color },
            { id: 'UME', label: 'Khusus Menengah (UME)', color: CATEGORY_META.UME.color },
            { id: 'UBE', label: 'Khusus Besar (UBE)', color: CATEGORY_META.UBE.color }
          ].map((catOpt) => {
            const isSelected = trendCategoryFilter === catOpt.id
            return (
              <button
                key={catOpt.id}
                type="button"
                onClick={() => setTrendCategoryFilter(catOpt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-offset-1 ring-blue-500/30 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {catOpt.color && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: catOpt.color }}
                  />
                )}
                <span>{catOpt.label}</span>
              </button>
            )
          })}
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

                {trendCategoryFilter === 'ALL' ? (
                  <>
                    <Area
                      type="monotone"
                      dataKey="UMI"
                      name="Usaha Mikro (UMI)"
                      stroke={CATEGORY_META.UMI.color}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#gradUMI)"
                    />
                    <Area
                      type="monotone"
                      dataKey="UKE"
                      name="Usaha Kecil (UKE)"
                      stroke={CATEGORY_META.UKE.color}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#gradUKE)"
                    />
                    <Area
                      type="monotone"
                      dataKey="UME"
                      name="Usaha Menengah (UME)"
                      stroke={CATEGORY_META.UME.color}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#gradUME)"
                    />
                    <Area
                      type="monotone"
                      dataKey="UBE"
                      name="Usaha Besar (UBE)"
                      stroke={CATEGORY_META.UBE.color}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#gradUBE)"
                    />
                  </>
                ) : (
                  <Area
                    type="monotone"
                    dataKey={trendCategoryFilter}
                    name={`${CATEGORY_META[trendCategoryFilter]?.label} (${trendCategoryFilter})`}
                    stroke={CATEGORY_META[trendCategoryFilter]?.color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#grad${trendCategoryFilter})`}
                  />
                )}
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

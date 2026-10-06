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

function CustomBarSeriesTooltip({ active, payload, label, viewType, periodLabel }) {
  if (!active || !payload || !payload.length) return null

  const total = payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0)

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[270px] space-y-2 z-[9999]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <span className="font-bold text-slate-900 text-sm block">{label}</span>
          <span className="text-[10px] text-slate-400 font-medium">{periodLabel}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 block uppercase">Total {viewType === 'nominal' ? 'Nominal' : 'Volume'}</span>
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

          return (
            <div key={entry.dataKey} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="font-semibold text-slate-700">{meta.label || entry.name} ({entry.dataKey}):</span>
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

function CustomYearlyGrowthTooltip({ active, payload, label, viewType, categoryFilter }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]?.payload || {}
  const total = payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0)

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-slate-200 text-xs min-w-[270px] space-y-2 z-[9999]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <span className="font-bold text-slate-900 text-sm block">{item.label}</span>
          <span className="text-[10px] text-slate-400 font-medium">{item.status}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 block uppercase">Total {viewType === 'nominal' ? 'Nominal' : 'Volume'}</span>
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

          return (
            <div key={entry.dataKey} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="font-semibold text-slate-700">{meta.label || entry.name} ({entry.dataKey}):</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {viewType === 'nominal' ? formatRupiahShort(val) : formatVolumeShort(val)}
                </span>
                {categoryFilter === 'ALL' && (
                  <span className="text-[10px] font-semibold text-slate-500">({pct}%)</span>
                )}
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
  month = '08',
  onMonthChange = null,
  selectedId = null,
  data = []
}) {
  const [selectedWilayah, setSelectedWilayah] = useState('ALL')
  const [selectedMonth, setSelectedMonth] = useState(month || '08') // Default: '08' (Agustus 2026 data riil)
  const [selectedYear, setSelectedYear] = useState(range)
  const [viewType, setViewType] = useState('nominal') // 'nominal' | 'volume'
  const [trendMode, setTrendMode] = useState('all') // 'all' (2024, 2025 akhir tahun + 2026 bulanan) | 'monthly2026' (khusus 2026 per bulan)
  const [barChartMode, setBarChartMode] = useState('grouped') // 'grouped' (berdampingan) | 'stacked' (bertumpuk)
  const [categoryFilter, setCategoryFilter] = useState('ALL') // 'ALL' | 'UMI' (Khusus Mikro) | 'UKE' | 'UME' | 'UBE'
  const [trendCategoryFilter, setTrendCategoryFilter] = useState('ALL') // 'ALL' | 'UMI' | 'UKE' | 'UME' | 'UBE'
  const [yearlyCategoryFilter, setYearlyCategoryFilter] = useState('ALL') // 'ALL' | 'UMI' | 'UKE' | 'UME' | 'UBE'
  const [yearlyBarMode, setYearlyBarMode] = useState('grouped') // 'grouped' | 'stacked'
  const [activeIndex, setActiveIndex] = useState(null)

  // Update selected year if toolbar range changes
  React.useEffect(() => {
    if (range) setSelectedYear(range)
  }, [range])

  // Sync with external month prop
  React.useEffect(() => {
    if (month && month !== selectedMonth) {
      setSelectedMonth(month)
    }
  }, [month])

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
    if (selectedMonth === 'ALL') {
      return `Tahun ${selectedYear}`
    }
    return `Bulan ${currentMonthObj.name} ${selectedYear}`
  }, [selectedMonth, currentMonthObj, selectedYear])

  // Categories to include
  const categories = ['UMI', 'UKE', 'UME', 'UBE']
  const fourKab = ['Banyumas', 'Cilacap', 'Purbalingga', 'Banjarnegara']

  // Multi-Series Bar Chart Data for comparing 4 Kabupaten side-by-side (Per Wilayah)
  const barChartData = useMemo(() => {
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

      const umiVal = viewType === 'nominal' ? umiNominal : umiVolume
      const ukeVal = viewType === 'nominal' ? ukeNominal : ukeVolume
      const umeVal = viewType === 'nominal' ? umeNominal : umeVolume
      const ubeVal = viewType === 'nominal' ? ubeNominal : ubeVolume
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
        nominalUMI: umiNominal,
        nominalUKE: ukeNominal,
        nominalUME: umeNominal,
        nominalUBE: ubeNominal,
        volumeUMI: umiVolume,
        volumeUKE: ukeVolume,
        volumeUME: umeVolume,
        volumeUBE: ubeVolume
      }
    })
  }, [selectedYear, selectedMonth, viewType])

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

  // 3-Year Annual Growth Comparison Data (2024 vs 2025 vs 2026)
  const yearlyComparisonData = useMemo(() => {
    const activeKabList = currentWilayah === 'ALL' ? fourKab : [currentWilayah]
    const years = ['2024', '2025', '2026']

    return years.map((yr) => {
      let umiNominal = 0, umiVolume = 0
      let ukeNominal = 0, ukeVolume = 0
      let umeNominal = 0, umeVolume = 0
      let ubeNominal = 0, ubeVolume = 0

      activeKabList.forEach((kab) => {
        for (let m = 1; m <= 12; m++) {
          const mKey = String(m).padStart(2, '0')
          const mData = qrisMonthlyByCategory[yr]?.[mKey]?.[kab] || {}
          umiNominal += mData.UMI?.nominal || 0
          umiVolume += mData.UMI?.volume || 0
          ukeNominal += mData.UKE?.nominal || 0
          ukeVolume += mData.UKE?.volume || 0
          umeNominal += mData.UME?.nominal || 0
          umeVolume += mData.UME?.volume || 0
          ubeNominal += mData.UBE?.nominal || 0
          ubeVolume += mData.UBE?.volume || 0
        }
      })

      const umiVal = viewType === 'nominal' ? umiNominal : umiVolume
      const ukeVal = viewType === 'nominal' ? ukeNominal : ukeVolume
      const umeVal = viewType === 'nominal' ? umeNominal : umeVolume
      const ubeVal = viewType === 'nominal' ? ubeNominal : ubeVolume
      const total = umiVal + ukeVal + umeVal + ubeVal

      const status =
        yr === '2024'
          ? 'Tahun Dasar (Baseline)'
          : yr === '2025'
          ? 'Realisasi Penuh'
          : 'Realisasi 2026'

      return {
        year: yr,
        label: `Tahun ${yr}`,
        status,
        UMI: umiVal,
        UKE: ukeVal,
        UME: umeVal,
        UBE: ubeVal,
        total,
        nominalUMI: umiNominal,
        nominalUKE: ukeNominal,
        nominalUME: umeNominal,
        nominalUBE: ubeNominal,
        volumeUMI: umiVolume,
        volumeUKE: ukeVolume,
        volumeUME: umeVolume,
        volumeUBE: ubeVolume
      }
    })
  }, [currentWilayah, viewType])

  // YoY Growth calculations for the 3-Year Comparison Section
  const yearlyGrowthStats = useMemo(() => {
    if (!yearlyComparisonData || yearlyComparisonData.length < 3) {
      return { val2024: 0, val2025: 0, val2026: 0, growth25: 0, growth26: 0, totalGrowth: 0, diff25: 0, diff26: 0 }
    }

    const d24 = yearlyComparisonData[0]
    const d25 = yearlyComparisonData[1]
    const d26 = yearlyComparisonData[2]

    const getVal = (d) => {
      if (yearlyCategoryFilter === 'ALL') return d.total
      return d[yearlyCategoryFilter] || 0
    }

    const val2024 = getVal(d24)
    const val2025 = getVal(d25)
    const val2026 = getVal(d26)

    const growth25 = val2024 > 0 ? ((val2025 - val2024) / val2024) * 100 : 0
    const growth26 = val2025 > 0 ? ((val2026 - val2025) / val2025) * 100 : 0
    const totalGrowth = val2024 > 0 ? ((val2026 - val2024) / val2024) * 100 : 0

    const diff25 = val2025 - val2024
    const diff26 = val2026 - val2025

    return {
      val2024,
      val2025,
      val2026,
      growth25,
      growth26,
      totalGrowth,
      diff25,
      diff26
    }
  }, [yearlyComparisonData, yearlyCategoryFilter])

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
                {categoryFilter === 'ALL'
                  ? 'Diagram Batang Series: Perbandingan Antar Wilayah'
                  : `Diagram Batang: Khusus ${CATEGORY_META[categoryFilter]?.label} (${categoryFilter})`}
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              {categoryFilter === 'ALL'
                ? `Komparasi langsung nilai ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} skala UMI, UKE, UME, dan UBE di 4 kabupaten`
                : `Fokus perbandingan nilai ${viewType === 'nominal' ? 'nominal transaksi (Rp)' : 'volume transaksi (trx)'} khusus kategori ${CATEGORY_META[categoryFilter]?.label} (${CATEGORY_META[categoryFilter]?.criteria}) di 4 kabupaten`}
            </p>
          </div>

          {/* Controls: Month dropdown and Bar Mode (Grouped vs Stacked) */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Quick Month Selector */}
            <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1.5 rounded-xl border border-surface-border shadow-xs">
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

            {/* Bar Chart Mode Switcher: Grouped vs Stacked (visible if Semua Skala) */}
            {categoryFilter === 'ALL' && (
              <div className="inline-flex p-1 bg-surface-muted rounded-xl border border-surface-border shadow-xs">
                <button
                  type="button"
                  onClick={() => setBarChartMode('grouped')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    barChartMode === 'grouped'
                      ? 'bg-ink-900 text-white shadow-sm'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  Berdampingan
                </button>
                <button
                  type="button"
                  onClick={() => setBarChartMode('stacked')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    barChartMode === 'stacked'
                      ? 'bg-ink-900 text-white shadow-sm'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  Bertumpuk
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
                <Tooltip content={<CustomBarSeriesTooltip viewType={viewType} periodLabel={periodLabel} />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '14px', fontSize: '11px', fontWeight: 600 }}
                  formatter={(value) => {
                    const meta = CATEGORY_META[value]
                    return <span className="text-slate-700 font-semibold">{meta?.label || value}</span>
                  }}
                />

                {categoryFilter === 'ALL' ? (
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
            {categoryFilter === 'UMI' ? (
              <>
                <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-200 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-blue-700 block">Total Khusus Mikro (UMI)</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Banyumas Raya (4 Kab)</span>
                  <span className="text-[11px] text-blue-800 font-bold block">
                    {viewType === 'nominal'
                      ? formatRupiahShort(barChartData.reduce((s, k) => s + (k.UMI || 0), 0))
                      : formatVolumeShort(barChartData.reduce((s, k) => s + (k.UMI || 0), 0))}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Periode {periodLabel}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-blue-600 block">Kab. Banyumas (Mikro)</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {viewType === 'nominal'
                      ? formatRupiahShort(barChartData.find(k => k.kab === 'Banyumas')?.UMI || 0)
                      : formatVolumeShort(barChartData.find(k => k.kab === 'Banyumas')?.UMI || 0)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">51,2% porsi UMI (Terbesar)</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-blue-600 block">Kab. Cilacap (Mikro)</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {viewType === 'nominal'
                      ? formatRupiahShort(barChartData.find(k => k.kab === 'Cilacap')?.UMI || 0)
                      : formatVolumeShort(barChartData.find(k => k.kab === 'Cilacap')?.UMI || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">27,9% porsi UMI (Kedua)</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-blue-600 block">Purbalingga & Banjarnegara</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {viewType === 'nominal'
                      ? `${formatRupiahShort(barChartData.find(k => k.kab === 'Purbalingga')?.UMI || 0)} & ${formatRupiahShort(barChartData.find(k => k.kab === 'Banjarnegara')?.UMI || 0)}`
                      : `${formatVolumeShort(barChartData.find(k => k.kab === 'Purbalingga')?.UMI || 0)} & ${formatVolumeShort(barChartData.find(k => k.kab === 'Banjarnegara')?.UMI || 0)}`}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">12,2% & 8,7% porsi UMI</span>
                </div>
              </>
            ) : categoryFilter !== 'ALL' ? (
              <>
                <div className="p-2.5 rounded-lg border text-xs shadow-xs" style={{ backgroundColor: `${CATEGORY_META[categoryFilter]?.color}15`, borderColor: `${CATEGORY_META[categoryFilter]?.color}40` }}>
                  <span className="text-[10px] font-semibold uppercase block" style={{ color: CATEGORY_META[categoryFilter]?.color }}>Total {CATEGORY_META[categoryFilter]?.label}</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Banyumas Raya (4 Kab)</span>
                  <span className="text-[11px] font-bold block" style={{ color: CATEGORY_META[categoryFilter]?.color }}>
                    {viewType === 'nominal'
                      ? formatRupiahShort(barChartData.reduce((s, k) => s + (k[categoryFilter] || 0), 0))
                      : formatVolumeShort(barChartData.reduce((s, k) => s + (k[categoryFilter] || 0), 0))}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Periode {periodLabel}</span>
                </div>
                {['Banyumas', 'Cilacap', 'Purbalingga'].map((kab) => {
                  const val = barChartData.find(k => k.kab === kab)?.[categoryFilter] || 0
                  const totalCat = barChartData.reduce((s, k) => s + (k[categoryFilter] || 0), 0)
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
            ) : (
              <>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-blue-600 block">UMI Terbesar</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {viewType === 'nominal' ? formatRupiahShort(barChartData.find(k => k.kab === 'Banyumas')?.UMI || 0) : formatVolumeShort(barChartData.find(k => k.kab === 'Banyumas')?.UMI || 0)}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-emerald-600 block">UKE Terbesar</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {viewType === 'nominal' ? formatRupiahShort(barChartData.find(k => k.kab === 'Banyumas')?.UKE || 0) : formatVolumeShort(barChartData.find(k => k.kab === 'Banyumas')?.UKE || 0)}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-amber-600 block">UME Terbesar</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Kab. Banyumas</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {viewType === 'nominal' ? formatRupiahShort(barChartData.find(k => k.kab === 'Banyumas')?.UME || 0) : formatVolumeShort(barChartData.find(k => k.kab === 'Banyumas')?.UME || 0)}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs shadow-xs">
                  <span className="text-[10px] font-semibold uppercase text-purple-600 block">UBE Terbesar</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Kab. Purbalingga</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {viewType === 'nominal' ? formatRupiahShort(barChartData.find(k => k.kab === 'Purbalingga')?.UBE || 0) : formatVolumeShort(barChartData.find(k => k.kab === 'Purbalingga')?.UBE || 0)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Diagram Batang Komparasi Pertumbuhan Tahunan (2024 vs 2025 vs 2026) */}
      <div className="p-4 sm:p-6 border-t border-surface-border space-y-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-brand shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-ink-900 tracking-tight">
                {yearlyCategoryFilter === 'ALL'
                  ? 'Pertumbuhan Tahunan QRIS (2024 vs 2025 vs 2026)'
                  : `Pertumbuhan Tahunan: Khusus ${CATEGORY_META[yearlyCategoryFilter]?.label} (${yearlyCategoryFilter})`}
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              Komparasi pertumbuhan tahunan (YoY) nominal & volume transaksi antar tahun 2024, 2025, dan 2026 di{' '}
              <strong>{currentWilayah === 'ALL' ? 'Banyumas Raya (4 Kabupaten)' : `Kab. ${currentWilayah}`}</strong>
            </p>
          </div>

          {/* Mode Switcher: Grouped vs Stacked (visible when Semua Skala) */}
          {yearlyCategoryFilter === 'ALL' && (
            <div className="inline-flex p-1 bg-surface-muted rounded-xl border border-surface-border shadow-xs self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setYearlyBarMode('grouped')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  yearlyBarMode === 'grouped'
                    ? 'bg-ink-900 text-white shadow-sm'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                Berdampingan
              </button>
              <button
                type="button"
                onClick={() => setYearlyBarMode('stacked')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  yearlyBarMode === 'stacked'
                    ? 'bg-ink-900 text-white shadow-sm'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                Bertumpuk
              </button>
            </div>
          )}
        </div>

        {/* Filter Skala Usaha (4 Skala + Semua) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-ink-600 shrink-0 mr-1">Filter Skala:</span>
          {[
            { id: 'ALL', label: 'Semua Skala (4 Kategori)' },
            { id: 'UMI', label: 'Khusus Mikro (UMI)', color: CATEGORY_META.UMI.color },
            { id: 'UKE', label: 'Khusus Kecil (UKE)', color: CATEGORY_META.UKE.color },
            { id: 'UME', label: 'Khusus Menengah (UME)', color: CATEGORY_META.UME.color },
            { id: 'UBE', label: 'Khusus Besar (UBE)', color: CATEGORY_META.UBE.color }
          ].map((catOpt) => {
            const isSelected = yearlyCategoryFilter === catOpt.id
            return (
              <button
                key={catOpt.id}
                type="button"
                onClick={() => setYearlyCategoryFilter(catOpt.id)}
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

        {/* 3 Summary Highlight Cards with YoY Growth Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 2024 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">Tahun 2024</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Baseline
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {viewType === 'nominal'
                ? formatRupiahShort(yearlyGrowthStats.val2024)
                : formatVolumeShort(yearlyGrowthStats.val2024)}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {yearlyCategoryFilter === 'ALL'
                ? 'Total 4 skala usaha (Jan - Des 2024)'
                : `Total khusus ${yearlyCategoryFilter} (Jan - Des 2024)`}
            </p>
          </div>

          {/* Card 2025 */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">Tahun 2025</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                ▲ +{yearlyGrowthStats.growth25.toFixed(1)}% YoY
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-950">
              {viewType === 'nominal'
                ? formatRupiahShort(yearlyGrowthStats.val2025)
                : formatVolumeShort(yearlyGrowthStats.val2025)}
            </div>
            <p className="text-[10px] text-emerald-700 font-medium mt-1">
              Tumbuh +{viewType === 'nominal' ? formatRupiahShort(yearlyGrowthStats.diff25) : formatVolumeShort(yearlyGrowthStats.diff25)} dibanding 2024
            </p>
          </div>

          {/* Card 2026 */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">Tahun 2026</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-0.5">
                ▲ +{yearlyGrowthStats.growth26.toFixed(1)}% YoY
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-blue-950">
              {viewType === 'nominal'
                ? formatRupiahShort(yearlyGrowthStats.val2026)
                : formatVolumeShort(yearlyGrowthStats.val2026)}
            </div>
            <p className="text-[10px] text-blue-700 font-medium mt-1">
              Tumbuh +{viewType === 'nominal' ? formatRupiahShort(yearlyGrowthStats.diff26) : formatVolumeShort(yearlyGrowthStats.diff26)} vs 2025 (Total 3-thn: +{yearlyGrowthStats.totalGrowth.toFixed(1)}%)
            </p>
          </div>
        </div>

        {/* Recharts Bar Chart: 2024 vs 2025 vs 2026 */}
        <div className="bg-slate-50/50 p-3 sm:p-5 rounded-xl border border-surface-border shadow-xs">
          <div className="w-full h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyComparisonData} margin={{ top: 16, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                  dy={8}
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
                    <CustomYearlyGrowthTooltip
                      viewType={viewType}
                      categoryFilter={yearlyCategoryFilter}
                    />
                  }
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '14px', fontSize: '11px', fontWeight: 600 }}
                  formatter={(value) => {
                    const meta = CATEGORY_META[value]
                    return <span className="text-slate-700 font-semibold">{meta?.label || value}</span>
                  }}
                />

                {yearlyCategoryFilter === 'ALL' ? (
                  <>
                    <Bar
                      dataKey="UMI"
                      name="Usaha Mikro (UMI)"
                      fill={CATEGORY_META.UMI.color}
                      stackId={yearlyBarMode === 'stacked' ? 'yearlyStack' : undefined}
                      radius={yearlyBarMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={yearlyBarMode === 'stacked' ? 56 : 32}
                    />
                    <Bar
                      dataKey="UKE"
                      name="Usaha Kecil (UKE)"
                      fill={CATEGORY_META.UKE.color}
                      stackId={yearlyBarMode === 'stacked' ? 'yearlyStack' : undefined}
                      radius={yearlyBarMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={yearlyBarMode === 'stacked' ? 56 : 32}
                    />
                    <Bar
                      dataKey="UME"
                      name="Usaha Menengah (UME)"
                      fill={CATEGORY_META.UME.color}
                      stackId={yearlyBarMode === 'stacked' ? 'yearlyStack' : undefined}
                      radius={yearlyBarMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={yearlyBarMode === 'stacked' ? 56 : 32}
                    />
                    <Bar
                      dataKey="UBE"
                      name="Usaha Besar (UBE)"
                      fill={CATEGORY_META.UBE.color}
                      stackId={yearlyBarMode === 'stacked' ? 'yearlyStack' : undefined}
                      radius={yearlyBarMode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
                      maxBarSize={yearlyBarMode === 'stacked' ? 56 : 32}
                    />
                  </>
                ) : (
                  <Bar
                    dataKey={yearlyCategoryFilter}
                    name={`${CATEGORY_META[yearlyCategoryFilter]?.label} (${yearlyCategoryFilter})`}
                    fill={CATEGORY_META[yearlyCategoryFilter]?.color}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={64}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic Insight Banner */}
          <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
            <span className="text-brand font-bold shrink-0">💡 Analisis Tren:</span>
            <span>
              {yearlyCategoryFilter === 'ALL' ? (
                <>
                  Pertumbuhan total transaksi di <strong>{currentWilayah === 'ALL' ? 'Banyumas Raya' : `Kab. ${currentWilayah}`}</strong> mencatatkan lonjakan signifikan sebesar{' '}
                  <strong className="text-emerald-700">+{yearlyGrowthStats.growth25.toFixed(1)}% YoY</strong> pada 2025 dan kembali naik{' '}
                  <strong className="text-blue-700">+{yearlyGrowthStats.growth26.toFixed(1)}% YoY</strong> pada 2026.
                </>
              ) : (
                <>
                  Khusus kategori <strong>{CATEGORY_META[yearlyCategoryFilter]?.label} ({yearlyCategoryFilter})</strong> di <strong>{currentWilayah === 'ALL' ? 'Banyumas Raya' : `Kab. ${currentWilayah}`}</strong>, transaksi meningkat{' '}
                  <strong className="text-emerald-700">+{yearlyGrowthStats.growth25.toFixed(1)}% YoY</strong> di 2025 dan berlanjut naik{' '}
                  <strong className="text-blue-700">+{yearlyGrowthStats.growth26.toFixed(1)}% YoY</strong> di 2026 (akumulasi 3 tahun bertumbuh <strong className="text-indigo-700">+{yearlyGrowthStats.totalGrowth.toFixed(1)}%</strong>).
                </>
              )}
            </span>
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

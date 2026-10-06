import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import TransaksiToolbar from '../../components/TransaksiToolbar.jsx'
import Pagination from '../../components/Pagination.jsx'
import {
  Store, ArrowLeftRight, TrendingUp, TrendingDown, QrCode, Wallet,
  ShieldCheck, BarChart3
} from '../../components/icons.jsx'
import UmkmDetailPanel from '../../components/UmkmDetailPanel.jsx'
import {
  kabupatenList,
  rangeOptions,
  umkmKecamatan,
  kabupatenOmset,
  metodeBreakdown,
  trendOmset
} from '../../data/transaksiUMKMData.js'

const formatRp = (v) => `Rp ${Math.round(v).toLocaleString('id-ID')}`
const formatRpM = (v) => `Rp ${(v / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
const formatRpJt = (v) => `Rp ${(v / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Jt`

const COLORS = ['#E30617', '#2F5FE3', '#F5A623', '#22B07D', '#6B7280']
const kabColor = { Banyumas: '#E30617', Cilacap: '#2F5FE3', Purbalingga: '#F5A623', Banjarnegara: '#22B07D' }

function KpiCard({ label, value, sub, icon: Icon, iconBg, delta, deltaUp }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-border shadow-sm">
      <div className="flex items-center justify-between text-ink-500 mb-3">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">{value}</div>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium">
        {delta != null && (
          <span className={`flex items-center gap-0.5 font-semibold ${deltaUp ? 'text-emerald-600' : 'text-ink-400'}`}>
            {deltaUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {deltaUp ? '+' : ''}{delta}%
          </span>
        )}
        <span className="text-ink-400">{sub}</span>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, right, children, className }) {
  return (
    <div className={`bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden ${className || ''}`}>
      <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          {subtitle && <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="px-2 sm:px-3 pb-3 flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  )
}

export default function TransaksiUMKM({ isAdmin = true }) {
  const [range, setRange] = useState('12m')
  const [search, setSearch] = useState('')
  const [kabupaten, setKabupaten] = useState('semua')
  const [kecamatan, setKecamatan] = useState('semua')
  const [rows, setRows] = useState(umkmKecamatan)
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedRow, setSelectedRow] = useState(null)
  const chartRef = useRef(null)

  const kabupatenOptions = [
    { key: 'semua', label: 'Semua Kabupaten' },
    ...kabupatenList.map((k) => ({ key: k, label: k }))
  ]
  const kecamatanOptions = useMemo(() => {
    const list = kabupaten === 'semua'
      ? rows.map((r) => r.kecamatan)
      : rows.filter((r) => r.kabupaten === kabupaten).map((r) => r.kecamatan)
    return [
      { key: 'semua', label: kabupaten === 'semua' ? 'Semua Kecamatan' : 'Semua di Kab. Terpilih' },
      ...[...new Set(list)].map((k) => ({ key: k, label: k }))
    ]
  }, [kabupaten, rows])

  const rowByName = useMemo(() => Object.fromEntries(rows.map((r) => [r.kecamatan, r])), [rows])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (kabupaten !== 'semua' && r.kabupaten !== kabupaten) return false
      if (kecamatan !== 'semua' && r.kecamatan !== kecamatan) return false
      if (q) {
        const haystack = `${r.kecamatan} ${r.kabupaten} ${r.sektorDominan}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [rows, search, kabupaten, kecamatan])

  useEffect(() => { setPage(1) }, [search, kabupaten, kecamatan, rows])

  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)))
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const kpi = useMemo(() => {
    const totalUmkm = filtered.reduce((s, r) => s + r.jumlahUMKM, 0)
    const totalTx = filtered.reduce((s, r) => s + r.totalTransaksi, 0)
    const totalOmset = filtered.reduce((s, r) => s + r.omsetBulanan, 0)
    return {
      totalUmkm,
      totalTx,
      totalOmset,
      rataOmset: totalUmkm ? Math.round(totalOmset / totalUmkm) : 0,
      pertumbuhan: filtered.length ? Math.round((filtered.reduce((s, r) => s + r.pertumbuhan, 0) / filtered.length) * 10) / 10 : 0
    }
  }, [filtered])

  const barData = useMemo(() => {
    if (kabupaten === 'semua') {
      return kabupatenOmset.map((k) => ({
        name: k.kabupaten,
        label: k.kabupaten,
        nilai: k.rataOmsetPerUMKM,
        sub: `${k.jumlahUMKM.toLocaleString('id-ID')} UMKM`
      }))
    }
    return filtered.map((r) => ({
      name: r.kecamatan,
      label: r.kecamatan,
      nilai: r.rataOmsetPerUMKM,
      sub: `${r.jumlahUMKM.toLocaleString('id-ID')} UMKM`
    }))
  }, [kabupaten, filtered])

  const trendData = useMemo(() => {
    const months = range === '30d' ? 1 : range === '90d' ? 3 : 12
    const kabs = kabupaten === 'semua' ? kabupatenList : [kabupaten]
    return trendOmset.slice(-months).map((row) => {
      const out = { bulan: row.bulan }
      kabs.forEach((k) => { out[k] = row[k] })
      return out
    })
  }, [kabupaten, range])

  const donutData = useMemo(() => {
    if (kabupaten === 'semua' && kecamatan === 'semua' && !search) return metodeBreakdown
    const keys = ['QRIS', 'E-Wallet', 'Tunai', 'Virtual Account', 'Transfer Bank']
    return keys.map((m) => ({
      name: m,
      value: Math.round(filtered.reduce((s, r) => s + (r.metode?.[m] ?? 0), 0) / Math.max(1, filtered.length))
    }))
  }, [kabupaten, kecamatan, search, filtered])

  const ranking = useMemo(
    () => [...filtered].sort((a, b) => b.omsetBulanan - a.omsetBulanan).slice(0, 10),
    [filtered]
  )

  const metodeSummary = useMemo(() => {
    const total = donutData.reduce((s, d) => s + d.value, 0)
    return donutData.map((d) => ({
      ...d,
      pct: total ? Math.round((d.value / total) * 100) : 0
    }))
  }, [donutData])

  async function handleExport() {
    if (!chartRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(chartRef.current, { useCORS: true, backgroundColor: '#F7F8FB' })
      const link = document.createElement('a')
      link.download = `transaksi-umkm-${kabupaten}-${range}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      window.alert('Gagal mengekspor grafik. Coba lagi beberapa saat lagi.')
    } finally {
      setExporting(false)
    }
  }

  function handleExportExcel() {
    const headers = ['Kabupaten', 'Kecamatan', 'Sektor Dominan', 'Jumlah UMKM', 'Total Transaksi (Bulanan)', 'Omset Bulanan (Rp)', 'Rata Omset/UMKM (Rp)', 'Pertumbuhan (%)', 'Mikro', 'Kecil', 'Menengah']
    const body = filtered.map((r) => [
      r.kabupaten, r.kecamatan, r.sektorDominan, r.jumlahUMKM, r.totalTransaksi,
      r.omsetBulanan, r.rataOmsetPerUMKM, r.pertumbuhan,
      r.klasifikasi.mikro, r.klasifikasi.kecil, r.klasifikasi.menengah
    ])
    const csvContent = [headers.join(','), ...body.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-transaksi-umkm.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  function parseCsvText(text, fileIndex = 0) {
    const lines = text.split(/\r?\n/)
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^[\uFEFF"]|["]$/g, ''))
    const idxOf = (keys) => headers.findIndex((h) => keys.some((k) => h.toLowerCase().includes(k)))
    const kabIdx = idxOf(['kabupaten', 'regency'])
    const kecIdx = idxOf(['kecamatan'])
    const sektorIdx = idxOf(['sektor', 'industri'])
    const umkmIdx = idxOf(['jumlah umkm'])
    const txIdx = idxOf(['total transaksi'])
    const omsetIdx = idxOf(['omset'])
    const pertIdx = idxOf(['pertumbuhan'])
    const mikroIdx = idxOf(['mikro'])
    const kecilIdx = idxOf(['kecil'])
    const menengahIdx = idxOf(['menengah'])
    if (kecIdx === -1) return []

    const parsed = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const cols = []
      let insideQuotes = false
      let current = ''
      for (let c = 0; c < line.length; c++) {
        const ch = line[c]
        if (ch === '"') insideQuotes = !insideQuotes
        else if (ch === ',' && !insideQuotes) { cols.push(current.trim()); current = '' }
        else current += ch
      }
      cols.push(current.trim())
      const clean = cols.map((v) => v.replace(/^["']|["']$/g, ''))
      const kecamatan = kecIdx !== -1 ? clean[kecIdx] : ''
      if (!kecamatan) continue
      const jumlahUMKM = umkmIdx !== -1 ? parseInt(clean[umkmIdx]) || 0 : 0
      const omsetBulanan = omsetIdx !== -1 ? parseFloat(clean[omsetIdx]) || 0 : 0
      parsed.push({
        id: `IMP-${fileIndex}-${i}`,
        kabupaten: kabIdx !== -1 && clean[kabIdx] ? clean[kabIdx] : 'Lainnya',
        kecamatan,
        sektorDominan: sektorIdx !== -1 && clean[sektorIdx] ? clean[sektorIdx] : '—',
        jumlahUMKM,
        totalTransaksi: txIdx !== -1 ? parseInt(clean[txIdx]) || 0 : 0,
        omsetBulanan,
        rataOmsetPerUMKM: jumlahUMKM ? Math.round(omsetBulanan / jumlahUMKM) : 0,
        pertumbuhan: pertIdx !== -1 ? parseFloat(clean[pertIdx]) || 0 : 0,
        klasifikasi: {
          mikro: mikroIdx !== -1 ? parseInt(clean[mikroIdx]) || 0 : 0,
          kecil: kecilIdx !== -1 ? parseInt(clean[kecilIdx]) || 0 : 0,
          menengah: menengahIdx !== -1 ? parseInt(clean[menengahIdx]) || 0 : 0
        },
        metode: null
      })
    }
    return parsed
  }

  async function handleImportExcel(filesInput) {
    const files = Array.isArray(filesInput) ? filesInput : [filesInput]
    if (!files || files.length === 0) return
    let all = []
    const errors = []
    for (let fIdx = 0; fIdx < files.length; fIdx++) {
      const file = files[fIdx]
      try {
        const ext = file.name.split('.').pop().toLowerCase()
        let csvString = ''
        if (ext === 'xlsx' || ext === 'xls') {
          const arrayBuffer = await file.arrayBuffer()
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          csvString = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
        } else {
          csvString = await file.text()
        }
        const data = parseCsvText(csvString, fIdx)
        if (data.length > 0) all = all.concat(data)
        else errors.push(`${file.name}: Tidak ada baris valid yang terdeteksi.`)
      } catch (err) {
        errors.push(`${file.name}: ${err.message}`)
      }
    }
    if (all.length === 0) {
      window.alert(`Gagal membaca file:\n\n${errors.join('\n')}`)
      return
    }
    setRows(all)
    const label = files.length > 1 ? `${files.length} file` : files[0].name
    window.alert(`Berhasil memuat ${all.length} baris data UMKM dari ${label}!`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Total UMKM Aktif"
          value={kpi.totalUmkm.toLocaleString('id-ID')}
          sub="merchant QRIS terintegrasi"
          icon={Store}
          iconBg="bg-blue-50 text-blue-600"
          delta={12.5}
          deltaUp
        />
        <KpiCard
          label="Total Transaksi (Bulanan)"
          value={kpi.totalTx.toLocaleString('id-ID')}
          sub="volume transaksi QRIS"
          icon={ArrowLeftRight}
          iconBg="bg-brand-soft text-brand"
          delta={15.3}
          deltaUp
        />
        <KpiCard
          label="Rata-rata Omset per UMKM"
          value={formatRpJt(kpi.rataOmset)}
          sub="per bulan per usaha"
          icon={BarChart3}
          iconBg="bg-amber-50 text-amber-600"
          delta={8.1}
          deltaUp
        />
        <KpiCard
          label="Pertumbuhan Omset"
          value={`${kpi.pertumbuhan > 0 ? '+' : ''}${kpi.pertumbuhan}%`}
          sub="vs periode sebelumnya"
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-600"
          delta={null}
        />
      </div>

      <div>
        <div className="flex items-center gap-2 text-brand text-xs font-semibold uppercase tracking-wider mb-1">
          <Store size={16} />
          <span>Transaksi UMKM · Zona QRIS</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">Analitik Transaksi UMKM Banyumas Raya</h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-0.5 sm:mt-1">
          Rata-rata omset dan volume transaksi UMKM dari agregat resmi perbankan — per kabupaten, lalu drill ke tingkat kecamatan.
        </p>
      </div>

      <TransaksiToolbar
        range={range}
        onRangeChange={setRange}
        rangeOptions={rangeOptions}
        search={search}
        onSearchChange={setSearch}
        kabupaten={kabupaten}
        onKabupatenChange={(v) => { setKabupaten(v); setKecamatan('semua') }}
        kabupatenOptions={kabupatenOptions}
        kecamatan={kecamatan}
        onKecamatanChange={setKecamatan}
        kecamatanOptions={kecamatanOptions}
        exportLabel="Ekspor Grafik"
        onExport={handleExport}
        exporting={exporting}
        onExportExcel={handleExportExcel}
        onImportExcel={handleImportExcel}
        isAdmin={isAdmin}
      />

      {/* Charts */}
      <div ref={chartRef} className="space-y-4 sm:space-y-6 rounded-2xl p-2 sm:p-3 -m-2 sm:-m-3">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <ChartCard
            title="Tren Omset Bulanan"
            subtitle={kabupaten === 'semua' ? `Semua kabupaten · Banyumas Raya · ${range === '30d' ? '1 bulan' : range === '90d' ? '3 bulan' : '12 bulan'} terakhir` : `Kabupaten ${kabupaten} · ${range === '30d' ? '1 bulan' : range === '90d' ? '3 bulan' : '12 bulan'} terakhir`}
            className="xl:col-span-2"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  {kabupatenList.map((k) => (
                    <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={kabColor[k]} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={kabColor[k]} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => (v === 0 ? '0' : `${(v / 1e9).toFixed(1)}M`)} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v, name) => [formatRpM(v), name]} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} />
                <Legend />
                {kabupatenList.map((k) => (
                  <Area key={k} type="monotone" dataKey={k} stackId="1" stroke={kabColor[k]} strokeWidth={2} fill={`url(#grad-${k})`} name={k} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Metode Pembayaran"
            subtitle="Distribusi volume transaksi"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} strokeWidth={0}>
                  {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="px-3 pb-2 grid grid-cols-2 gap-1.5">
              {metodeSummary.map((m, i) => (
                <div key={m.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-ink-600">{m.name}</span>
                  <span className="ml-auto font-semibold text-ink-900 tabular-nums">{m.pct}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <ChartCard
            title={kabupaten === 'semua' ? 'Rata-rata Omset per Kabupaten' : 'Rata-rata Omset per Kecamatan'}
            subtitle={kabupaten === 'semua' ? 'Agregat general 4 kabupaten' : `Drill-down di Kabupaten ${kabupaten}`}
            className="xl:col-span-2 flex flex-col"
          >
            <ResponsiveContainer width="100%" className="flex-1 min-h-[280px]">
              <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tickFormatter={(v) => (v === 0 ? '0' : v >= 1e6 ? `${(v / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt` : `Rp ${Math.round(v).toLocaleString('id-ID')}`)} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={58} />
                <Tooltip formatter={(v) => [formatRp(v), 'Rata omset/UMKM']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Bar
                  dataKey="nilai"
                  fill="#045498"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={54}
                  cursor={kabupaten !== 'semua' ? 'pointer' : 'default'}
                  onClick={(entry) => {
                    if (kabupaten !== 'semua' && entry?._payload?.name) {
                      const row = rowByName[entry._payload.name]
                      if (row) setSelectedRow(row)
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Top Kecamatan</h3>
                <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5">Peringkat omset tertinggi</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet size={16} />
              </div>
            </div>
            <div className="px-3 sm:px-4 pb-4 flex-1 overflow-y-auto">
              {ranking.length === 0 ? (
                <p className="text-xs text-ink-400 text-center py-10">Tidak ada data sesuai filter.</p>
              ) : (
                ranking.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRow(r)}
                    className="w-full flex items-center gap-3 py-2 border-b border-surface-border/60 last:border-0 text-left transition-colors hover:bg-surface-muted/60 rounded-lg cursor-pointer"
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${i < 3 ? 'bg-brand text-white' : 'bg-surface-muted text-ink-500'}`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink-900 truncate">{r.kecamatan}</p>
                      <p className="text-[10px] text-ink-400 truncate">{r.kabupaten} · {r.jumlahUMKM.toLocaleString('id-ID')} UMKM</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-ink-900 tabular-nums">{formatRpJt(r.rataOmsetPerUMKM)}</p>
                      <p className={`text-[10px] font-semibold tabular-nums ${r.pertumbuhan >= 0 ? 'text-emerald-600' : 'text-brand'}`}>
                        {r.pertumbuhan >= 0 ? '+' : ''}{r.pertumbuhan}%
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabel detail */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 border-b border-surface-border">
          <div>
            <h3 className="font-semibold text-ink-900 text-sm sm:text-base">Detail Omset UMKM per Kecamatan</h3>
            <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5">Omset, transaksi, dan klasifikasi usaha per wilayah</p>
          </div>
          <span className="text-[11px] sm:text-xs text-ink-400 font-medium">
            {filtered.length} dari {rows.length} kecamatan
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-soft flex items-center justify-center mb-3">
              <QrCode size={24} className="text-brand" />
            </div>
            <p className="text-sm font-semibold text-ink-900">Tidak ada data yang cocok</p>
            <p className="text-xs text-ink-400 mt-1 max-w-[280px]">Coba ubah kata kunci atau atur ulang filter lokasi di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1120px]">
              <thead>
                <tr className="bg-surface-muted/50 text-ink-500 text-[10px] sm:text-[11px] uppercase font-semibold border-b border-surface-border align-middle">
                  <th className="py-2.5 px-3 sm:px-4 whitespace-nowrap min-w-[160px]">Kecamatan</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Kabupaten</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Sektor Dominan</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Jumlah UMKM</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Transaksi</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Rata Omset/UMKM</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Omset Bulanan</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Pertumbuhan</th>
                  <th className="py-2.5 px-3 whitespace-nowrap min-w-[200px]">Klasifikasi Usaha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {paginated.map((r) => (
                  <tr key={r.id} onClick={() => setSelectedRow(r)} className="transition-colors hover:bg-surface-muted/60 align-middle cursor-pointer">
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      <p className="text-xs sm:text-sm font-semibold text-ink-900">{r.kecamatan}</p>
                      <p className="text-[10px] sm:text-[11px] text-ink-400">{r.id}</p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-surface-muted text-ink-600">
                        {r.kabupaten}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] sm:text-xs text-ink-600 whitespace-nowrap">{r.sektorDominan}</td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-bold text-ink-900 tabular-nums whitespace-nowrap">{r.jumlahUMKM.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-semibold text-ink-700 tabular-nums whitespace-nowrap">{r.totalTransaksi.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-bold text-brand tabular-nums whitespace-nowrap">{formatRp(r.rataOmsetPerUMKM)}</td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-semibold text-ink-700 tabular-nums whitespace-nowrap">{formatRpM(r.omsetBulanan)}</td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className={`text-xs sm:text-sm font-bold tabular-nums ${r.pertumbuhan >= 0 ? 'text-emerald-600' : 'text-brand'}`}>
                        {r.pertumbuhan >= 0 ? '+' : ''}{r.pertumbuhan}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1.5 min-w-[180px]">
                        {[['Mikro', r.klasifikasi?.mikro ?? 0], ['Kecil', r.klasifikasi?.kecil ?? 0], ['Menengah', r.klasifikasi?.menengah ?? 0]].map(([label, v]) => (
                          <span key={label} className="flex items-center gap-2 text-[10px] sm:text-xs text-ink-600">
                            <span className="w-14 shrink-0 text-ink-400">{label}</span>
                            <span className="h-1.5 flex-1 rounded-full bg-surface-border overflow-hidden">
                              <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (v / Math.max(1, r.jumlahUMKM)) * 100)}%` }} />
                            </span>
                            <span className="w-12 shrink-0 text-right tabular-nums font-semibold text-ink-900">{v.toLocaleString('id-ID')}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <Pagination
            page={safePage}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      <div className="flex items-start gap-2.5 text-xs text-ink-300 bg-white border border-surface-border rounded-xl p-3 sm:p-3.5">
        <ShieldCheck size={15} className="text-ink-300 shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs leading-relaxed">
          Data omset merupakan hasil agregasi transaksi QRIS resmi dari perbankan per wilayah, bukan data individual
          UMKM — sejalan dengan prinsip minimalisasi data pada tata kelola Zona QRIS Bank Indonesia.
        </p>
      </div>

      {selectedRow && (
        <UmkmDetailPanel kecamatan={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  )
}
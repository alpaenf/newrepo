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
  Landmark, Banknote, Receipt, TrendingUp, TrendingDown, ShieldCheck,
  BarChart3, QrCode, Target
} from '../../components/icons.jsx'
import {
  kabupatenList
} from '../../data/transaksiUMKMData.js'
import {
  pajakKecamatan,
  kabupatenPajak,
  pajakSummary,
  jenisBreakdown,
  trendRealisasi,
  targetCapaian,
  pajakRangeOptions
} from '../../data/transaksiPemerintahData.js'
import { banyumasPajakNegaraRaw } from '../../data/banyumasPajakNegaraData.js'

const formatRp = (v) => `Rp ${Math.round(v).toLocaleString('id-ID')}`
const formatRpM = (v) => v >= 1e9
  ? `Rp ${(v / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
  : `Rp ${(v / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Jt`
const formatRpJt = (v) => v >= 1e6
  ? `Rp ${(v / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`
  : `Rp ${Math.round(v).toLocaleString('id-ID')}`

const JENIS_COLORS = { 'PBB-P2': '#E30617', BPHTB: '#F5A623', 'Retribusi & Lainnya': '#22B07D' }

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
          <span className={`flex items-center gap-0.5 font-semibold ${deltaUp ? 'text-emerald-600' : 'text-brand'}`}>
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

export default function TransaksiPemerintah({ isAdmin = true }) {
  const [range, setRange] = useState('12m')
  const [search, setSearch] = useState('')
  const [kabupaten, setKabupaten] = useState('semua')
  const [kecamatan, setKecamatan] = useState('semua')
  const [rows, setRows] = useState(pajakKecamatan)
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [tab, setTab] = useState('pusat') // 'pusat' | 'daerah'
  const [pusatRange, setPusatRange] = useState('2025')
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (kabupaten !== 'semua' && r.kabupaten !== kabupaten) return false
      if (kecamatan !== 'semua' && r.kecamatan !== kecamatan) return false
      if (q) {
        const haystack = `${r.kecamatan} ${r.kabupaten}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [rows, search, kabupaten, kecamatan])

  useEffect(() => { setPage(1) }, [search, kabupaten, kecamatan, rows])

  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)))
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const kpi = useMemo(() => {
    const nop = filtered.reduce((s, r) => s + r.nopTerdaftar, 0)
    const pbb = filtered.reduce((s, r) => s + r.penerimaanPBB, 0)
    const target = filtered.reduce((s, r) => s + r.targetPBB, 0)
    const bphtb = filtered.reduce((s, r) => s + r.penerimaanBPHTB, 0)
    const lain = filtered.reduce((s, r) => s + Math.round(r.penerimaanPBB * 0.14), 0)
    return {
      nop,
      pbb,
      bphtb,
      lain,
      realisasiPct: target ? Math.round((pbb / target) * 1000) / 10 : 0,
      pad: pbb + bphtb + lain
    }
  }, [filtered])

  const barData = useMemo(() => {
    if (kabupaten === 'semua') {
      return kabupatenPajak.map((k) => ({
        name: k.kabupaten,
        label: k.kabupaten,
        nilai: k.realisasiPct > 0 ? Math.round(k.penerimaanPBB / k.nopTerdaftar) : 0,
        sub: `${k.nopTerdaftar.toLocaleString('id-ID')} NOP`
      }))
    }
    return filtered.map((r) => ({
      name: r.kecamatan,
      label: r.kecamatan,
      nilai: r.rataPenerimaanPerNop,
      sub: `${r.nopTerdaftar.toLocaleString('id-ID')} NOP`
    }))
  }, [kabupaten, filtered])

  const trendData = useMemo(() => {
    const months = range === '30d' ? 1 : range === '90d' ? 3 : 12
    const kabs = kabupaten === 'semua' ? kabupatenList : [kabupaten]
    return trendRealisasi.slice(-months).map((row) => {
      const out = { bulan: row.bulan, PBB: 0, BPHTB: 0 }
      kabs.forEach((k) => {
        out.PBB += row[`${k}_PBB`]
        out.BPHTB += row[`${k}_BPHTB`]
      })
      return out
    })
  }, [kabupaten, range])

  const donutData = useMemo(() => {
    if (kabupaten === 'semua' && kecamatan === 'semua' && !search) return jenisBreakdown
    const pbb = filtered.reduce((s, r) => s + r.penerimaanPBB, 0)
    const bphtb = filtered.reduce((s, r) => s + r.penerimaanBPHTB, 0)
    const lain = filtered.reduce((s, r) => s + Math.round(r.penerimaanPBB * 0.14), 0)
    return [
      { name: 'PBB-P2', value: pbb, color: '#E30617' },
      { name: 'BPHTB', value: bphtb, color: '#F5A623' },
      { name: 'Retribusi & Lainnya', value: lain, color: '#22B07D' }
    ]
  }, [kabupaten, kecamatan, search, filtered])

  const donutPct = useMemo(() => {
    const total = donutData.reduce((s, d) => s + d.value, 0)
    return donutData.map((d) => ({ ...d, pct: total ? Math.round((d.value / total) * 100) : 0 }))
  }, [donutData])

  const capaian = useMemo(() => {
    if (kabupaten === 'semua') return targetCapaian
    return targetCapaian.filter((c) => c.kabupaten === kabupaten)
  }, [kabupaten])

  const padQrisData = useMemo(() => {
    if (kabupaten === 'semua') {
      return kabupatenPajak.map((k) => ({
        label: k.kabupaten,
        pad: k.padTotal,
        pajakQris: k.qrisPajak,
        retribusiQris: k.qrisRetribusi
      }))
    }
    return filtered.map((r) => ({
      label: r.kecamatan,
      pad: (r.penerimaanPBB ?? 0) + (r.penerimaanBPHTB ?? 0) + (r.penerimaanLain ?? 0),
      pajakQris: r.qrisPajak ?? 0,
      retribusiQris: r.qrisRetribusi ?? 0
    }))
  }, [kabupaten, filtered])

  const pphData = useMemo(() => {
    const yd = (kec) => kec.years[pusatRange] || kec.years['2024']
    return Object.entries(banyumasPajakNegaraRaw).map(([name, kec]) => ({
      label: name,
      pphPribadi: yd(kec).penerimaan,
      orangBayar: yd(kec).bayar,
      pphBadanUmkm: Math.round(yd(kec).penerimaan * 0.25),
      umkmBayar: Math.round(yd(kec).bayar * 0.25)
    }))
  }, [pusatRange])

  const pphTotal = useMemo(() => pphData.reduce(
    (a, d) => ({
      pphPribadi: a.pphPribadi + d.pphPribadi,
      orangBayar: a.orangBayar + d.orangBayar,
      pphBadanUmkm: a.pphBadanUmkm + d.pphBadanUmkm,
      umkmBayar: a.umkmBayar + d.umkmBayar
    }),
    { pphPribadi: 0, orangBayar: 0, pphBadanUmkm: 0, umkmBayar: 0 }
  ), [pphData])

  const ranking = useMemo(
    () => [...filtered].sort((a, b) => b.penerimaanPBB - a.penerimaanPBB).slice(0, 10),
    [filtered]
  )

  async function handleExport() {
    if (!chartRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(chartRef.current, { useCORS: true, backgroundColor: '#F7F8FB' })
      const link = document.createElement('a')
      link.download = `transaksi-pemerintah-${kabupaten}-${range}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      window.alert('Gagal mengekspor grafik. Coba lagi beberapa saat lagi.')
    } finally {
      setExporting(false)
    }
  }

  function handleExportExcel() {
    const headers = ['Kabupaten', 'Kecamatan', 'NOP Terdaftar', 'Transaksi Bayar', 'Penerimaan PBB (Rp)', 'Target PBB (Rp)', 'Realisasi (%)', 'Rata Penerimaan/NOP (Rp)', 'Penerimaan BPHTB (Rp)', 'Kepatuhan (%)', 'Pembayaran QRIS (%)']
    const body = filtered.map((r) => [
      r.kabupaten, r.kecamatan, r.nopTerdaftar, r.transaksiBayar, r.penerimaanPBB,
      r.targetPBB, r.realisasiPct, r.rataPenerimaanPerNop, r.penerimaanBPHTB, r.kepatuhanPct, r.pctQRIS
    ])
    const csvContent = [headers.join(','), ...body.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-transaksi-pemerintah.csv`
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
    const nopIdx = idxOf(['nop terdaftar', 'nop'])
    const txIdx = idxOf(['transaksi bayar'])
    const pbbIdx = idxOf(['penerimaan pbb', 'penerimaan'])
    const targetIdx = idxOf(['target pbb', 'target'])
    const bphtbIdx = idxOf(['bphtb'])
    const kepIdx = idxOf(['kepatuhan'])
    const qrisIdx = idxOf(['qris'])
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
      const nop = nopIdx !== -1 ? parseInt(clean[nopIdx]) || 0 : 0
      const penerimaanPBB = pbbIdx !== -1 ? parseFloat(clean[pbbIdx]) || 0 : 0
      parsed.push({
        id: `IMP-${fileIndex}-${i}`,
        kabupaten: kabIdx !== -1 && clean[kabIdx] ? clean[kabIdx] : 'Lainnya',
        kecamatan,
        nopTerdaftar: nop,
        transaksiBayar: txIdx !== -1 ? parseInt(clean[txIdx]) || 0 : 0,
        penerimaanPBB,
        targetPBB: targetIdx !== -1 ? parseFloat(clean[targetIdx]) || 0 : 0,
        realisasiPct: 0,
        rataPenerimaanPerNop: nop ? Math.round(penerimaanPBB / nop) : 0,
        penerimaanBPHTB: bphtbIdx !== -1 ? parseFloat(clean[bphtbIdx]) || 0 : 0,
        kepatuhanPct: kepIdx !== -1 ? parseFloat(clean[kepIdx]) || 0 : 0,
        pctQRIS: qrisIdx !== -1 ? parseFloat(clean[qrisIdx]) || 0 : 0
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
    window.alert(`Berhasil memuat ${all.length} baris data pajak dari ${label}!`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2 text-brand text-xs font-semibold uppercase tracking-wider mb-1">
          <Landmark size={16} />
          <span>Transaksi Pemerintah Daerah · Zona QRIS</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-ink-900">Analitik Penerimaan Pemerintah Daerah</h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-0.5 sm:mt-1">
          Penerimaan PBB-P2, BPHTB, dan PAD agregat dari perangkat daerah — rata-rata per kabupaten, lalu drill ke tingkat kecamatan.
        </p>
      </div>

      <TransaksiToolbar
        range={range}
        onRangeChange={setRange}
        rangeOptions={pajakRangeOptions}
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
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Total Penerimaan PBB-P2"
          value={formatRpM(kpi.pbb)}
          sub={`${kpi.nop.toLocaleString('id-ID')} NOP terdaftar`}
          icon={Landmark}
          iconBg="bg-brand-soft text-brand"
          delta={6.8}
          deltaUp
        />
        <KpiCard
          label="Realisasi vs Target PBB"
          value={`${kpi.realisasiPct}%`}
          sub="dari target tahun berjalan"
          icon={Target}
          iconBg="bg-amber-50 text-amber-600"
          delta={3.2}
          deltaUp
        />
        <KpiCard
          label="Penerimaan BPHTB"
          value={formatRpM(kpi.bphtb)}
          sub="bea perolehan hak"
          icon={Banknote}
          iconBg="bg-emerald-50 text-emerald-600"
          delta={9.4}
          deltaUp
        />
        <KpiCard
          label="PAD Agregat"
          value={formatRpM(kpi.pad)}
          sub="PBB + BPHTB + retribusi"
          icon={Receipt}
          iconBg="bg-purple-50 text-purple-600"
          delta={null}
/>
      </div>

      {/* Charts */}
      <div ref={chartRef} className="space-y-4 sm:space-y-6 rounded-2xl p-2 sm:p-3 -m-2 sm:-m-3">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <ChartCard
            title="Tren Realisasi Bulanan"
            subtitle={kabupaten === 'semua' ? `PBB-P2 & BPHTB · seluruh Banyumas Raya · ${range === '30d' ? '1 bulan' : range === '90d' ? '3 bulan' : '12 bulan'} terakhir` : `Kabupaten ${kabupaten} · ${range === '30d' ? '1 bulan' : range === '90d' ? '3 bulan' : '12 bulan'} terakhir`}
            className="xl:col-span-2"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-pbb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E30617" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#E30617" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="grad-bphtb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5A623" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => (v === 0 ? '0' : `${(v / 1e9).toFixed(1)}M`)} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v, name) => [formatRpM(v), name]} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} />
                <Legend />
                <Area type="monotone" dataKey="PBB" name="PBB-P2" stroke="#E30617" strokeWidth={2} fill="url(#grad-pbb)" />
                <Area type="monotone" dataKey="BPHTB" name="BPHTB" stroke="#F5A623" strokeWidth={2} fill="url(#grad-bphtb)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Komposisi Penerimaan"
            subtitle="Distribusi per jenis pajak"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} strokeWidth={0}>
                  {donutData.map((d, i) => <Cell key={i} fill={JENIS_COLORS[d.name] || COLORS_PALETTE[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => [formatRp(v), '']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="px-3 pb-2 grid grid-cols-1 gap-1.5">
              {donutPct.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: JENIS_COLORS[d.name] }} />
                  <span className="text-ink-600">{d.name}</span>
                  <span className="ml-auto font-semibold text-ink-900 tabular-nums">{d.pct}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <ChartCard
            title={kabupaten === 'semua' ? 'Rata-rata Penerimaan PBB per Kabupaten' : 'Rata-rata Penerimaan PBB per Kecamatan'}
            subtitle={kabupaten === 'semua' ? 'Rata-rata per NOP · 4 kabupaten' : `Drill-down di Kabupaten ${kabupaten}`}
            className="xl:col-span-2 flex flex-col"
          >
            <ResponsiveContainer width="100%" className="flex-1 min-h-[280px]">
              <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tickFormatter={(v) => (v === 0 ? '0' : v >= 1e6 ? `${(v / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt` : `Rp ${Math.round(v).toLocaleString('id-ID')}`)} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={58} />
                <Tooltip formatter={(v) => [formatRp(v), 'Rata penerimaan/NOP']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Bar dataKey="nilai" fill="#E30617" radius={[6, 6, 0, 0]} maxBarSize={54} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Top Kecamatan</h3>
                <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5">Penerimaan PBB tertinggi</p>
              </div>
              <div className="p-2 rounded-xl bg-brand-soft text-brand">
                <BarChart3 size={16} />
              </div>
            </div>
            <div className="px-3 sm:px-4 pb-4 flex-1 overflow-y-auto">
              {ranking.length === 0 ? (
                <p className="text-xs text-ink-400 text-center py-10">Tidak ada data sesuai filter.</p>
              ) : (
                ranking.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-3 py-2 border-b border-surface-border/60 last:border-0">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${i < 3 ? 'bg-brand text-white' : 'bg-surface-muted text-ink-500'}`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink-900 truncate">{r.kecamatan}</p>
                      <p className="text-[10px] text-ink-400 truncate">{r.kabupaten} · {r.nopTerdaftar.toLocaleString('id-ID')} NOP</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-ink-900 tabular-nums">{formatRpJt(r.rataPenerimaanPerNop)}</p>
                      <p className="text-[10px] font-semibold text-ink-400 tabular-nums">kepatuhan {r.kepatuhanPct}%</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Capaian target per kabupaten */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
            <h3 className="text-sm font-semibold text-ink-900">Realisasi vs Target PBB per Kabupaten</h3>
            <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5">Tingkat capaian target tahun berjalan</p>
          </div>
          <div className="px-4 sm:px-5 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {capaian.map((c) => {
              const pct = Math.min(100, c.realisasiPct)
              return (
                <div key={c.kabupaten} className="rounded-xl border border-surface-border p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-ink-900">{c.kabupaten}</span>
                    <span className="text-[11px] font-bold tabular-nums text-brand">{c.realisasiPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-border overflow-hidden mb-2.5">
                    <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-ink-400">
                    <span>{formatRpM(c.penerimaanPBB)}</span>
                    <span>target {formatRpM(c.targetPBB)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Perbandingan PAD vs kanal QRIS */}
        <ChartCard
          title="Perbandingan Total PAD vs Kanal QRIS"
          subtitle={kabupaten === 'semua' ? 'Total PAD dibanding pajak & retribusi via QRIS per kabupaten' : `Drill-down di Kabupaten ${kabupaten}`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={padQrisData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tickFormatter={(v) => (v === 0 ? '0' : `Rp ${(v / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`)} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={56} />
              <Tooltip formatter={(v, name) => [formatRpM(v), name]} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Legend />
              <Bar dataKey="pad" name="Total PAD" fill="#2F5FE3" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="pajakQris" name="Pajak via QRIS" fill="#E30617" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="retribusiQris" name="Retribusi via QRIS" fill="#22B07D" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tab: Pajak Pusat / Pajak Daerah */}
      <div className="flex items-center gap-1 bg-white border border-surface-border rounded-xl p-1 shadow-card w-full overflow-x-auto">
        <button
          onClick={() => setTab('pusat')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            tab === 'pusat' ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-700 hover:bg-surface-muted'
          }`}
        >
          Pajak Pusat (PPh & PPN)
        </button>
        <button
          onClick={() => setTab('daerah')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            tab === 'daerah' ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-700 hover:bg-surface-muted'
          }`}
        >
          Pajak Daerah
        </button>
      </div>

      {tab === 'daerah' && (
      // Tabel detail Pajak Daerah
      <div className="bg-white rounded-xl sm:rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 border-b border-surface-border">
          <div>
            <h3 className="font-semibold text-ink-900 text-sm sm:text-base">Detail Penerimaan Pajak Daerah per Kecamatan</h3>
            <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5">NOP, kepatuhan, dan tingkat pembayaran QRIS per wilayah</p>
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
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-surface-muted/50 text-ink-500 text-[10px] sm:text-[11px] uppercase font-semibold border-b border-surface-border">
                  <th className="py-2.5 px-3 sm:px-4">Kecamatan</th>
                  <th className="py-2.5 px-3">Kabupaten</th>
                  <th className="py-2.5 px-3 text-right">NOP Terdaftar</th>
                  <th className="py-2.5 px-3 text-right">Transaksi Bayar</th>
                  <th className="py-2.5 px-3 text-right">Penerimaan PBB</th>
                  <th className="py-2.5 px-3 text-right">Rata/NOP</th>
                  <th className="py-2.5 px-3 text-right">Realisasi</th>
                  <th className="py-2.5 px-3 text-right">Penerimaan BPHTB</th>
                  <th className="py-2.5 px-3 text-right">Kepatuhan</th>
                  <th className="py-2.5 px-3 text-right">QRIS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {paginated.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-surface-muted/60">
                    <td className="py-3 px-3 sm:px-4">
                      <p className="text-xs sm:text-sm font-semibold text-ink-900 whitespace-nowrap">{r.kecamatan}</p>
                      <p className="text-[10px] sm:text-[11px] text-ink-400">{r.id}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-surface-muted text-ink-600 whitespace-nowrap">
                        {r.kabupaten}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-bold text-ink-900 tabular-nums">{r.nopTerdaftar.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-semibold text-ink-700 tabular-nums">{r.transaksiBayar.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-bold text-brand tabular-nums">{formatRpM(r.penerimaanPBB)}</td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-semibold text-ink-700 tabular-nums">{formatRp(r.rataPenerimaanPerNop)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-xs sm:text-sm font-bold tabular-nums ${r.realisasiPct >= 80 ? 'text-emerald-600' : 'text-brand'}`}>
                        {r.realisasiPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-xs sm:text-sm font-semibold text-ink-700 tabular-nums">{formatRpM(r.penerimaanBPHTB)}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="h-1.5 w-12 rounded-full bg-surface-border overflow-hidden">
                          <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, r.kepatuhanPct)}%` }} />
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-ink-900 tabular-nums">{r.kepatuhanPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold text-brand bg-brand-soft tabular-nums whitespace-nowrap">
                        {r.pctQRIS}%
                      </span>
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
      )}

      {tab === 'pusat' && (
        <div className="space-y-4 sm:space-y-6">
          {/* KPI Pajak Pusat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <KpiCard
              label="Total PPh Orang Pribadi"
              value={formatRpM(pphTotal.pphPribadi)}
              sub={`realisasi tahun ${pusatRange}`}
              icon={Landmark}
              iconBg="bg-brand-soft text-brand"
              delta={null}
            />
            <KpiCard
              label="Total Orang Bayar PPh"
              value={pphTotal.orangBayar.toLocaleString('id-ID')}
              sub="wajib pajak yang membayar"
              icon={Receipt}
              iconBg="bg-amber-50 text-amber-600"
              delta={null}
            />
            <KpiCard
              label="Total PPh Badan UMKM"
              value={formatRpM(pphTotal.pphBadanUmkm)}
              sub="estimasi PPh final UMKM (0.5%)"
              icon={Banknote}
              iconBg="bg-emerald-50 text-emerald-600"
              delta={null}
            />
            <KpiCard
              label="Total UMKM Bayar PPh Badan"
              value={pphTotal.umkmBayar.toLocaleString('id-ID')}
              sub="UMKM badan yang membayar"
              icon={BarChart3}
              iconBg="bg-purple-50 text-purple-600"
              delta={null}
            />
          </div>

          {/* Catatan KPP */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 text-blue-800 flex items-start gap-2.5 shadow-sm text-xs sm:text-sm">
            <Landmark className="text-blue-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-semibold text-blue-900">Catatan Transaksi Pajak Pusat</p>
              <p className="text-[11px] sm:text-xs text-blue-700 mt-0.5 leading-relaxed">
                Data yang tersedia hanya wilayah <strong>Kabupaten Banyumas</strong> bekerja sama dengan
                <strong> KPP Pratama Purwokerto</strong>. Pilihan kabupaten lain tidak tersedia pada tab Pajak Pusat.
              </p>
            </div>
            <select
              value={pusatRange}
              onChange={(e) => setPusatRange(e.target.value)}
              className="ml-auto shrink-0 py-1.5 px-2.5 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-800 focus:outline-none"
            >
              {['2024', '2025', '2026'].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Grafik PPh per kecamatan */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <ChartCard title="Total PPh Orang Pribadi per Kecamatan" subtitle={`Kabupaten Banyumas · tahun ${pusatRange}`}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...pphData].sort((a, b) => b.pphPribadi - a.pphPribadi)} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis tickFormatter={(v) => (v === 0 ? '0' : `Rp ${(v / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`)} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip formatter={(v) => [formatRpM(v), 'PPh Pribadi']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="pphPribadi" fill="#2F5FE3" radius={[4, 4, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total Orang Bayar PPh per Kecamatan" subtitle={`Kabupaten Banyumas · tahun ${pusatRange}`}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...pphData].sort((a, b) => b.orangBayar - a.orangBayar)} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => v.toLocaleString('id-ID')} />
                  <Tooltip formatter={(v) => [v.toLocaleString('id-ID'), 'orang bayar']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="orangBayar" fill="#045498" radius={[4, 4, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total PPh Badan UMKM per Kecamatan" subtitle={`Kabupaten Banyumas · tahun ${pusatRange}`}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...pphData].sort((a, b) => b.pphBadanUmkm - a.pphBadanUmkm)} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis tickFormatter={(v) => (v === 0 ? '0' : `Rp ${(v / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`)} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip formatter={(v) => [formatRpM(v), 'PPh Badan UMKM']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="pphBadanUmkm" fill="#E30617" radius={[4, 4, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Total UMKM Bayar PPh Badan per Kecamatan" subtitle={`Kabupaten Banyumas · tahun ${pusatRange}`}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...pphData].sort((a, b) => b.umkmBayar - a.umkmBayar)} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => v.toLocaleString('id-ID')} />
                  <Tooltip formatter={(v) => [v.toLocaleString('id-ID'), 'UMKM badan bayar']} contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="umkmBayar" fill="#22B07D" radius={[4, 4, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2.5 text-xs text-ink-300 bg-white border border-surface-border rounded-xl p-3 sm:p-3.5">
        <ShieldCheck size={15} className="text-ink-300 shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs leading-relaxed">
          Angka penerimaan merupakan agregasi transaksi pembayaran pajak resmi (kanal perbankan & QRIS) yang dilaporkan
          perangkat daerah, bukan data wajib pajak individual — sejalan dengan prinsip minimalisasi data pada tata kelola
          Zona QRIS Bank Indonesia.
        </p>
      </div>
    </div>
  )
}

const COLORS_PALETTE = ['#E30617', '#2F5FE3', '#22B07D']

import { useMemo } from 'react'
import { X, Banknote, TrendingUp, Wallet, Store, ArrowRight } from './icons.jsx'
import { tierFromReadiness } from '../data/exportData.js'

const tierLegend = [
  { label: 'Siap Ekspor', color: '#22B07D' },
  { label: 'Potensial', color: '#F5A623' },
  { label: 'Perlu Pendampingan', color: '#E85D2F' }
]

const rupiah = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-surface-muted rounded-lg px-2.5 py-2">
      <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-ink-300">
        <Icon size={12} className="shrink-0" />
        {label}
      </p>
      <p className="text-xs sm:text-sm font-bold text-ink-900 tabular-nums mt-0.5 truncate">{value}</p>
    </div>
  )
}

export default function KabupatenSummaryPanel({ kabupaten, data, onClose, onSelectUmkm }) {
  const summary = useMemo(() => {
    const umkm = (data || []).filter((u) => u.regency === kabupaten)
    const tiers = { 'Siap Ekspor': 0, 'Potensial': 0, 'Perlu Pendampingan': 0 }
    for (const u of umkm) tiers[tierFromReadiness(u.readinessScore).label]++
    const komoditasCount = {}
    for (const u of umkm) komoditasCount[u.komoditas] = (komoditasCount[u.komoditas] || 0) + 1
    const topKomoditas = Object.entries(komoditasCount).sort((a, b) => b[1] - a[1]).slice(0, 4)
    const topUmkm = [...umkm].sort((a, b) => b.readinessScore - a.readinessScore).slice(0, 5)
    return {
      umkm,
      count: umkm.length,
      kecamatan: new Set(umkm.map((u) => u.kecamatan)).size,
      tiers,
      totalOmset: umkm.reduce((a, u) => a + (u.omzet || 0), 0),
      totalNilai: umkm.reduce((a, u) => a + (u.nilaiEkspor || 0), 0),
      totalPendanaan: umkm.reduce((a, u) => a + (u.pendanaan?.jumlah || 0), 0),
      topKomoditas,
      topUmkm
    }
  }, [kabupaten, data])

  if (!summary || summary.count === 0) return null

  const maxKomoditas = summary.topKomoditas[0]?.[1] || 1

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[85%] sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-[340px] bg-white rounded-xl sm:rounded-2xl shadow-2xl sm:shadow-lg border border-surface-border z-[550] overflow-y-auto transition-all animate-float-in">
      <div className="w-10 h-1 bg-surface-border rounded-full mx-auto my-1.5 block sm:hidden shrink-0" />
      <div className="flex items-start justify-between px-3.5 sm:px-4 pt-2 sm:pt-4 pb-3 sticky top-0 bg-white border-b border-surface-border z-10">
        <div>
          <p className="text-[11px] sm:text-xs text-ink-300">Ringkasan Wilayah</p>
          <h4 className="font-bold text-ink-900 leading-tight mt-0.5 text-sm sm:text-base">Kab. {kabupaten}</h4>
          <span className="inline-block mt-1.5 sm:mt-2 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-brand-light text-brand">
            {summary.kecamatan} kecamatan ┬╖ {summary.count} UMKM
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-muted shrink-0">
          <X size={16} className="text-ink-500" />
        </button>
      </div>

      <div className="p-3.5 sm:p-4 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={TrendingUp} label="Omset Bulanan" value={rupiah(summary.totalOmset)} />
          <StatCard icon={Banknote} label="Nilai Ekspor (1 thn)" value={rupiah(summary.totalNilai)} />
          <StatCard icon={Wallet} label="Total Pendanaan" value={rupiah(summary.totalPendanaan)} />
          <StatCard icon={Store} label="UMKM Tercatat" value={`${summary.count} usaha`} />
        </div>

        <section>
          <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-2">Kesiapan Ekspor</p>
          <div className="space-y-2">
            {tierLegend.map((t) => {
              const n = summary.tiers[t.label]
              const pct = summary.count > 0 ? Math.round((n / summary.count) * 100) : 0
              return (
                <div key={t.label} className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="text-ink-700 w-[130px] shrink-0 truncate">{t.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: t.color }} />
                  </div>
                  <span className="font-bold text-ink-900 tabular-nums shrink-0">{n}</span>
                </div>
              )
            })}
          </div>
        </section>

        {summary.topKomoditas.length > 0 && (
          <section>
            <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-2">Komoditas Teratas</p>
            <div className="space-y-2">
              {summary.topKomoditas.map(([nama, n]) => (
                <div key={nama} className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-ink-700 flex-1 min-w-0 truncate">{nama}</span>
                  <div className="w-16 h-1.5 rounded-full bg-surface-muted overflow-hidden shrink-0">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(n / maxKomoditas) * 100}%` }} />
                  </div>
                  <span className="font-bold text-ink-900 tabular-nums shrink-0">{n}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {summary.topUmkm.length > 0 && (
          <section>
            <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-2">UMKM Skor Tertinggi</p>
            <ul className="space-y-1">
              {summary.topUmkm.map((u, i) => (
                <li key={u.id}>
                  <button
                    onClick={() => onSelectUmkm(u.id)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-surface-muted transition-colors"
                  >
                    <span className="text-xs font-semibold text-ink-300 w-4 text-right shrink-0">{i + 1}</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: u.tierColor }} />
                    <span className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink-900 truncate">{u.name}</p>
                      <p className="text-[11px] text-ink-300 truncate">{u.kecamatan} ┬╖ {u.komoditas}</p>
                    </span>
                    <span className="text-xs font-bold text-ink-900 tabular-nums shrink-0">{u.readinessScore}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-[10px] sm:text-[11px] text-ink-300 mt-1.5 flex items-center gap-1">
              Klik UMKM untuk melihat detail
              <ArrowRight size={11} />
            </p>
          </section>
        )}
      </div>
    </div>
  )
}

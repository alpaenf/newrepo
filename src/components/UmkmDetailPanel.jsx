import { useMemo, useState } from 'react'
import { X, Store, Wallet, ArrowLeftRight, QrCode, Layers } from './icons.jsx'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getUmkmMerchants } from '../data/transaksiUMKMData.js'

const formatRp = (v) => `Rp ${Math.round(v).toLocaleString('id-ID')}`

const KLAS_COLOR = {
  Mikro: '#2F5FE3',
  Kecil: '#F5A623',
  Menengah: '#22B07D'
}

export default function UmkmDetailPanel({ kecamatan, onClose }) {
  const [showAll, setShowAll] = useState(false)

  const merchants = useMemo(() => getUmkmMerchants(kecamatan, 10), [kecamatan])
  const visible = showAll ? merchants : merchants.slice(0, 6)
  const totalOmset = merchants.reduce((s, m) => s + m.omsetBulanan, 0)

  const klasData = useMemo(() => {
    const total = kecamatan.jumlahUMKM || 1
    return [
      { name: 'Mikro', value: Math.round(((kecamatan.klasifikasi?.mikro ?? 0) / total) * 100) },
      { name: 'Kecil', value: Math.round(((kecamatan.klasifikasi?.kecil ?? 0) / total) * 100) },
      { name: 'Menengah', value: Math.round(((kecamatan.klasifikasi?.menengah ?? 0) / total) * 100) }
    ]
  }, [kecamatan])

  return (
    <div className="fixed inset-0 z-[1200]">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-float-in sm:rounded-l-2xl overflow-hidden">
        {/* Head */}
        <div className="flex items-start justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-surface-border shrink-0">
          <div>
            <p className="text-[11px] sm:text-xs text-ink-300 flex items-center gap-1.5">
              <Layers size={12} /> {kecamatan.kabupaten} · {kecamatan.id}
            </p>
            <h3 className="text-base sm:text-lg font-extrabold text-ink-900 mt-0.5">{kecamatan.kecamatan}</h3>
            <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5">{kecamatan.sektorDominan}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-muted shrink-0" aria-label="Tutup">
            <X size={16} className="text-ink-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Ringkasan */}
          <section className="grid grid-cols-2 gap-2">
            <div className="bg-surface-muted rounded-xl p-3">
              <p className="text-[11px] text-ink-300 mb-1 flex items-center gap-1"><Store size={12} /> Jumlah UMKM</p>
              <p className="text-base font-bold text-ink-900 tabular-nums">{kecamatan.jumlahUMKM.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-ink-400">merchant QRIS</p>
            </div>
            <div className="bg-surface-muted rounded-xl p-3">
              <p className="text-[11px] text-ink-300 mb-1 flex items-center gap-1"><Wallet size={12} /> Rata Omset/UMKM</p>
              <p className="text-base font-bold text-brand tabular-nums">{formatRp(kecamatan.rataOmsetPerUMKM)}</p>
              <p className="text-[11px] text-ink-400">per bulan</p>
            </div>
            <div className="bg-surface-muted rounded-xl p-3">
              <p className="text-[11px] text-ink-300 mb-1 flex items-center gap-1"><ArrowLeftRight size={12} /> Total Transaksi</p>
              <p className="text-base font-bold text-ink-900 tabular-nums">{kecamatan.totalTransaksi.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-ink-400">per bulan</p>
            </div>
            <div className="bg-surface-muted rounded-xl p-3">
              <p className="text-[11px] text-ink-300 mb-1 flex items-center gap-1"><Store size={12} /> Pertumbuhan</p>
              <p className={`text-base font-bold tabular-nums ${kecamatan.pertumbuhan >= 0 ? 'text-emerald-600' : 'text-brand'}`}>
                {kecamatan.pertumbuhan >= 0 ? '+' : ''}{kecamatan.pertumbuhan}%
              </p>
              <p className="text-[11px] text-ink-400">vs periode lalu</p>
            </div>
          </section>

          {/* Klasifikasi donut */}
          <section>
            <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-2">Klasifikasi Usaha</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={150}>
                <PieChart>
                  <Pie data={klasData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={2} strokeWidth={0}>
                    {klasData.map((d) => <Cell key={d.name} fill={KLAS_COLOR[d.name]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #E2E3E8' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {klasData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: KLAS_COLOR[d.name] }} />
                    <span className="text-ink-600">{d.name}</span>
                    <span className="ml-auto font-semibold text-ink-900 tabular-nums">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Daftar UMKM detail */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-semibold text-ink-900">UMKM di Kecamatan Ini</p>
              <span className="text-[11px] text-ink-400">sampel {visible.length}/{merchants.length}</span>
            </div>
            <div className="space-y-1.5">
              {visible.map((m) => (
                <div key={m.id} className="bg-surface-muted rounded-xl px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-900 truncate">{m.nama}</p>
                      <p className="text-[10px] text-ink-400">{m.bidang} · {m.id}</p>
                    </div>
                    <span className="shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${KLAS_COLOR[m.klasifikasi]}1A`, color: KLAS_COLOR[m.klasifikasi] }}>
                      {m.klasifikasi}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <span className="text-ink-600 tabular-nums"><span className="text-ink-300">Omset </span>{formatRp(m.omsetBulanan)}</span>
                    <span className="text-ink-600 tabular-nums"><span className="text-ink-300">Tx </span>{m.transaksi.toLocaleString('id-ID')}</span>
                    <span className="flex items-center gap-1 text-ink-600"><QrCode size={11} className="text-brand" />{m.qrisPct}%</span>
                  </div>
                </div>
              ))}
            </div>
            {merchants.length > 6 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-surface-border hover:bg-surface-muted text-ink-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                {showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua UMKM'}
              </button>
            )}
          </section>

          {/* Adopsi QRIS */}
          <section>
            <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-2 flex items-center gap-1.5">
              <QrCode size={14} className="text-brand" /> Adopsi QRIS
            </p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] sm:text-xs text-ink-600">Transaksi via QRIS</span>
              <span className="text-[11px] sm:text-xs font-semibold text-ink-900 tabular-nums">{kecamatan.metode?.QRIS ?? 58}%</span>
            </div>
            <div className="h-2 bg-surface-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-brand" style={{ width: `${kecamatan.metode?.QRIS ?? 58}%` }} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
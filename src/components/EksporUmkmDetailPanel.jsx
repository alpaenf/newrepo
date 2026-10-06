import {
  X,
  Package,
  Layers,
  Wallet,
  BadgeCheck,
  Globe,
  Phone,
  User,
  History,
  Navigation,
  ArrowRight,
  Banknote,
  TrendingUp
} from './icons.jsx'
import { exportUmkm } from '../data/exportData.js'

function scoreColor(score) {
  if (score >= 75) return '#22B07D'
  if (score >= 50) return '#F5A623'
  return '#E85D2F'
}

const rupiah = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)

export default function UmkmDetailPanel({ umkmId, onClose, onOpenPendanaan, data }) {
  const mapData = data || exportUmkm
  const u = mapData.find((item) => item.id === umkmId)
  if (!u) return null

  const pendanaanAktif = u.pendanaan?.status === 'Sudah'

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[85%] sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-[340px] bg-white rounded-xl sm:rounded-2xl shadow-2xl sm:shadow-lg border border-surface-border z-[550] overflow-y-auto transition-all animate-float-in">
      <div className="w-10 h-1 bg-surface-border rounded-full mx-auto my-1.5 block sm:hidden shrink-0" />
      <div className="flex items-start justify-between px-3.5 sm:px-4 pt-2 sm:pt-4 pb-3 sticky top-0 bg-white border-b border-surface-border z-10">
        <div>
          <p className="text-[11px] sm:text-xs text-ink-300">{u.id} ┬╖ {u.kecamatan}, {u.regency}</p>
          <h4 className="font-bold text-ink-900 leading-tight mt-0.5 text-sm sm:text-base">{u.name}</h4>
          <span
            className="inline-block mt-1.5 sm:mt-2 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold"
            style={{ backgroundColor: `${u.tierColor}1A`, color: u.tierColor }}
          >
            {u.tier}
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-muted shrink-0">
          <X size={16} className="text-ink-500" />
        </button>
      </div>

      <div className="p-3.5 sm:p-4 space-y-4 sm:space-y-5">
        <section className="bg-surface-muted rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs text-ink-300 mb-0.5">Skor Kesiapan Ekspor</p>
          <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: scoreColor(u.readinessScore) }}>
            {u.readinessScore}
          </p>
          <p className="text-[11px] sm:text-xs text-ink-500 mt-0.5">dari 100 ┬╖ evaluasi kesiapan ekspor</p>
        </section>

        <section className="space-y-2.5 sm:space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-ink-900">Profil UMKM</p>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <Package size={14} className="text-ink-300 shrink-0" />
              Komoditas
            </span>
            <span className="font-semibold text-ink-900 text-right truncate max-w-[150px]">{u.komoditas}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <Layers size={14} className="text-ink-300 shrink-0" />
              Produksi Bulan Ini
            </span>
            <span className="font-semibold text-ink-900 tabular-nums">
              {new Intl.NumberFormat('id-ID').format(u.volumeProduksi)} {u.satuanProduksi.replace(/\/bulan$/, '')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <BadgeCheck size={14} className="text-ink-300 shrink-0" />
              Sertifikasi
            </span>
            <span className="font-semibold text-ink-900 text-right max-w-[150px]">
              {u.sertifikasi.length > 0 ? u.sertifikasi.join(' ┬╖ ') : 'Belum ada'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <Globe size={14} className="text-ink-300 shrink-0" />
              Negara Tujuan
            </span>
            <span className="font-semibold text-ink-900 text-right max-w-[150px]">
              {u.negaraTujuan.length > 0 ? u.negaraTujuan.join(', ') : 'Belum ada'}
            </span>
          </div>

          {u.omzet > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
                <TrendingUp size={14} className="text-ink-300 shrink-0" />
                Omset Bulanan
              </span>
              <span className="font-semibold text-ink-900 tabular-nums">{rupiah(u.omzet)}</span>
            </div>
          )}

          {u.nilaiEkspor > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
                <Banknote size={14} className="text-ink-300 shrink-0" />
                Nilai Ekspor (1 thn)
              </span>
              <span className="font-semibold text-ink-900 tabular-nums">{rupiah(u.nilaiEkspor)}</span>
            </div>
          )}
        </section>

        <section className="space-y-2.5 sm:space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-ink-900">Pendanaan</p>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <Wallet size={14} className="text-ink-300 shrink-0" />
              Status
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                pendanaanAktif ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-600'
              }`}
            >
              {u.pendanaan?.status ?? 'Belum'}
            </span>
          </div>
          {pendanaanAktif && (
            <>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-ink-500">Sumber</span>
                <span className="font-semibold text-ink-900">{u.pendanaan.sumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-ink-500">Jumlah</span>
                <span className="font-semibold text-ink-900 tabular-nums">{rupiah(u.pendanaan.jumlah)}</span>
              </div>
            </>
          )}
        </section>

        {u.historyExport.length > 0 && (
          <section>
            <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-2 flex items-center gap-1.5">
              <History size={14} className="text-ink-300" />
              Riwayat Ekspor
            </p>
            <ul className="space-y-1.5">
              {u.historyExport.map((h, i) => (
                <li key={i} className="flex items-center justify-between bg-surface-muted rounded-lg px-2.5 py-1.5 text-xs sm:text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">{h.tahun} ┬╖ {h.negara}</p>
                    <p className="text-[11px] text-ink-300">{h.volume}</p>
                  </div>
                  <span className="font-semibold text-ink-900 tabular-nums shrink-0">{rupiah(h.nilai)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-700">
            <User size={13} className="text-ink-300 shrink-0" />
            <span className="font-medium">{u.owner}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-700">
            <Phone size={13} className="text-ink-300 shrink-0" />
            <span className="font-medium">{u.phone}</span>
          </div>
        </section>

        <section className="bg-brand-light border border-brand-soft rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-1">Rekomendasi</p>
          <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">{u.recommendation}</p>
        </section>

        <div className="space-y-2 pt-1">
          {u.googleMapsUrl && (
            <a
              href={u.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 sm:py-2.5 bg-surface-muted hover:bg-surface-border border border-surface-border text-ink-700 rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              <Navigation size={14} />
              Buka di Google Maps
            </a>
          )}
          <button
            onClick={() => onOpenPendanaan?.(u.id)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 sm:py-2.5 bg-brand text-white rounded-lg text-xs sm:text-sm font-semibold shadow-card hover:bg-brand-dark transition-colors"
          >
            Ajukan Pendanaan
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

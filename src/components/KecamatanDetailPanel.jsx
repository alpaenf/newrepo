import {
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Store,
  QrCode,
  ArrowRight,
  Navigation
} from './icons.jsx'
import { kecamatanZonation } from '../data/heatmapData.js'

function scoreColor(score) {
  if (score >= 75) return '#22B07D'
  if (score >= 50) return '#F5A623'
  return '#E85D2F'
}

const rangeLabel = {
  '7d': '7 Hari',
  '30d': '30 Hari',
  monthly: 'Bulanan',
  '2026': 'Tahun 2026',
  '2025': 'Tahun 2025',
  '2024': 'Tahun 2024'
}

export default function KecamatanDetailPanel({ kecamatanId, range, onClose, onOpenScorecard, data, isAdmin = true }) {
  const mapData = data || kecamatanZonation
  const k = mapData.find((item) => item.id === kecamatanId)
  if (!k) return null

  const volumeByRange = range.startsWith('20')
    ? k.indicators.transactionVolume7d
    : {
        '7d': k.indicators.transactionVolume7d,
        '30d': k.indicators.transactionVolume30d,
        monthly: k.indicators.transactionVolumeMonthly
      }[range]

  const isGrowthPositive = k.indicators.growthPct >= 0

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[85%] sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-[320px] bg-white rounded-xl sm:rounded-2xl shadow-2xl sm:shadow-lg border border-surface-border z-[550] overflow-y-auto transition-all animate-float-in">
      <div className="w-10 h-1 bg-surface-border rounded-full mx-auto my-1.5 block sm:hidden shrink-0" />
      <div className="flex items-start justify-between px-3.5 sm:px-4 pt-2 sm:pt-4 pb-3 sticky top-0 bg-white border-b border-surface-border z-10">
        <div>
          <p className="text-[11px] sm:text-xs text-ink-300">{k.id} · {k.regency}</p>
          <h4 className="font-bold text-ink-900 leading-tight mt-0.5 text-sm sm:text-base">{k.name}</h4>
          <span
            className="inline-block mt-1.5 sm:mt-2 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold"
            style={{ backgroundColor: `${k.tierColor}1A`, color: k.tierColor }}
          >
            {k.tier}
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-muted shrink-0">
          <X size={16} className="text-ink-500" />
        </button>
      </div>

      <div className="p-3.5 sm:p-4 space-y-4 sm:space-y-5">
        {/* Skor Zonasi */}
        <section className="bg-surface-muted rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs text-ink-300 mb-0.5">Skor Zonasi</p>
          <p className="text-3xl sm:text-4xl font-semibold" style={{ color: scoreColor(k.zonationScore) }}>
            {k.zonationScore}
          </p>
          <p className="text-[11px] sm:text-xs text-ink-500 mt-0.5">dari 100 · kerangka 3S</p>
        </section>

        {/* Indikator penilaian */}
        <section className="space-y-2.5 sm:space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-ink-900">Indikator Penilaian</p>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <Store size={14} className="text-ink-300 shrink-0" />
              Jumlah Merchant
            </span>
            <span className="font-semibold text-ink-900 tabular-nums">
              {new Intl.NumberFormat('id-ID').format(k.indicators.merchants)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <QrCode size={14} className="text-ink-300 shrink-0" />
              Adopsi QRIS
            </span>
            <span className="font-semibold text-ink-900">{k.indicators.qrisAdoption}%</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <Store size={14} className="text-ink-300 shrink-0" />
              Industri Dominan
            </span>
            <span className="font-semibold text-ink-900 text-right truncate max-w-[140px]">{k.dominantIndustry}</span>
          </div>

          {isAdmin && (
            <>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-ink-500 truncate max-w-[150px]">Volume Transaksi ({rangeLabel[range]})</span>
                <span className="font-semibold text-ink-900 tabular-nums">
                  {new Intl.NumberFormat('id-ID').format(volumeByRange)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
                  <AlertTriangle size={14} className="text-ink-300 shrink-0" />
                  Risiko Fraud
                </span>
                <span className="font-semibold text-ink-900">
                  {Math.round(k.indicators.fraudRisk * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-ink-500">Pertumbuhan Omset</span>
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    isGrowthPositive ? 'text-emerald-600' : 'text-brand'
                  }`}
                >
                  {isGrowthPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(k.indicators.growthPct)}%
                </span>
              </div>
            </>
          )}
        </section>

        {/* Rekomendasi intervensi */}
        {isAdmin && (
          <section className="bg-brand-light border border-brand-soft rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-1">Rekomendasi Intervensi</p>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">{k.recommendation}</p>
          </section>
        )}

        <div className="space-y-2 pt-1">
          {k.googleMapsUrl && (
            <a
              href={k.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 sm:py-2.5 bg-surface-muted hover:bg-surface-border border border-surface-border text-ink-700 rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              <Navigation size={14} />
              Buka di Google Maps
            </a>
          )}

          {isAdmin && (
            <button
              onClick={() => onOpenScorecard?.(k.id)}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 sm:py-2.5 bg-brand text-white rounded-lg text-xs sm:text-sm font-semibold shadow-card hover:bg-brand-dark transition-colors"
            >
              Buka Skor Kecamatan
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
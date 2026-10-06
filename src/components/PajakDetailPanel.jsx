import {
  X,
  TrendingUp,
  TrendingDown,
  UsersRound,
  BadgeCheck,
  Navigation,
  ArrowRight,
  Wallet,
  Landmark,
  FileText
} from './icons.jsx'
import { purbalinggaWPData } from '../data/purbalinggaWPData.js'

function scoreColor(score) {
  if (score >= 75) return '#22B07D'
  if (score >= 50) return '#F5A623'
  return '#E85D2F'
}

function formatRupiah(valueInMillions) {
  if (valueInMillions >= 1000) {
    return `Rp ${(valueInMillions / 1000).toFixed(2).replace('.', ',')} Miliar`
  }
  return `Rp ${valueInMillions.toLocaleString('id-ID')} Juta`
}

function formatRupiahFull(value) {
  if (value === 0 || value === '-' || !value) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace(/\s+/g, ' ')
}

export default function PajakDetailPanel({
  kecamatanId,
  onClose,
  onOpenScorecard,
  data,
  isDaerah = true,
  metric
}) {
  const k = data.find((item) => item.id === kecamatanId)
  if (!k) return null

  const isGrowthPositive = k.indicators.growthPct >= 0
  const businesses = purbalinggaWPData[k.name] || []

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[85%] sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-[320px] bg-white rounded-xl sm:rounded-2xl shadow-2xl sm:shadow-lg border border-surface-border z-[550] overflow-y-auto transition-all animate-float-in">
      {/* Mobile drag handle indicator */}
      <div className="w-10 h-1 bg-surface-border rounded-full mx-auto my-1.5 block sm:hidden shrink-0" />
      
      {/* Header */}
      <div className="flex items-start justify-between px-3.5 sm:px-4 pt-2 sm:pt-4 pb-3 bg-white border-b border-surface-border sticky top-0 z-10">
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
        {/* Skor Zonasi Pajak */}
        <section className="bg-surface-muted rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs text-ink-300 mb-0.5">Indeks Potensi Pajak</p>
          <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: scoreColor(k.zonationScore) }}>
            {k.zonationScore}
          </p>
          <p className="text-[11px] sm:text-xs text-ink-500 mt-0.5">dari 100 · Analisis Fiskal Wilayah</p>
        </section>

        {/* Indikator Penilaian Pajak */}
        <section className="space-y-2.5 sm:space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-ink-900">Indikator Fiskal & Kepatuhan</p>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <UsersRound size={14} className="text-ink-300 shrink-0" />
              Wajib Pajak Terdaftar
            </span>
            <span className="font-semibold text-ink-900 tabular-nums">
              {new Intl.NumberFormat('id-ID').format(k.indicators.merchants)} orang
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <BadgeCheck size={14} className="text-ink-300 shrink-0" />
              Tingkat Kepatuhan
            </span>
            <span className="font-semibold text-ink-900">{k.indicators.qrisAdoption}%</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <TrendingUp size={14} className="text-ink-300 shrink-0" />
              Pertumbuhan Pajak
            </span>
            <span
              className={`flex items-center gap-1 font-semibold ${
                isGrowthPositive ? 'text-emerald-600' : 'text-brand'
              }`}
            >
              {isGrowthPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(k.indicators.growthPct)}%
            </span>
          </div>

          <hr className="border-surface-border my-2" />

          {/* Breakdown Penerimaan */}
          <p className="text-xs font-bold text-ink-500 uppercase tracking-wider">Breakdown Realisasi</p>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <Landmark size={14} className="text-ink-300 shrink-0" />
              Total Penerimaan
            </span>
            <span className="font-bold text-[#045498] tabular-nums">
              {formatRupiah(k.indicators.penerimaanTotal)}
            </span>
          </div>

          {isDaerah ? (
            <>
              <div className="flex items-center justify-between text-xs sm:text-sm pl-4 border-l-2 border-slate-100">
                <span className="text-ink-500">PBJT (Resto & Hotel)</span>
                <span className="font-medium text-ink-900 tabular-nums">
                  {formatRupiah(k.indicators.pbjt)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm pl-4 border-l-2 border-slate-100">
                <span className="text-ink-500">PBB-P2</span>
                <span className="font-medium text-ink-900 tabular-nums">
                  {formatRupiah(k.indicators.pbb)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm pl-4 border-l-2 border-slate-100">
                <span className="text-ink-500">BPHTB</span>
                <span className="font-medium text-ink-900 tabular-nums">
                  {formatRupiah(k.indicators.bphtb)}
                </span>
              </div>
            </>
          ) : (
            <>
              {metric === 'lapor' ? (
                <>
                  <div className="flex flex-col text-xs sm:text-sm pl-4 border-l-2 border-slate-100 py-1">
                    <span className="text-ink-400 text-[10px] uppercase font-semibold">Sektor Dominan (KLU)</span>
                    <span className="font-bold text-ink-900 leading-tight">
                      {k.indicators.sdaSectorName || k.dominantIndustry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm pl-4 border-l-2 border-slate-100 py-1">
                    <span className="text-ink-500">Realisasi Pajak Sektor</span>
                    <span className="font-bold text-emerald-600 tabular-nums">
                      {formatRupiahFull(k.indicators.sdaSectorValue)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs sm:text-sm pl-4 border-l-2 border-slate-100">
                    <span className="text-ink-500">PPN (Pajak Pertambahan Nilai)</span>
                    <span className="font-medium text-ink-900 tabular-nums">
                      {formatRupiah(k.indicators.ppn)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm pl-4 border-l-2 border-slate-100">
                    <span className="text-ink-500">PPh (Pajak Penghasilan)</span>
                    <span className="font-medium text-ink-900 tabular-nums">
                      {formatRupiah(k.indicators.pph)}
                    </span>
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-ink-500">
              <FileText size={14} className="text-ink-300 shrink-0" />
              Sektor Dominan
            </span>
            <span className="font-semibold text-ink-900 text-right truncate max-w-[140px]">{k.dominantIndustry}</span>
          </div>
        </section>

        {businesses.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs sm:text-sm font-bold text-ink-900 uppercase tracking-wide border-b border-surface-border pb-1">
              Daftar Usaha / UMKM Wajib Pajak
            </p>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {businesses.map((biz, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1 hover:shadow-xs transition-shadow text-[11px] font-sans">
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <h5 className="font-bold text-slate-800 leading-tight truncate" title={biz.name}>{biz.name}</h5>
                      <span className="inline-block text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-medium mt-0.5">
                        {biz.category}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      biz.score >= 75 ? 'bg-emerald-50 text-emerald-700' :
                      biz.score >= 50 ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      Skor: {biz.score}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-600 pt-1 border-t border-slate-200/50">
                    <div>
                      <span className="text-[9px] text-slate-400 block leading-none">Omzet/Bulan</span>
                      <span className="font-semibold text-slate-800">
                        {biz.omzet >= 1e6 ? `Rp ${(biz.omzet / 1e6).toFixed(1)} Jt` : `Rp ${biz.omzet.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block leading-none">PPh Badan UMKM</span>
                      <span className="font-semibold text-slate-800">
                        Rp {Math.round(biz.omzet * 0.005).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="pt-0.5">
                      <span className="text-[9px] text-slate-400 block leading-none">Status WP</span>
                      <span className={`font-bold ${biz.isWP ? 'text-[#045498]' : 'text-slate-500'}`}>
                        {biz.isWP ? 'Wajib Pajak' : 'Bukan WP'}
                      </span>
                    </div>
                    <div className="pt-0.5">
                      <span className="text-[9px] text-slate-400 block leading-none">Pertumbuhan</span>
                      <span className="font-bold text-emerald-600">
                        +{biz.growthPct}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rekomendasi Fiskal */}
        <section className="bg-brand-light border border-brand-soft rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-ink-900 mb-1">Rekomendasi Kebijakan Fiskal</p>
          <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">{k.recommendation}</p>
        </section>

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

          <button
            onClick={() => onOpenScorecard?.(k.id)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 sm:py-2.5 bg-brand text-white rounded-lg text-xs sm:text-sm font-semibold shadow-card hover:bg-brand-dark transition-colors"
          >
            Buka Dashboard Pajak Wilayah
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

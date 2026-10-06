import { X, ArrowRight, Landmark } from './icons.jsx'

function formatRupiahFull(value) {
  if (value === 0 || value === '-' || !value) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value).replace(/\s+/g, ' ')
}

export default function KabupatenSummaryPanel({ kabupaten, onClose, onDrillDown, metric }) {
  if (!kabupaten) return null

  // Helper to calculate ratios or fetch from object
  const totalPajakNontunai = kabupaten.pajak.totalNontunai
  const rasioPajakNontunai = ((totalPajakNontunai / kabupaten.pajak.total) * 100).toFixed(2)
  const selisihPajak = kabupaten.pajak.total - totalPajakNontunai

  const totalRetribusiNontunai = kabupaten.retribusi.totalNontunai
  const rasioRetribusiNontunai = kabupaten.retribusi.rasioNontunai || ((totalRetribusiNontunai / kabupaten.retribusi.total) * 100).toFixed(2)
  const selisihRetribusi = kabupaten.retribusi.selisih || (kabupaten.retribusi.total - totalRetribusiNontunai)

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[90%] sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-[500px] bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-surface-border z-[550] overflow-y-auto transition-all animate-float-in flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-surface-border sticky top-0 z-10 shrink-0">
        <div>
          <p className="text-[10px] text-ink-300 uppercase tracking-wider font-bold">Ringkasan Wilayah</p>
          <h4 className="font-extrabold text-ink-900 leading-tight text-base sm:text-lg">
            Kabupaten {kabupaten.name}
          </h4>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 shrink-0 transition-colors">
          <X size={18} className="text-ink-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Utama PAD Card */}
        <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-3 shadow-md">
          {metric !== 'penerimaan' && (
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">PAD Total</p>
                <p className="text-sm sm:text-base font-bold text-emerald-400">
                  {formatRupiahFull(kabupaten.padTotal)}
                </p>
              </div>
              <Landmark size={20} className="text-slate-400" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Pajak + Retribusi Nontunai</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-100">
                {formatRupiahFull(kabupaten.pajakRetribusiNontunai)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Rasio Nontunai / PAD</p>
              <p className="text-xs sm:text-sm font-extrabold text-yellow-400">
                {kabupaten.rasio}%
              </p>
            </div>
          </div>
        </div>

        {/* Drill Down Action Button */}
        <button
          onClick={() => onDrillDown(kabupaten.name)}
          className="w-full flex items-center justify-between px-4 py-3 bg-brand text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-brand-dark transition-all duration-150 transform hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-2">
            Lihat Analisis Kecamatan {kabupaten.name}
          </span>
          <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">
            Detail <ArrowRight size={14} />
          </span>
        </button>

        {/* Comparison Tables: Pajak vs Retribusi */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-ink-900 uppercase tracking-wide">
            Breakdown Realisasi Penerimaan
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Column Pajak */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="border-b border-slate-200 pb-1.5 mb-1">
                <span className="text-xs font-extrabold text-blue-700 uppercase">Pajak</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-ink-800 text-[11px]">
                  <span>Total (Tunai+Nontunai):</span>
                </div>
                <div className="text-blue-800 font-bold mb-2">
                  {formatRupiahFull(kabupaten.pajak.total)}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Realisasi Per Kanal:</span>
                <table className="w-full text-[10px] text-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">QRIS</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.qris)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">Teller</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.teller)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">ATM</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.atm)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">EDC</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.edc)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">M-banking</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.mBanking)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">Agen Bank</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.agenBank)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">UE Reader</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.ueReader)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1">Ecommerce</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.pajak.kanal.ecommerce)}</td>
                    </tr>
                    <tr className="font-bold text-slate-800 bg-yellow-50/50">
                      <td className="py-1.5">Total Nontunai</td>
                      <td className="py-1.5 text-right text-blue-700">{formatRupiahFull(totalPajakNontunai)}</td>
                    </tr>
                    <tr className="text-slate-600">
                      <td className="py-1">Rasio Nontunai</td>
                      <td className="py-1 text-right font-bold">{rasioPajakNontunai}%</td>
                    </tr>
                    <tr className="text-slate-600">
                      <td className="py-1">Selisih Nontunai</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(selisihPajak)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column Retribusi */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="border-b border-slate-200 pb-1.5 mb-1">
                <span className="text-xs font-extrabold text-emerald-700 uppercase">Retribusi</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-ink-800 text-[11px]">
                  <span>Total (Tunai+Nontunai):</span>
                </div>
                <div className="text-emerald-800 font-bold mb-2">
                  {formatRupiahFull(kabupaten.retribusi.total)}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Realisasi Per Kanal:</span>
                <table className="w-full text-[10px] text-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">QRIS</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.qris)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">Teller</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.teller)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">ATM</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.atm)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">EDC</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.edc)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">M-banking</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.mBanking)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">Agen Bank</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.agenBank)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1">UE Reader</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.ueReader)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1">Ecommerce</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(kabupaten.retribusi.kanal.ecommerce)}</td>
                    </tr>
                    <tr className="font-bold text-slate-800 bg-yellow-50/50">
                      <td className="py-1.5">Total Nontunai</td>
                      <td className="py-1.5 text-right text-emerald-700">{formatRupiahFull(totalRetribusiNontunai)}</td>
                    </tr>
                    <tr className="text-slate-600">
                      <td className="py-1">Rasio Nontunai</td>
                      <td className="py-1 text-right font-bold">{rasioRetribusiNontunai}%</td>
                    </tr>
                    <tr className="text-slate-600">
                      <td className="py-1">Selisih Nontunai</td>
                      <td className="py-1 text-right font-medium">{formatRupiahFull(selisihRetribusi)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

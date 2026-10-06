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

export const PAJAK_PUSAT_SUMMARY = {
  '2024': {
    penerimaan: 641077660390, // Realisasi PPh Orang Pribadi: Rp 641.1 M
    wajibPajak: 10850,        // Total Bayar Pajak: 10.850 orang
    lapor: 115177566395,      // Total SDA / KLU: Rp 115.2 M
    bayar: 160269415097,      // PPh Badan UMKM: Rp 160.3 M
    pph21: 352592713215,
    pphOP: 128215532078,
    ppn: 961616490585,
    kepatuhan: 84.5,
    wpTerdaftar: 456280,
    topSectors: [
      { name: 'Administrasi Pemerintahan', value: 24726491422 },
      { name: 'Perdagangan Besar dan Eceran', value: 16087213266 },
      { name: 'Konstruksi & Real Estate', value: 7093641679 },
      { name: 'Industri Pengolahan', value: 4017892633 },
      { name: 'Transportasi & Pergudangan', value: 2192921301 },
      { name: 'Penyediaan Akomodasi & Mamin', value: 540684100 }
    ]
  },
  '2025': {
    penerimaan: 638283813809,
    wajibPajak: 10247,
    lapor: 58529127939,
    bayar: 159570953452,
    pph21: 351056097595,
    pphOP: 127656762762,
    ppn: 957425720713,
    kepatuhan: 86.2,
    wpTerdaftar: 468150,
    topSectors: [
      { name: 'Administrasi Pemerintahan', value: 17688288637 },
      { name: 'Perdagangan Besar dan Eceran', value: 16260997201 },
      { name: 'Industri Pengolahan', value: 5522425911 },
      { name: 'Konstruksi', value: 2400469471 },
      { name: 'Jasa Keuangan & Asuransi', value: 1587954073 },
      { name: 'Penyediaan Akomodasi & Mamin', value: 561592802 }
    ]
  },
  '2026': {
    penerimaan: 295400000000,
    wajibPajak: 3289,
    lapor: 28329171069,
    bayar: 73850000000,
    pph21: 162470000000,
    pphOP: 59080000000,
    ppn: 443100000000,
    kepatuhan: 72.8,
    wpTerdaftar: 472900,
    topSectors: [
      { name: 'Administrasi Pemerintahan', value: 10676868306 },
      { name: 'Perdagangan Besar dan Eceran', value: 7883935405 },
      { name: 'Industri Pengolahan', value: 2463384854 },
      { name: 'Konstruksi', value: 1506460988 },
      { name: 'Jasa Keuangan & Asuransi', value: 559597775 },
      { name: 'Penyediaan Akomodasi & Mamin', value: 294782137 }
    ]
  }
}

export default function KabupatenSummaryPanel({
  kabupaten,
  onClose,
  onDrillDown,
  metric,
  isDaerah = true,
  range = '2024'
}) {
  if (!kabupaten) return null

  // Mode Pajak Pemerintah Pusat (KPP Pratama Purwokerto)
  if (!isDaerah) {
    const pusatData = PAJAK_PUSAT_SUMMARY[range] || PAJAK_PUSAT_SUMMARY['2024']
    const kabName = kabupaten.name || 'Banyumas'

    let heroTitle = 'Total PPh Badan UMKM (KPP Pratama Purwokerto)'
    let heroValue = formatRupiahFull(pusatData.bayar)
    let heroShort = `Rp ${(pusatData.bayar / 1e9).toFixed(1)} M`
    let heroSub = 'Tarif PPh Final 0,5% PP 55/2022 · Usaha Mikro, Kecil & Menengah'
    let heroStat1Label = 'Realisasi PPh Orang Pribadi'
    let heroStat1Val = formatRupiahFull(pusatData.penerimaan)
    let heroStat2Label = 'Wajib Pajak Bayar'
    let heroStat2Val = `${new Intl.NumberFormat('id-ID').format(pusatData.wajibPajak)} orang`

    if (metric === 'penerimaan') {
      heroTitle = 'Realisasi PPh Orang Pribadi (KPP Pratama Purwokerto)'
      heroValue = formatRupiahFull(pusatData.penerimaan)
      heroShort = `Rp ${(pusatData.penerimaan / 1e9).toFixed(1)} M`
      heroSub = 'Pajak Penghasilan Karyawan & Usahawan Orang Pribadi di Banyumas'
      heroStat1Label = 'PPh Badan UMKM'
      heroStat1Val = formatRupiahFull(pusatData.bayar)
      heroStat2Label = 'Wajib Pajak Terdaftar'
      heroStat2Val = `${new Intl.NumberFormat('id-ID').format(pusatData.wpTerdaftar)} orang`
    } else if (metric === 'wajibPajak') {
      heroTitle = 'Total Wajib Pajak Bayar (KPP Pratama Purwokerto)'
      heroValue = `${new Intl.NumberFormat('id-ID').format(pusatData.wajibPajak)} Wajib Pajak`
      heroShort = `${new Intl.NumberFormat('id-ID').format(pusatData.wajibPajak)} orang`
      heroSub = 'Wajib Pajak Aktif yang Melakukan Pembayaran di Banyumas'
      heroStat1Label = 'Total PPh Terkumpul'
      heroStat1Val = formatRupiahFull(pusatData.penerimaan)
      heroStat2Label = 'Kepatuhan Lapor SPT'
      heroStat2Val = `${pusatData.kepatuhan}%`
    } else if (metric === 'lapor') {
      heroTitle = 'Total Penerimaan Sektor SDA & KLU Unggulan'
      heroValue = formatRupiahFull(pusatData.lapor)
      heroShort = `Rp ${(pusatData.lapor / 1e9).toFixed(1)} M`
      heroSub = 'Akumulasi Penerimaan Pajak dari Sektor Usaha Dominan Banyumas'
      heroStat1Label = 'PPh Badan UMKM'
      heroStat1Val = formatRupiahFull(pusatData.bayar)
      heroStat2Label = 'Sektor Terbesar'
      heroStat2Val = 'Administrasi Pemerintahan'
    }

    return (
      <div className="absolute inset-x-2 bottom-2 top-auto max-h-[90%] sm:inset-auto sm:top-3 sm:right-3 sm:bottom-3 sm:w-[500px] bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-surface-border z-[550] overflow-y-auto transition-all animate-float-in flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-surface-border sticky top-0 z-10 shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-blue-600 uppercase tracking-wider font-bold">
                Pajak Pemerintah Pusat (KPP Pratama)
              </p>
              <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                Tahun {range}
              </span>
            </div>
            <h4 className="font-extrabold text-ink-900 leading-tight text-base sm:text-lg">
              Kabupaten {kabName}
            </h4>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 shrink-0 transition-colors">
            <X size={18} className="text-ink-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Hero Card */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-3 shadow-md">
            <div className="border-b border-slate-800 pb-2.5">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {heroTitle}
              </p>
              <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                <p className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">
                  {heroValue}
                </p>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                  {heroShort}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                {heroSub}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-0.5">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">{heroStat1Label}</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                  {heroStat1Val}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">{heroStat2Label}</p>
                <p className="text-xs sm:text-sm font-extrabold text-yellow-400">
                  {heroStat2Val}
                </p>
              </div>
            </div>
          </div>

          {/* Drill Down Action Button */}
          <button
            onClick={() => onDrillDown(kabName)}
            className="w-full flex items-center justify-between px-4 py-3 bg-brand text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-brand-dark transition-all duration-150 transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              Lihat Analisis 27 Kecamatan {kabName}
            </span>
            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">
              Detail <ArrowRight size={14} />
            </span>
          </button>

          {/* Comparison / Breakdown Tables: PPh vs Sektor KLU */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-ink-900 uppercase tracking-wide">
              Breakdown Realisasi Pajak Pusat KPP Pratama
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Kolom PPh */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="border-b border-slate-200 pb-1.5 mb-1 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-700 uppercase">Pajak Penghasilan (PPh)</span>
                  <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">PPh Pusat</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-ink-800 text-[11px]">
                    <span>Total Realisasi PPh:</span>
                  </div>
                  <div className="text-blue-800 font-bold mb-2">
                    {formatRupiahFull(pusatData.penerimaan)}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Rincian Komponen Pajak:</span>
                  <table className="w-full text-[10px] text-slate-700">
                    <tbody>
                      <tr className={`border-b border-slate-100 ${metric === 'bayar' ? 'bg-amber-50 font-bold' : ''}`}>
                        <td className="py-1">
                          <span className="font-semibold text-slate-800">PPh Badan UMKM (PP 55)</span>
                          {metric === 'bayar' && <span className="ml-1 text-[8.5px] bg-amber-500 text-white px-1 rounded">Aktif</span>}
                        </td>
                        <td className="py-1 text-right font-bold text-amber-700">{formatRupiahFull(pusatData.bayar)}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">PPh Pasal 21 (Karyawan)</td>
                        <td className="py-1 text-right font-medium">{formatRupiahFull(pusatData.pph21)}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">PPh Orang Pribadi Non-Karyawan</td>
                        <td className="py-1 text-right font-medium">{formatRupiahFull(pusatData.pphOP)}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">Wajib Pajak Bayar Aktif</td>
                        <td className="py-1 text-right font-medium">{new Intl.NumberFormat('id-ID').format(pusatData.wajibPajak)} orang</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">Total WP Terdaftar</td>
                        <td className="py-1 text-right font-medium">{new Intl.NumberFormat('id-ID').format(pusatData.wpTerdaftar)} orang</td>
                      </tr>
                      <tr className="font-bold text-slate-800 bg-blue-50/50">
                        <td className="py-1.5">Tingkat Kepatuhan SPT</td>
                        <td className="py-1.5 text-right text-blue-700">{pusatData.kepatuhan}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kolom Sektor Dominan (KLU) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="border-b border-slate-200 pb-1.5 mb-1 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase">Sektor Dominan (KLU)</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">Pajak Sektor</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-ink-800 text-[11px]">
                    <span>Total Sektor Unggulan:</span>
                  </div>
                  <div className="text-emerald-800 font-bold mb-2">
                    {formatRupiahFull(pusatData.lapor)}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Realisasi per Lapangan Usaha:</span>
                  <table className="w-full text-[10px] text-slate-700">
                    <tbody>
                      {pusatData.topSectors.map((sector, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="py-1 truncate max-w-[120px]" title={sector.name}>{sector.name}</td>
                          <td className="py-1 text-right font-medium">{formatRupiahFull(sector.value)}</td>
                        </tr>
                      ))}
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

  // Mode Pajak Daerah (PAD, Pajak Daerah, Retribusi)
  const totalPajakNontunai = kabupaten.pajak?.totalNontunai || 0
  const rasioPajakNontunai = kabupaten.pajak?.total ? ((totalPajakNontunai / kabupaten.pajak.total) * 100).toFixed(2) : '0.00'
  const selisihPajak = (kabupaten.pajak?.total || 0) - totalPajakNontunai

  const totalRetribusiNontunai = kabupaten.retribusi?.totalNontunai || 0
  const rasioRetribusiNontunai = kabupaten.retribusi?.rasioNontunai || (kabupaten.retribusi?.total ? ((totalRetribusiNontunai / kabupaten.retribusi.total) * 100).toFixed(2) : '0.00')
  const selisihRetribusi = kabupaten.retribusi?.selisih || ((kabupaten.retribusi?.total || 0) - totalRetribusiNontunai)

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

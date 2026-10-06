const legendByMetric = {
  merchantDensity: {
    title: 'Kepadatan Merchant',
    gradient: 'from-[#2E7D32] via-[#FBC02D] to-[#5D4037]',
    low: 'Jarang',
    high: 'Padat'
  },
  transactionVolume: {
    title: 'Volume Transaksi',
    gradient: 'from-[#4CAF50] via-[#FBC02D] to-[#D32F2F]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  fraudRisk: {
    title: 'Risiko Fraud',
    gradient: 'from-[#388E3C] via-[#FBC02D] to-[#D32F2F]',
    low: 'Aman',
    high: 'Waspada'
  },
  // Pajak Daerah
  pbjt: {
    title: 'Potensi PBJT (Resto & Hotel)',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  pbb: {
    title: 'Potensi PBB-P2',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  bphtb: {
    title: 'Potensi BPHTB',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  // Pajak Pemerintah Pusat
  ppn: {
    title: 'Potensi PPN',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  pph: {
    title: 'Potensi PPh',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  kepatuhan: {
    title: 'Kepatuhan Pelaporan SPT',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Kurang',
    high: 'Patuh'
  },
  // Metrik Terpadu Pajak Daerah & Negara (Spreadsheet)
  penerimaan: {
    title: 'Realisasi Penerimaan Pajak',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  wajibPajak: {
    title: 'Jumlah Wajib Pajak',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Sedikit',
    high: 'Banyak'
  },
  lapor: {
    title: 'Kepatuhan Lapor SPT',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  },
  bayar: {
    title: 'Kepatuhan Pembayaran',
    gradient: 'from-[#D32F2F] via-[#FBC02D] to-[#4CAF50]',
    low: 'Rendah',
    high: 'Tinggi'
  }
}

const tierLegend = [
  { label: 'Kategori Prima', color: '#22B07D' },
  { label: 'Kategori Berkembang', color: '#F5A623' },
  { label: 'Kategori Awal', color: '#E85D2F' }
]

export default function HeatmapLegend({ metric, title }) {
  const cfg = legendByMetric[metric] || {
    title: metric ? metric.toUpperCase() : 'Metrik',
    gradient: 'from-[#4CAF50] via-[#FBC02D] to-[#D32F2F]',
    low: 'Rendah',
    high: 'Tinggi'
  }

  const displayTitle = title || cfg.title

  return (
    <div className="absolute left-2.5 sm:left-3 bottom-2.5 sm:bottom-3 flex flex-col gap-1.5 sm:gap-2 bg-white/95 backdrop-blur px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-medium text-ink-500 shadow-card z-[500] max-w-[calc(100%-20px)] sm:max-w-xs">
      <div className="flex items-center gap-2">
        <span className="text-ink-700 font-semibold truncate">{displayTitle}</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="shrink-0">{cfg.low}</span>
        <span className={`w-14 sm:w-20 h-1.5 rounded-full bg-gradient-to-r ${cfg.gradient} shrink-0`} />
        <span className="shrink-0">{cfg.high}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1.5 border-t border-surface-border mt-0.5 text-[9px] sm:text-[10px]">
        {tierLegend.map((t) => (
          <span key={t.label} className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
            <span>{t.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
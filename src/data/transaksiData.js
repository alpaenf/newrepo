// Mock data layer for the Transaksi (Transaction Monitoring) page.
// Di produksi diganti pemanggilan GET /api/transactions, GET /api/transactions/summary,
// GET /api/transactions/breakdown/method, dan GET /api/transactions/breakdown/zone.

export const transactionTypes = ['Pemasukan', 'Pengeluaran']

export const incomeCategories = ['Penjualan', 'Setoran Modal', 'Pelunasan Piutang', 'Pendapatan Lain']
export const expenseCategories = [
  'Belanja Stok',
  'Biaya Operasional',
  'Pembayaran Hutang',
  'Penarikan Pribadi',
  'Pajak',
  'Pengeluaran Lain'
]
export const allCategories = [...incomeCategories, ...expenseCategories]

// Metode pembayaran. Untuk E-Wallet, transaksi bisa datang dari QR Merchant BahLink
// ATAU dari e-wallet pihak ketiga yang sudah terdaftar sebagai penyedia QRIS
// (DANA, GoPay, OVO, ShopeePay, LinkAja) — ditandai lewat field `provider`.
export const paymentMethods = ['QRIS', 'Tunai', 'E-Wallet', 'Virtual Account', 'Transfer Bank']
export const eWalletProviders = ['DANA', 'GoPay', 'OVO', 'ShopeePay', 'LinkAja']

export const transactionStatuses = ['Berhasil', 'Pending', 'Gagal']

export const kecamatanList = [
  'Purwokerto Timur',
  'Purwokerto Barat',
  'Purwokerto Utara',
  'Purwokerto Selatan',
  'Sokaraja',
  'Baturraden',
  'Sumbang',
  'Kembaran',
  'Ajibarang'
]

export const statusBadge = {
  Berhasil: { bg: '#E3F7EE', color: '#22B07D' },
  Pending: { bg: '#FFF4E0', color: '#B9720A' },
  Gagal: { bg: '#FDEBEC', color: '#E30617' }
}

export const methodMeta = {
  QRIS: { color: '#E30617', provider: 'BahLink QR Merchant' },
  Tunai: { color: '#6B7280', provider: null },
  'E-Wallet': { color: '#2F5FE3', provider: 'pihak ketiga' },
  'Virtual Account': { color: '#F5A623', provider: null },
  'Transfer Bank': { color: '#22B07D', provider: null }
}

function buildTx({ id, dt, merchant, merchantId, kecamatan, type, category, method, provider, amount, status, note }) {
  return {
    id,
    datetime: dt,
    merchant,
    merchantId,
    kecamatan,
    type,
    category,
    method,
    provider: provider ?? null,
    amount,
    status,
    note: note ?? ''
  }
}

export const transactions = [
  buildTx({
    id: 'TRX-250718-0091',
    dt: '2026-07-18T08:24:00',
    merchant: 'Fore Coffee Purwokerto',
    merchantId: 'MCH-098765',
    kecamatan: 'Purwokerto Timur',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'QRIS',
    amount: 120000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250718-0088',
    dt: '2026-07-18T08:10:00',
    merchant: 'Kopi Kulo',
    merchantId: 'MCH-097812',
    kecamatan: 'Purwokerto Utara',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'E-Wallet',
    provider: 'GoPay',
    amount: 45000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250718-0085',
    dt: '2026-07-18T07:55:00',
    merchant: 'Roti Bakar 88',
    merchantId: 'MCH-096210',
    kecamatan: 'Sokaraja',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'Tunai',
    amount: 28000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250717-0512',
    dt: '2026-07-17T21:11:00',
    merchant: 'Mie Gacoan Purwokerto',
    merchantId: 'MCH-095120',
    kecamatan: 'Purwokerto Selatan',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'E-Wallet',
    provider: 'OVO',
    amount: 87000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250717-0498',
    dt: '2026-07-17T19:40:00',
    merchant: 'Janji Jiwa Purwokerto',
    merchantId: 'MCH-098234',
    kecamatan: 'Purwokerto Barat',
    type: 'Pengeluaran',
    category: 'Belanja Stok',
    method: 'Transfer Bank',
    amount: 2450000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250717-0470',
    dt: '2026-07-17T16:05:00',
    merchant: 'Kedai Angkringan Malam',
    merchantId: 'MCH-092345',
    kecamatan: 'Kembaran',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'QRIS',
    amount: 32000,
    status: 'Pending',
    note: 'Menunggu konfirmasi dari switching QRIS'
  }),
  buildTx({
    id: 'TRX-250717-0455',
    dt: '2026-07-17T14:22:00',
    merchant: 'Toko Sembako Makmur',
    merchantId: 'MCH-093456',
    kecamatan: 'Sumbang',
    type: 'Pemasukan',
    category: 'Setoran Modal',
    method: 'Virtual Account',
    amount: 5000000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250717-0440',
    dt: '2026-07-17T12:10:00',
    merchant: 'Fore Coffee Purwokerto',
    merchantId: 'MCH-098765',
    kecamatan: 'Purwokerto Timur',
    type: 'Pengeluaran',
    category: 'Biaya Operasional',
    method: 'Transfer Bank',
    amount: 850000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250717-0421',
    dt: '2026-07-17T10:48:00',
    merchant: 'Warung Bu Tini',
    merchantId: 'MCH-094087',
    kecamatan: 'Baturraden',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'E-Wallet',
    provider: 'DANA',
    amount: 15000,
    status: 'Gagal',
    note: 'Saldo e-wallet pembeli tidak mencukupi'
  }),
  buildTx({
    id: 'TRX-250717-0398',
    dt: '2026-07-17T09:33:00',
    merchant: 'Toko Retail Sinar Jaya',
    merchantId: 'MCH-091200',
    kecamatan: 'Ajibarang',
    type: 'Pengeluaran',
    category: 'Pembayaran Hutang',
    method: 'Transfer Bank',
    amount: 1200000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250716-0912',
    dt: '2026-07-16T20:15:00',
    merchant: 'Jahitan Bu Nani',
    merchantId: 'MCH-090011',
    kecamatan: 'Purwokerto Utara',
    type: 'Pemasukan',
    category: 'Pelunasan Piutang',
    method: 'Tunai',
    amount: 250000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250716-0888',
    dt: '2026-07-16T18:02:00',
    merchant: 'Kopi Kulo',
    merchantId: 'MCH-097812',
    kecamatan: 'Purwokerto Utara',
    type: 'Pengeluaran',
    category: 'Penarikan Pribadi',
    method: 'Virtual Account',
    amount: 500000,
    status: 'Pending',
    note: 'Verifikasi rekening tujuan sedang berjalan'
  }),
  buildTx({
    id: 'TRX-250716-0850',
    dt: '2026-07-16T15:41:00',
    merchant: 'Roti Bakar 88',
    merchantId: 'MCH-096210',
    kecamatan: 'Sokaraja',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'E-Wallet',
    provider: 'ShopeePay',
    amount: 63000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250716-0803',
    dt: '2026-07-16T13:12:00',
    merchant: 'Mie Gacoan Purwokerto',
    merchantId: 'MCH-095120',
    kecamatan: 'Purwokerto Selatan',
    type: 'Pengeluaran',
    category: 'Pajak',
    method: 'Transfer Bank',
    amount: 340000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250716-0777',
    dt: '2026-07-16T11:05:00',
    merchant: 'Warung Bu Tini',
    merchantId: 'MCH-094087',
    kecamatan: 'Baturraden',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'QRIS',
    amount: 9000,
    status: 'Gagal',
    note: 'QR non-standar — kemungkinan bukan QRIS resmi'
  }),
  buildTx({
    id: 'TRX-250715-0654',
    dt: '2026-07-15T22:30:00',
    merchant: 'Toko Sembako Makmur',
    merchantId: 'MCH-093456',
    kecamatan: 'Sumbang',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'E-Wallet',
    provider: 'LinkAja',
    amount: 21000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250715-0611',
    dt: '2026-07-15T17:48:00',
    merchant: 'Kedai Angkringan Malam',
    merchantId: 'MCH-092345',
    kecamatan: 'Kembaran',
    type: 'Pengeluaran',
    category: 'Belanja Stok',
    method: 'Tunai',
    amount: 415000,
    status: 'Berhasil'
  }),
  buildTx({
    id: 'TRX-250715-0580',
    dt: '2026-07-15T09:20:00',
    merchant: 'Janji Jiwa Purwokerto',
    merchantId: 'MCH-098234',
    kecamatan: 'Purwokerto Barat',
    type: 'Pemasukan',
    category: 'Penjualan',
    method: 'QRIS',
    amount: 54000,
    status: 'Berhasil'
  })
]

// Ringkasan atas halaman — di produksi dari GET /api/transactions/summary
export const transactionSummary = {
  totalTransactions: 245780,
  successCount: 242675,
  pendingCount: 1245,
  failedCount: 1860,
  averageValue: 187500
}

// Breakdown metode pembayaran (untuk donut) — di produksi dari
// GET /api/transactions/breakdown/method
export const methodBreakdown = [
  { name: 'QRIS', value: 62.1, color: '#E30617' },
  { name: 'E-Wallet', value: 21.4, color: '#2F5FE3' },
  { name: 'Virtual Account', value: 10.8, color: '#F5A623' },
  { name: 'Transfer Bank', value: 5.7, color: '#22B07D' }
]

// Breakdown volume transaksi per zona/kecamatan (untuk bar chart) — di produksi
// dari GET /api/transactions/breakdown/zone
export const zoneBreakdown = [
  { zone: 'Purwokerto Timur', volume: 48210 },
  { zone: 'Purwokerto Barat', volume: 41870 },
  { zone: 'Purwokerto Utara', volume: 33420 },
  { zone: 'Purwokerto Selatan', volume: 28650 },
  { zone: 'Sokaraja', volume: 19870 },
  { zone: 'Kembaran', volume: 16980 },
  { zone: 'Baturraden', volume: 15230 },
  { zone: 'Ajibarang', volume: 14120 },
  { zone: 'Sumbang', volume: 12440 }
]
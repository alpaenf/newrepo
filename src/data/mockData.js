// Mock data layer.
// In production this is replaced by calls to the Express/Prisma REST API
// (e.g. GET /api/dashboard/summary, GET /api/dashboard/trend, ...).

export const kpis = [
  {
    id: 'users',
    label: 'Total Pengguna',
    value: 128430,
    delta: 12.5,
    trend: 'up',
    icon: 'users',
    comparisonLabel: 'vs minggu lalu'
  },
  {
    id: 'merchants',
    label: 'Total Merchant',
    value: 6820,
    delta: 8.1,
    trend: 'up',
    icon: 'store',
    comparisonLabel: 'vs minggu lalu'
  },
  {
    id: 'transactions',
    label: 'Total Transaksi',
    value: 245780,
    delta: 15.3,
    trend: 'up',
    icon: 'arrows',
    comparisonLabel: 'vs minggu lalu'
  },
  {
    id: 'success',
    label: 'Transaksi Berhasil',
    value: 242675,
    delta: null,
    trend: null,
    icon: 'check',
    footnote: '98,7% dari total transaksi'
  },
  {
    id: 'pending',
    label: 'Transaksi Pending',
    value: 1245,
    delta: -4.6,
    trend: 'down',
    icon: 'clock',
    comparisonLabel: 'vs minggu lalu'
  },
  {
    id: 'fraud',
    label: 'Potensi Fraud',
    value: 32,
    delta: -11.1,
    trend: 'down',
    icon: 'shield',
    comparisonLabel: 'vs minggu lalu'
  }
]

export const trendData = [
  { date: '7 Jun', value: 9200 },
  { date: '8 Jun', value: 12800 },
  { date: '9 Jun', value: 16600 },
  { date: '10 Jun', value: 22100 },
  { date: '11 Jun', value: 28450 },
  { date: '12 Jun', value: 24700 },
  { date: '13 Jun', value: 31200 }
]

export const paymentMethods = [
  { name: 'QRIS', value: 62.1, color: '#E30617' },
  { name: 'E-Wallet', value: 21.4, color: '#2F5FE3' },
  { name: 'Virtual Account', value: 10.8, color: '#F5A623' },
  { name: 'Transfer Bank', value: 5.7, color: '#22B07D' }
]

export const totalTransactions = 245780

export const topMerchants = [
  { rank: 1, name: 'Fore Coffee Purwokerto', transactions: 12430, location: 'Purwokerto', initials: 'FC' },
  { rank: 2, name: 'Janji Jiwa Purwokerto', transactions: 8950, location: 'Purwokerto', initials: 'JJ' },
  { rank: 3, name: 'Kopi Kulo', transactions: 7430, location: 'Purwokerto', initials: 'KK' },
  { rank: 4, name: 'Roti Bakar 88', transactions: 6820, location: 'Purwokerto', initials: 'RB' },
  { rank: 5, name: 'Mie Gacoan', transactions: 5910, location: 'Purwokerto', initials: 'MG' }
]

export const activities = [
  {
    id: 1,
    type: 'transaction',
    title: 'Transaksi baru di Fore Coffee Purwokerto',
    detail: 'Rp 120.000',
    time: '2 menit yang lalu'
  },
  {
    id: 2,
    type: 'merchant',
    title: 'Merchant baru terdaftar: Kopi Kulo',
    detail: 'Merchant ID: MCH-098765',
    time: '15 menit yang lalu'
  },
  {
    id: 3,
    type: 'fraud',
    title: 'Peringatan potensi fraud terdeteksi',
    detail: 'ID: FRD-987654',
    time: '1 jam yang lalu'
  },
  {
    id: 4,
    type: 'withdrawal',
    title: 'Penarikan dana oleh Merchant Janji Jiwa',
    detail: 'Rp 5.000.000',
    time: '2 jam yang lalu'
  }
]

export const aiSuggestions = [
  'Wilayah mana dengan transaksi tertinggi minggu ini?',
  'Merchant dengan pertumbuhan transaksi tertinggi?',
  'Ringkasan transaksi 7 hari terakhir',
  'Apakah ada aktivitas mencurigakan hari ini?'
]

export const aiWelcomeMessage =
  'Halo Admin! Saya siap membantu menganalisis data dan memberikan insight untuk mendukung pengambilan keputusan.'

// 18 kecamatan Banyumas Raya — titik pusat koordinat disederhanakan untuk demo.
export const kecamatanHeatpoints = [
  { name: 'Purwokerto Timur', lat: -7.4247, lng: 109.2461, weight: 0.9 },
  { name: 'Purwokerto Barat', lat: -7.4235, lng: 109.2287, weight: 0.85 },
  { name: 'Purwokerto Utara', lat: -7.4109, lng: 109.2417, weight: 0.8 },
  { name: 'Purwokerto Selatan', lat: -7.4370, lng: 109.2360, weight: 0.75 },
  { name: 'Sokaraja', lat: -7.4370, lng: 109.2870, weight: 0.6 },
  { name: 'Baturraden', lat: -7.3138, lng: 109.2266, weight: 0.4 },
  { name: 'Sumbang', lat: -7.3612, lng: 109.2649, weight: 0.35 },
  { name: 'Kembaran', lat: -7.4276, lng: 109.2650, weight: 0.5 },
  { name: 'Kedungbanteng', lat: -7.3600, lng: 109.2100, weight: 0.3 },
  { name: 'Cilongok', lat: -7.3480, lng: 109.1730, weight: 0.3 },
  { name: 'Ajibarang', lat: -7.3900, lng: 109.0730, weight: 0.45 },
  { name: 'Wangon', lat: -7.4900, lng: 109.0450, weight: 0.35 },
  { name: 'Banyumas', lat: -7.5140, lng: 109.2900, weight: 0.4 },
  { name: 'Sumpiuh', lat: -7.5900, lng: 109.3450, weight: 0.25 },
  { name: 'Kroya (Cilacap)', lat: -7.6330, lng: 109.2450, weight: 0.55 },
  { name: 'Cilacap Tengah', lat: -7.7260, lng: 109.0140, weight: 0.5 },
  { name: 'Purbalingga', lat: -7.3890, lng: 109.3620, weight: 0.6 },
  { name: 'Klampok (Banjarnegara)', lat: -7.3660, lng: 109.4300, weight: 0.3 }
]

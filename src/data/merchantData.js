// Mock data layer for the Merchant page.
// In production this maps 1:1 to GET /api/merchants and GET /api/merchants/:id.

export const merchantCategories = [
  'Warung Kelontong',
  'Toko Sembako',
  'Kedai Makanan',
  'Coffee Shop',
  'Pedagang Kaki Lima',
  'Toko Retail',
  'Usaha Rumahan',
  'Lainnya'
]

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

export const verificationStatuses = ['Terverifikasi', 'Menunggu Verifikasi', 'Ditolak']
export const accountStatuses = ['Aktif', 'Nonaktif']

function bahScoreCategory(score) {
  if (score >= 90) return { label: 'Sangat Sehat', color: '#22B07D' }
  if (score >= 75) return { label: 'Sehat', color: '#3FA96C' }
  if (score >= 60) return { label: 'Cukup Sehat', color: '#F5A623' }
  if (score >= 40) return { label: 'Perlu Perhatian', color: '#E85D2F' }
  return { label: 'Berisiko', color: '#E30617' }
}

export { bahScoreCategory }

export const merchants = [
  {
    id: 'MCH-098765',
    name: 'Fore Coffee Purwokerto',
    owner: 'Dimas Prasetyo',
    category: 'Coffee Shop',
    kecamatan: 'Purwokerto Timur',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2025-11-02',
    transactions30d: 12430,
    bahScore: 92,
    phone: '0812-1122-3344',
    address: 'Jl. Jenderal Sudirman No. 45, Purwokerto Timur'
  },
  {
    id: 'MCH-098234',
    name: 'Janji Jiwa Purwokerto',
    owner: 'Rani Kusuma',
    category: 'Coffee Shop',
    kecamatan: 'Purwokerto Barat',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2025-09-18',
    transactions30d: 8950,
    bahScore: 88,
    phone: '0813-2233-4455',
    address: 'Jl. Gerilya No. 12, Purwokerto Barat'
  },
  {
    id: 'MCH-097812',
    name: 'Kopi Kulo',
    owner: 'Agus Setiawan',
    category: 'Coffee Shop',
    kecamatan: 'Purwokerto Utara',
    verificationStatus: 'Menunggu Verifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2026-06-30',
    transactions30d: 7430,
    bahScore: 74,
    phone: '0857-6677-8899',
    address: 'Jl. Prof. Suharso No. 8, Purwokerto Utara'
  },
  {
    id: 'MCH-096210',
    name: 'Roti Bakar 88',
    owner: 'Siti Nur Halimah',
    category: 'Kedai Makanan',
    kecamatan: 'Sokaraja',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2025-05-21',
    transactions30d: 6820,
    bahScore: 81,
    phone: '0821-3344-5566',
    address: 'Jl. Raya Sokaraja No. 21'
  },
  {
    id: 'MCH-095120',
    name: 'Mie Gacoan Purwokerto',
    owner: 'Bayu Aji Nugroho',
    category: 'Kedai Makanan',
    kecamatan: 'Purwokerto Selatan',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2025-08-04',
    transactions30d: 5910,
    bahScore: 79,
    phone: '0838-4455-6677',
    address: 'Jl. HR Bunyamin No. 3, Purwokerto Selatan'
  },
  {
    id: 'MCH-094087',
    name: 'Warung Bu Tini',
    owner: 'Tini Wahyuni',
    category: 'Warung Kelontong',
    kecamatan: 'Baturraden',
    verificationStatus: 'Ditolak',
    accountStatus: 'Nonaktif',
    joinedAt: '2026-04-11',
    transactions30d: 320,
    bahScore: 38,
    phone: '0812-9988-7766',
    address: 'Jl. Raya Baturraden No. 55'
  },
  {
    id: 'MCH-093456',
    name: 'Toko Sembako Makmur',
    owner: 'Hendra Wijaya',
    category: 'Toko Sembako',
    kecamatan: 'Sumbang',
    verificationStatus: 'Menunggu Verifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2026-07-01',
    transactions30d: 1560,
    bahScore: 56,
    phone: '0857-1122-3344',
    address: 'Jl. Sumbang Raya No. 9'
  },
  {
    id: 'MCH-092345',
    name: 'Kedai Angkringan Malam',
    owner: 'Yusuf Ramadhan',
    category: 'Pedagang Kaki Lima',
    kecamatan: 'Kembaran',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2025-12-19',
    transactions30d: 3210,
    bahScore: 68,
    phone: '0813-5566-7788',
    address: 'Jl. Kembaran No. 17'
  },
  {
    id: 'MCH-091200',
    name: 'Toko Retail Sinar Jaya',
    owner: 'Lestari Handayani',
    category: 'Toko Retail',
    kecamatan: 'Ajibarang',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Nonaktif',
    joinedAt: '2025-03-27',
    transactions30d: 980,
    bahScore: 47,
    phone: '0821-6677-8899',
    address: 'Jl. Ajibarang Kota No. 2'
  },
  {
    id: 'MCH-090011',
    name: 'Jahitan Bu Nani',
    owner: 'Nani Suryani',
    category: 'Usaha Rumahan',
    kecamatan: 'Purwokerto Utara',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    joinedAt: '2025-10-08',
    transactions30d: 410,
    bahScore: 71,
    phone: '0812-4433-2211',
    address: 'Gg. Melati No. 6, Purwokerto Utara'
  }
]

// Riwayat tren transaksi untuk grafik pada panel detail merchant.
export const merchantTrend = [
  { date: '11 Jun', value: 210 },
  { date: '12 Jun', value: 260 },
  { date: '13 Jun', value: 240 },
  { date: '14 Jun', value: 310 },
  { date: '15 Jun', value: 355 },
  { date: '16 Jun', value: 300 },
  { date: '17 Jun', value: 390 }
]

// Riwayat BahScore untuk panel detail merchant.
export const merchantBahScoreHistory = [
  { date: '13 Jun', score: 84 },
  { date: '14 Jun', score: 85 },
  { date: '15 Jun', score: 87 },
  { date: '16 Jun', score: 90 },
  { date: '17 Jun', score: 92 }
]

// Riwayat verifikasi QR untuk panel detail merchant.
export const merchantVerificationHistory = [
  { id: 1, label: 'QR merchant disetujui', status: 'success', date: '2025-11-02 09:14' },
  { id: 2, label: 'Validasi format EMV QR lolos', status: 'success', date: '2025-11-02 09:12' },
  { id: 3, label: 'Geolokasi cocok dengan alamat usaha', status: 'success', date: '2025-11-02 09:10' },
  { id: 4, label: 'Dokumen pendaftaran diunggah', status: 'neutral', date: '2025-11-01 18:40' }
]
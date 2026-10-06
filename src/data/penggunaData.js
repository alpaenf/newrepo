// Mock data layer for the Pengguna (User Management) page.
// Di produksi diganti pemanggilan GET /api/users dan GET /api/users/:id/activity-log.

export const roles = ['Pemilik Usaha', 'Staf', 'Kasir']

// Catatan: "Menunggu Verifikasi" ditambahkan di luar 3 status inti (Aktif/Nonaktif/Diblokir)
// karena aksi "Verifikasi akun baru" pada spesifikasi mensyaratkan adanya status pending.
export const accountStatuses = ['Aktif', 'Nonaktif', 'Diblokir', 'Menunggu Verifikasi']

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

export const roleBadge = {
  'Pemilik Usaha': { bg: '#FDEBEC', color: '#E30617' },
  Staf: { bg: '#EAF1FF', color: '#2F5FE3' },
  Kasir: { bg: '#FFF4E0', color: '#B9720A' }
}

export const statusBadge = {
  Aktif: { bg: '#E3F7EE', color: '#22B07D' },
  Nonaktif: { bg: '#F1F2F4', color: '#6B7280' },
  Diblokir: { bg: '#FDEBEC', color: '#E30617' },
  'Menunggu Verifikasi': { bg: '#FFF4E0', color: '#B9720A' }
}

export const users = [
  {
    id: 'USR-10234',
    name: 'Dimas Prasetyo',
    email: 'dimas.prasetyo@gmail.com',
    phone: '0812-1122-3344',
    merchant: 'Fore Coffee Purwokerto',
    merchantId: 'MCH-098765',
    kecamatan: 'Purwokerto Timur',
    role: 'Pemilik Usaha',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-17T08:12:00',
    registeredAt: '2025-11-02',
    devices: 2
  },
  {
    id: 'USR-10235',
    name: 'Wulan Aprilia',
    email: 'wulan.aprilia@gmail.com',
    phone: '0813-9988-1122',
    merchant: 'Fore Coffee Purwokerto',
    merchantId: 'MCH-098765',
    kecamatan: 'Purwokerto Timur',
    role: 'Kasir',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-18T06:40:00',
    registeredAt: '2025-11-10',
    devices: 1
  },
  {
    id: 'USR-10190',
    name: 'Rani Kusuma',
    email: 'rani.kusuma@gmail.com',
    phone: '0813-2233-4455',
    merchant: 'Janji Jiwa Purwokerto',
    merchantId: 'MCH-098234',
    kecamatan: 'Purwokerto Barat',
    role: 'Pemilik Usaha',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-16T19:05:00',
    registeredAt: '2025-09-18',
    devices: 1
  },
  {
    id: 'USR-10191',
    name: 'Fajar Nugraha',
    email: 'fajar.n@gmail.com',
    phone: '0857-3344-5566',
    merchant: 'Janji Jiwa Purwokerto',
    merchantId: 'MCH-098234',
    kecamatan: 'Purwokerto Barat',
    role: 'Staf',
    accountStatus: 'Nonaktif',
    lastLoginAt: '2026-06-02T14:20:00',
    registeredAt: '2025-10-01',
    devices: 1
  },
  {
    id: 'USR-10088',
    name: 'Agus Setiawan',
    email: 'agus.setiawan@gmail.com',
    phone: '0857-6677-8899',
    merchant: 'Kopi Kulo',
    merchantId: 'MCH-097812',
    kecamatan: 'Purwokerto Utara',
    role: 'Pemilik Usaha',
    accountStatus: 'Menunggu Verifikasi',
    lastLoginAt: '2026-07-15T10:02:00',
    registeredAt: '2026-06-30',
    devices: 1
  },
  {
    id: 'USR-10077',
    name: 'Siti Nur Halimah',
    email: 'siti.nurhalimah@gmail.com',
    phone: '0821-3344-5566',
    merchant: 'Roti Bakar 88',
    merchantId: 'MCH-096210',
    kecamatan: 'Sokaraja',
    role: 'Pemilik Usaha',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-17T21:11:00',
    registeredAt: '2025-05-21',
    devices: 2
  },
  {
    id: 'USR-10078',
    name: 'Reza Firmansyah',
    email: 'reza.firmansyah@gmail.com',
    phone: '0838-2211-3344',
    merchant: 'Roti Bakar 88',
    merchantId: 'MCH-096210',
    kecamatan: 'Sokaraja',
    role: 'Kasir',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-18T07:55:00',
    registeredAt: '2025-06-14',
    devices: 1
  },
  {
    id: 'USR-09950',
    name: 'Bayu Aji Nugroho',
    email: 'bayu.aji@gmail.com',
    phone: '0838-4455-6677',
    merchant: 'Mie Gacoan Purwokerto',
    merchantId: 'MCH-095120',
    kecamatan: 'Purwokerto Selatan',
    role: 'Pemilik Usaha',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-14T12:30:00',
    registeredAt: '2025-08-04',
    devices: 1
  },
  {
    id: 'USR-09811',
    name: 'Tini Wahyuni',
    email: 'tini.wahyuni@gmail.com',
    phone: '0812-9988-7766',
    merchant: 'Warung Bu Tini',
    merchantId: 'MCH-094087',
    kecamatan: 'Baturraden',
    role: 'Pemilik Usaha',
    accountStatus: 'Diblokir',
    lastLoginAt: '2026-05-30T09:00:00',
    registeredAt: '2026-04-11',
    devices: 3
  },
  {
    id: 'USR-09802',
    name: 'Hendra Wijaya',
    email: 'hendra.wijaya@gmail.com',
    phone: '0857-1122-3344',
    merchant: 'Toko Sembako Makmur',
    merchantId: 'MCH-093456',
    kecamatan: 'Sumbang',
    role: 'Pemilik Usaha',
    accountStatus: 'Menunggu Verifikasi',
    lastLoginAt: '2026-07-01T16:45:00',
    registeredAt: '2026-07-01',
    devices: 1
  },
  {
    id: 'USR-09760',
    name: 'Yusuf Ramadhan',
    email: 'yusuf.ramadhan@gmail.com',
    phone: '0813-5566-7788',
    merchant: 'Kedai Angkringan Malam',
    merchantId: 'MCH-092345',
    kecamatan: 'Kembaran',
    role: 'Pemilik Usaha',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-17T23:15:00',
    registeredAt: '2025-12-19',
    devices: 1
  },
  {
    id: 'USR-09761',
    name: 'Putri Amelia',
    email: 'putri.amelia@gmail.com',
    phone: '0821-7788-9900',
    merchant: 'Kedai Angkringan Malam',
    merchantId: 'MCH-092345',
    kecamatan: 'Kembaran',
    role: 'Staf',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-16T20:05:00',
    registeredAt: '2026-01-08',
    devices: 1
  },
  {
    id: 'USR-09640',
    name: 'Lestari Handayani',
    email: 'lestari.h@gmail.com',
    phone: '0821-6677-8899',
    merchant: 'Toko Retail Sinar Jaya',
    merchantId: 'MCH-091200',
    kecamatan: 'Ajibarang',
    role: 'Pemilik Usaha',
    accountStatus: 'Nonaktif',
    lastLoginAt: '2026-04-20T11:00:00',
    registeredAt: '2025-03-27',
    devices: 1
  },
  {
    id: 'USR-09521',
    name: 'Nani Suryani',
    email: 'nani.suryani@gmail.com',
    phone: '0812-4433-2211',
    merchant: 'Jahitan Bu Nani',
    merchantId: 'MCH-090011',
    kecamatan: 'Purwokerto Utara',
    role: 'Pemilik Usaha',
    accountStatus: 'Aktif',
    lastLoginAt: '2026-07-13T15:30:00',
    registeredAt: '2025-10-08',
    devices: 1
  }
]

// Riwayat aktivitas per pengguna — dipakai pada Activity Log Drawer.
// Di produksi berasal dari GET /api/users/:id/activity-log (audit trail terbatas,
// tidak menampilkan nilai finansial individual, hanya jenis aksi & waktu).
export const activityLogs = {
  'USR-10234': [
    { id: 1, action: 'Login ke aplikasi mobile', device: 'iPhone 13 · Purwokerto', time: '2026-07-17 08:12' },
    { id: 2, action: 'Mencatat transaksi pemasukan', device: 'iPhone 13 · Purwokerto', time: '2026-07-17 08:20' },
    { id: 3, action: 'Mengunduh laporan Laba Rugi (PDF)', device: 'iPhone 13 · Purwokerto', time: '2026-07-16 19:40' },
    { id: 4, action: 'Menambahkan staf baru: Wulan Aprilia', device: 'iPhone 13 · Purwokerto', time: '2025-11-10 09:15' },
    { id: 5, action: 'Registrasi akun & verifikasi usaha', device: 'iPhone 13 · Purwokerto', time: '2025-11-02 09:00' }
  ],
  'USR-10235': [
    { id: 1, action: 'Login ke aplikasi mobile', device: 'Android · Purwokerto', time: '2026-07-18 06:40' },
    { id: 2, action: 'Mencatat transaksi QRIS', device: 'Android · Purwokerto', time: '2026-07-18 06:45' },
    { id: 3, action: 'Diundang sebagai Kasir oleh Dimas Prasetyo', device: '—', time: '2025-11-10 09:16' }
  ],
  'USR-09811': [
    { id: 1, action: 'Login dari 3 perangkat berbeda dalam 24 jam', device: 'Multi-device', time: '2026-05-30 08:40' },
    { id: 2, action: 'Akun diblokir sistem — indikasi perangkat mencurigakan', device: '—', time: '2026-05-30 09:00' },
    { id: 3, action: 'Registrasi akun', device: 'Android · Baturraden', time: '2026-04-11 10:00' }
  ]
}

export function getActivityLog(userId) {
  return (
    activityLogs[userId] ?? [
      { id: 1, action: 'Registrasi akun', device: '—', time: '—' },
      { id: 2, action: 'Belum ada aktivitas tercatat lainnya', device: '—', time: '—' }
    ]
  )
}

// Ringkasan atas halaman — di produksi dari GET /api/users/summary
export const userSummary = {
  totalUsers: 128430,
  activeLast7d: 86210,
  newThisMonth: 4380,
  growthPct: 12.5
}
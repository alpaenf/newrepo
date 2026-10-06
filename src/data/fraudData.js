// Mock data layer for the Fraud Monitoring page.
// Di produksi diganti pemanggilan GET /api/fraud/cases dan GET /api/fraud/cases/:id.

export const indicationTypes = [
  'GPS Tidak Cocok',
  'QR Non-QRIS',
  'Indikasi Foto dari Galeri',
  'Device Dipakai Berulang',
  'Transaksi Nominal Ganjil Berulang',
  'Kecepatan Transaksi Tidak Wajar'
]

export const priorityLevels = ['Tinggi', 'Sedang', 'Rendah']
export const caseStatuses = ['Baru', 'Sedang Ditinjau', 'Disetujui', 'Ditolak']

export const priorityBadge = {
  Tinggi: { bg: '#FDEBEC', color: '#E30617' },
  Sedang: { bg: '#FFF4E0', color: '#B9720A' },
  Rendah: { bg: '#EAF1FF', color: '#2F5FE3' }
}

export const statusBadge = {
  Baru: { bg: '#F1F2F4', color: '#6B7280' },
  'Sedang Ditinjau': { bg: '#FFF4E0', color: '#B9720A' },
  Disetujui: { bg: '#E3F7EE', color: '#22B07D' },
  Ditolak: { bg: '#FDEBEC', color: '#E30617' }
}

export const adminList = ['Admin Bahlink', 'Rangga Wibisono', 'Dewi Anggraini', 'Belum Ditugaskan']

function buildCase(c) {
  return { note: '', ...c }
}

export const fraudCases = [
  buildCase({
    id: 'FRD-987654',
    merchant: 'Warung Bu Tini',
    merchantId: 'MCH-094087',
    kecamatan: 'Baturraden',
    indication: 'Device Dipakai Berulang',
    priority: 'Tinggi',
    status: 'Sedang Ditinjau',
    detectedAt: '2026-07-16T09:00:00',
    assignedTo: 'Admin Bahlink',
    evidence: {
      gps: {
        registered: { lat: -7.3138, lng: 109.2266, label: 'Jl. Raya Baturraden No. 55' },
        submitted: { lat: -7.298, lng: 109.211, label: 'Perumahan di luar Baturraden' },
        distanceMeters: 2380
      },
      qrDecode: { valid: true, standard: 'EMV QRIS', merchantIdMatch: true },
      deviceHistory: [
        { device: 'Android · Redmi 10', usedByMerchants: 3, lastSeen: '2026-07-16 08:40' },
        { device: 'Android · Redmi 10', usedByMerchants: 3, lastSeen: '2026-05-30 09:00' },
        { device: 'Android · Redmi 10', usedByMerchants: 3, lastSeen: '2026-04-11 10:00' }
      ]
    },
    systemRecommendation:
      'Perangkat yang sama terdeteksi dipakai untuk mendaftarkan 3 merchant berbeda dalam 3 bulan terakhir. Rekomendasi: tolak sementara & minta verifikasi identitas tambahan.'
  }),
  buildCase({
    id: 'FRD-987321',
    merchant: 'Kedai Angkringan Malam',
    merchantId: 'MCH-092345',
    kecamatan: 'Kembaran',
    indication: 'GPS Tidak Cocok',
    priority: 'Sedang',
    status: 'Baru',
    detectedAt: '2026-07-17T16:05:00',
    assignedTo: 'Belum Ditugaskan',
    evidence: {
      gps: {
        registered: { lat: -7.4276, lng: 109.265, label: 'Jl. Kembaran No. 17' },
        submitted: { lat: -7.421, lng: 109.278, label: '±1,4 km dari alamat terdaftar' },
        distanceMeters: 1450
      },
      qrDecode: { valid: true, standard: 'EMV QRIS', merchantIdMatch: true },
      deviceHistory: [{ device: 'Android · Samsung A14', usedByMerchants: 1, lastSeen: '2026-07-17 16:00' }]
    },
    systemRecommendation:
      'Selisih jarak masih dalam ambang wajar untuk pedagang kaki lima yang berpindah lokasi. Rekomendasi: konfirmasi via telepon sebelum eskalasi.'
  }),
  buildCase({
    id: 'FRD-986110',
    merchant: 'Toko Sembako Makmur',
    merchantId: 'MCH-093456',
    kecamatan: 'Sumbang',
    indication: 'QR Non-QRIS',
    priority: 'Tinggi',
    status: 'Baru',
    detectedAt: '2026-07-17T14:22:00',
    assignedTo: 'Belum Ditugaskan',
    evidence: {
      gps: {
        registered: { lat: -7.3612, lng: 109.2649, label: 'Jl. Sumbang Raya No. 9' },
        submitted: { lat: -7.3612, lng: 109.2649, label: 'Sesuai alamat terdaftar' },
        distanceMeters: 40
      },
      qrDecode: { valid: false, standard: 'Tidak dikenali (bukan struktur EMV QR)', merchantIdMatch: false },
      deviceHistory: [{ device: 'Android · Vivo Y17', usedByMerchants: 1, lastSeen: '2026-07-17 14:20' }]
    },
    systemRecommendation:
      'QR yang diunggah gagal di-decode sebagai struktur EMV QRIS standar. Kemungkinan QR bukan dari penyedia QRIS resmi. Rekomendasi: tolak & minta unggah ulang QR resmi dari bank/PJP.'
  }),
  buildCase({
    id: 'FRD-985920',
    merchant: 'Roti Bakar 88',
    merchantId: 'MCH-096210',
    kecamatan: 'Sokaraja',
    indication: 'Indikasi Foto dari Galeri',
    priority: 'Sedang',
    status: 'Sedang Ditinjau',
    detectedAt: '2026-07-15T11:30:00',
    assignedTo: 'Dewi Anggraini',
    evidence: {
      gps: { registered: null, submitted: null, distanceMeters: null },
      qrDecode: { valid: true, standard: 'EMV QRIS', merchantIdMatch: true },
      deviceHistory: [{ device: 'iPhone 12', usedByMerchants: 1, lastSeen: '2026-07-15 11:28' }]
    },
    systemRecommendation:
      'Metadata foto verifikasi tidak memiliki data GPS real-time (kemungkinan diunggah dari galeri, bukan diambil langsung). Rekomendasi: minta pengambilan ulang foto lewat kamera in-app.',
    note: 'Sudah dihubungi via telepon, merchant akan unggah ulang foto verifikasi besok pagi.'
  }),
  buildCase({
    id: 'FRD-985004',
    merchant: 'Mie Gacoan Purwokerto',
    merchantId: 'MCH-095120',
    kecamatan: 'Purwokerto Selatan',
    indication: 'Kecepatan Transaksi Tidak Wajar',
    priority: 'Rendah',
    status: 'Disetujui',
    detectedAt: '2026-07-10T20:00:00',
    resolvedAt: '2026-07-11T09:15:00',
    assignedTo: 'Rangga Wibisono',
    evidence: {
      gps: {
        registered: { lat: -7.437, lng: 109.236, label: 'Jl. HR Bunyamin No. 3' },
        submitted: { lat: -7.437, lng: 109.236, label: 'Sesuai alamat terdaftar' },
        distanceMeters: 0
      },
      qrDecode: { valid: true, standard: 'EMV QRIS', merchantIdMatch: true },
      deviceHistory: [{ device: 'Android · Oppo A78', usedByMerchants: 1, lastSeen: '2026-07-11 09:00' }]
    },
    systemRecommendation:
      '18 transaksi dalam 5 menit terdeteksi saat jam makan siang. Pola ini wajar untuk restoran ramai. Rekomendasi: setujui, tandai sebagai false positive untuk kalibrasi model.',
    note: 'Dikonfirmasi wajar — jam makan siang ramai, video CCTV internal merchant mendukung.'
  }),
  buildCase({
    id: 'FRD-984880',
    merchant: 'Jahitan Bu Nani',
    merchantId: 'MCH-090011',
    kecamatan: 'Purwokerto Utara',
    indication: 'Transaksi Nominal Ganjil Berulang',
    priority: 'Rendah',
    status: 'Ditolak',
    detectedAt: '2026-07-08T10:00:00',
    resolvedAt: '2026-07-09T13:40:00',
    assignedTo: 'Admin Bahlink',
    evidence: {
      gps: {
        registered: { lat: -7.4109, lng: 109.2417, label: 'Gg. Melati No. 6, Purwokerto Utara' },
        submitted: { lat: -7.4109, lng: 109.2417, label: 'Sesuai alamat terdaftar' },
        distanceMeters: 0
      },
      qrDecode: { valid: true, standard: 'EMV QRIS', merchantIdMatch: true },
      deviceHistory: [{ device: 'Android · Infinix Hot 30', usedByMerchants: 1, lastSeen: '2026-07-09 13:00' }]
    },
    systemRecommendation:
      'Nominal transaksi berulang Rp1.000 terdeteksi 40+ kali dalam sehari — pola mirip uji coba/testing. Rekomendasi: tinjau manual sebelum memutuskan.',
    note: 'Setelah dikonfirmasi, merchant sedang menguji fitur QR baru untuk pelanggan. Kasus ditutup, tidak ada indikasi fraud.'
  }),
  buildCase({
    id: 'FRD-984210',
    merchant: 'Toko Retail Sinar Jaya',
    merchantId: 'MCH-091200',
    kecamatan: 'Ajibarang',
    indication: 'GPS Tidak Cocok',
    priority: 'Tinggi',
    status: 'Sedang Ditinjau',
    detectedAt: '2026-07-14T09:33:00',
    assignedTo: 'Rangga Wibisono',
    evidence: {
      gps: {
        registered: { lat: -7.39, lng: 109.073, label: 'Jl. Ajibarang Kota No. 2' },
        submitted: { lat: -7.633, lng: 109.245, label: '±31 km dari alamat terdaftar (area Kroya)' },
        distanceMeters: 31200
      },
      qrDecode: { valid: true, standard: 'EMV QRIS', merchantIdMatch: true },
      deviceHistory: [
        { device: 'Android · Samsung A34', usedByMerchants: 1, lastSeen: '2026-07-14 09:30' },
        { device: 'Android · Samsung A34', usedByMerchants: 1, lastSeen: '2026-07-10 15:10' }
      ]
    },
    systemRecommendation:
      'Jarak 31 km antara lokasi terdaftar dan lokasi verifikasi terbaru melebihi ambang wajar. Rekomendasi: tolak sementara & minta merchant verifikasi ulang lokasi usaha.'
  }),
  buildCase({
    id: 'FRD-983560',
    merchant: 'Kopi Kulo',
    merchantId: 'MCH-097812',
    kecamatan: 'Purwokerto Utara',
    indication: 'Device Dipakai Berulang',
    priority: 'Sedang',
    status: 'Baru',
    detectedAt: '2026-07-16T18:02:00',
    assignedTo: 'Belum Ditugaskan',
    evidence: {
      gps: {
        registered: { lat: -7.4109, lng: 109.2417, label: 'Jl. Prof. Suharso No. 8' },
        submitted: { lat: -7.4109, lng: 109.2417, label: 'Sesuai alamat terdaftar' },
        distanceMeters: 15
      },
      qrDecode: { valid: true, standard: 'EMV QRIS', merchantIdMatch: true },
      deviceHistory: [
        { device: 'Android · Redmi Note 12', usedByMerchants: 2, lastSeen: '2026-07-16 18:00' },
        { device: 'Android · Redmi Note 12', usedByMerchants: 2, lastSeen: '2026-06-30 09:00' }
      ]
    },
    systemRecommendation:
      'Perangkat yang sama juga dipakai untuk mendaftarkan merchant lain di kecamatan berbeda. Rekomendasi: verifikasi hubungan kepemilikan sebelum disetujui.'
  })
]

// Ringkasan atas halaman — di produksi dari GET /api/fraud/cases/summary
export function computeFraudSummary(cases) {
  const active = cases.filter((c) => c.status === 'Baru' || c.status === 'Sedang Ditinjau')
  const highPriorityActive = active.filter((c) => c.priority === 'Tinggi')
  const resolvedThisMonth = cases.filter((c) => c.status === 'Disetujui' || c.status === 'Ditolak')

  const resolutionDurations = resolvedThisMonth
    .filter((c) => c.resolvedAt)
    .map((c) => (new Date(c.resolvedAt) - new Date(c.detectedAt)) / (1000 * 60 * 60))
  const avgResolutionHours = resolutionDurations.length
    ? Math.round((resolutionDurations.reduce((s, h) => s + h, 0) / resolutionDurations.length) * 10) / 10
    : 0

  return {
    totalActive: active.length,
    highPriorityActive: highPriorityActive.length,
    resolvedThisMonth: resolvedThisMonth.length,
    avgResolutionHours
  }
}
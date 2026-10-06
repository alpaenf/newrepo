// Mock data layer untuk halaman Potensi Ekspor.
// Di produksi ini berasal dari GET /api/ekspor/umkm (Express/Prisma REST API).

export function tierFromReadiness(score) {
  if (score >= 75) return { label: 'Siap Ekspor', color: '#22B07D' }
  if (score >= 50) return { label: 'Potensial', color: '#F5A623' }
  return { label: 'Perlu Pendampingan', color: '#E85D2F' }
}

// weight/skor 40-95, tersebar merata di 4 kabupaten Banyumas Raya.
const base = [
  // ===== Banyumas =====
  { name: 'Gula Semut Alami "Rasa Nusantara"', owner: 'Slamet Riyadi', phone: '0812-3344-5566', regency: 'Banyumas', kecamatan: 'Cilongok', lat: -7.3472, lng: 109.1741, komoditas: 'Gula Semut', hsCode: '1702.90', volume: 1500, satuan: 'kg/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 80000000 }, sertifikasi: ['Halal', 'SNI'], negaraTujuan: ['Malaysia', 'Singapura'], nilaiEkspor: 350000000, history: [{ tahun: 2025, negara: 'Malaysia', volume: '12.000 kg', nilai: 280000000 }, { tahun: 2024, negara: 'Malaysia', volume: '9.000 kg', nilai: 190000000 }], score: 88, omzet: 45000000 },
  { name: 'Kopi Robusta "Gunung Selamet"', owner: 'Budi Hartono', phone: '0813-5566-7788', regency: 'Banyumas', kecamatan: 'Baturraden', lat: -7.3130, lng: 109.2279, komoditas: 'Kopi', hsCode: '0901.21', volume: 800, satuan: 'kg/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 60000000 }, sertifikasi: ['Halal', 'SNI'], negaraTujuan: ['Malaysia', 'Australia'], nilaiEkspor: 220000000, history: [{ tahun: 2025, negara: 'Malaysia', volume: '6.500 kg', nilai: 170000000 }, { tahun: 2024, negara: 'Australia', volume: '3.000 kg', nilai: 95000000 }], score: 82, omzet: 38000000 },
  { name: 'Keripik Pisang "Jaya Rasa"', owner: 'Sri Wahyuni', phone: '0857-6677-8899', regency: 'Banyumas', kecamatan: 'Sokaraja', lat: -7.4362, lng: 109.2881, komoditas: 'Keripik', hsCode: '2006.00', volume: 600, satuan: 'kg/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 40000000 }, sertifikasi: ['Halal', 'PIRT'], negaraTujuan: ['Singapura'], nilaiEkspor: 90000000, history: [{ tahun: 2025, negara: 'Singapura', volume: '4.500 kg', nilai: 75000000 }], score: 66, omzet: 25000000 },
  { name: 'Batik Sekar Arum', owner: 'Endang Purwanti', phone: '0821-3344-5566', regency: 'Banyumas', kecamatan: 'Sokaraja', lat: -7.4380, lng: 109.2855, komoditas: 'Batik', hsCode: '5208.52', volume: 300, satuan: 'pcs/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['SNI'], negaraTujuan: ['Malaysia'], nilaiEkspor: 120000000, history: [{ tahun: 2024, negara: 'Malaysia', volume: '1.800 pcs', nilai: 95000000 }], score: 58, omzet: 35000000 },
  { name: 'Mendoan Kering "Mendoan Banyumas"', owner: 'Teguh Santoso', phone: '0838-4455-6677', regency: 'Banyumas', kecamatan: 'Purwokerto Barat', lat: -7.4227, lng: 109.2279, komoditas: 'Makanan Ringan', hsCode: '1905.90', volume: 700, satuan: 'kg/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 45000000 }, sertifikasi: ['Halal', 'PIRT'], negaraTujuan: ['Malaysia'], nilaiEkspor: 60000000, history: [{ tahun: 2025, negara: 'Malaysia', volume: '4.000 kg', nilai: 55000000 }], score: 71, omzet: 30000000 },
  { name: 'Anyaman Mendong "Rengganis Craft"', owner: 'Nani Suryani', phone: '0812-4433-2211', regency: 'Banyumas', kecamatan: 'Purwokerto Timur', lat: -7.4240, lng: 109.2472, komoditas: 'Kerajinan', hsCode: '4602.11', volume: 500, satuan: 'pcs/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: [], negaraTujuan: [], nilaiEkspor: 0, history: [], score: 45, omzet: 20000000 },
  { name: 'Madu Hutan "Tawon Emas"', owner: 'Joko Prasetyo', phone: '0812-7788-9900', regency: 'Banyumas', kecamatan: 'Sumbang', lat: -7.3604, lng: 109.2658, komoditas: 'Madu', hsCode: '0409.00', volume: 300, satuan: 'liter/bulan', pendanaan: { status: 'Sudah', sumber: 'PNM Mekaar', jumlah: 30000000 }, sertifikasi: ['Halal'], negaraTujuan: ['Malaysia'], nilaiEkspor: 45000000, history: [{ tahun: 2025, negara: 'Malaysia', volume: '2.000 liter', nilai: 40000000 }], score: 68, omzet: 28000000 },
  { name: 'Gula Aren "Manis Alami"', owner: 'Warsito', phone: '0813-9900-1122', regency: 'Banyumas', kecamatan: 'Wangon', lat: -7.4892, lng: 109.0460, komoditas: 'Gula Semut', hsCode: '1702.90', volume: 900, satuan: 'kg/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['Halal'], negaraTujuan: ['Singapura'], nilaiEkspor: 0, history: [], score: 49, omzet: 30000000 },
  { name: 'Kopi Robusta "Gunung Kelir"', owner: 'Agus Setiawan', phone: '0857-1122-3344', regency: 'Banyumas', kecamatan: 'Wangon', lat: -7.4915, lng: 109.0438, komoditas: 'Kopi', hsCode: '0901.11', volume: 600, satuan: 'kg/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['Halal'], negaraTujuan: ['Malaysia'], nilaiEkspor: 0, history: [], score: 47, omzet: 25000000 },

  // ===== Cilacap =====
  { name: 'Bandeng Presto "Banyu Biru"', owner: 'Rina Kusmawati', phone: '0821-2233-4455', regency: 'Cilacap', kecamatan: 'Cilacap Selatan', lat: -7.7372, lng: 109.0261, komoditas: 'Olahan Ikan', hsCode: '1604.20', volume: 2500, satuan: 'ekor/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 75000000 }, sertifikasi: ['Halal', 'HACCP'], negaraTujuan: ['Singapura'], nilaiEkspor: 180000000, history: [{ tahun: 2025, negara: 'Singapura', volume: '18.000 ekor', nilai: 150000000 }, { tahun: 2024, negara: 'Singapura', volume: '12.000 ekor', nilai: 100000000 }], score: 78, omzet: 55000000 },
  { name: 'Terasi & Rebon "Sari Laut"', owner: 'Mulyadi', phone: '0812-6655-7788', regency: 'Cilacap', kecamatan: 'Kroya', lat: -7.6322, lng: 109.2461, komoditas: 'Olahan Ikan', hsCode: '1605.40', volume: 800, satuan: 'kg/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['Halal', 'PIRT'], negaraTujuan: ['Malaysia', 'Hong Kong'], nilaiEkspor: 0, history: [], score: 55, omzet: 40000000 },
  { name: 'Udang Olahan "Sea Queen"', owner: 'Hendra Wijaya', phone: '0838-7766-5544', regency: 'Cilacap', kecamatan: 'Cilacap Tengah', lat: -7.7252, lng: 109.0151, komoditas: 'Olahan Ikan', hsCode: '1605.21', volume: 1500, satuan: 'kg/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 180000000 }, sertifikasi: ['HACCP', 'SNI'], negaraTujuan: ['Jepang', 'Amerika Serikat'], nilaiEkspor: 900000000, history: [{ tahun: 2025, negara: 'Jepang', volume: '12.000 kg', nilai: 650000000 }, { tahun: 2024, negara: 'Jepang', volume: '9.000 kg', nilai: 480000000 }, { tahun: 2023, negara: 'Amerika Serikat', volume: '5.000 kg', nilai: 320000000 }], score: 90, omzet: 150000000 },
  { name: 'Sirup Jahe "Jahe Merah Cap Kencana"', owner: 'Lestari Handayani', phone: '0812-8899-0011', regency: 'Cilacap', kecamatan: 'Majenang', lat: -7.2972, lng: 108.7621, komoditas: 'Minuman Herbal', hsCode: '2202.99', volume: 900, satuan: 'botol/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 35000000 }, sertifikasi: ['Halal', 'BPOM'], negaraTujuan: ['Singapura', 'Malaysia'], nilaiEkspor: 85000000, history: [{ tahun: 2025, negara: 'Singapura', volume: '6.000 botol', nilai: 70000000 }], score: 72, omzet: 30000000 },

  // ===== Purbalingga =====
  { name: 'Bulu Mata Palsu "CV Lash Purbalingga"', owner: 'Fitriani Rahayu', phone: '0813-4455-6677', regency: 'Purbalingga', kecamatan: 'Purbalingga', lat: -7.3882, lng: 109.3631, komoditas: 'Bulu Mata Palsu', hsCode: '6704.19', volume: 50000, satuan: 'pcs/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 250000000 }, sertifikasi: ['SNI', 'ISO 9001'], negaraTujuan: ['Amerika Serikat', 'Jerman', 'Inggris'], nilaiEkspor: 1800000000, history: [{ tahun: 2025, negara: 'Amerika Serikat', volume: '450.000 pcs', nilai: 1400000000 }, { tahun: 2024, negara: 'Jerman', volume: '250.000 pcs', nilai: 700000000 }, { tahun: 2024, negara: 'Inggris', volume: '150.000 pcs', nilai: 420000000 }], score: 95, omzet: 350000000 },
  { name: 'Wig & Rambut Palsu "CV Wig Jaya"', owner: 'Bambang Supriyadi', phone: '0857-2233-4455', regency: 'Purbalingga', kecamatan: 'Purbalingga', lat: -7.3898, lng: 109.3610, komoditas: 'Rambut Palsu', hsCode: '6704.20', volume: 8000, satuan: 'pcs/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 150000000 }, sertifikasi: ['SNI'], negaraTujuan: ['Amerika Serikat', 'Afrika Selatan'], nilaiEkspor: 750000000, history: [{ tahun: 2025, negara: 'Amerika Serikat', volume: '70.000 pcs', nilai: 600000000 }, { tahun: 2024, negara: 'Afrika Selatan', volume: '30.000 pcs', nilai: 180000000 }], score: 85, omzet: 180000000 },
  { name: 'Bulu Mata Palsu "CV Cantik Mata"', owner: 'Dewi Lestari', phone: '0812-7788-9900', regency: 'Purbalingga', kecamatan: 'Bobotsari', lat: -7.2462, lng: 109.3571, komoditas: 'Bulu Mata Palsu', hsCode: '6704.19', volume: 30000, satuan: 'pcs/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['SNI'], negaraTujuan: ['Amerika Serikat'], nilaiEkspor: 0, history: [], score: 62, omzet: 120000000 },
  { name: 'Keripik Singkong "Kripik Pak Slamet"', owner: 'Slamet Widodo', phone: '0838-5566-7788', regency: 'Purbalingga', kecamatan: 'Bukateja', lat: -7.4312, lng: 109.4221, komoditas: 'Keripik', hsCode: '2005.99', volume: 800, satuan: 'kg/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['Halal', 'PIRT'], negaraTujuan: ['Malaysia'], nilaiEkspor: 0, history: [], score: 53, omzet: 35000000 },

  // ===== Banjarnegara =====
  { name: 'Teh Hijau "Kalibening"', owner: 'Siti Nurhalimah', phone: '0812-3344-5566', regency: 'Banjarnegara', kecamatan: 'Kalibening', lat: -7.2172, lng: 109.6441, komoditas: 'Teh', hsCode: '0902.10', volume: 2000, satuan: 'kg/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 70000000 }, sertifikasi: ['SNI', 'HACCP'], negaraTujuan: ['Singapura', 'Jepang'], nilaiEkspor: 260000000, history: [{ tahun: 2025, negara: 'Singapura', volume: '16.000 kg', nilai: 190000000 }, { tahun: 2024, negara: 'Jepang', volume: '8.000 kg', nilai: 120000000 }], score: 79, omzet: 40000000 },
  { name: 'Teh Melati "Melati Banjarnegara"', owner: 'Kurniawan', phone: '0857-6677-8899', regency: 'Banjarnegara', kecamatan: 'Banjarnegara', lat: -7.3952, lng: 109.6981, komoditas: 'Teh', hsCode: '0902.30', volume: 1500, satuan: 'kg/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 50000000 }, sertifikasi: ['SNI'], negaraTujuan: ['Singapura'], nilaiEkspor: 140000000, history: [{ tahun: 2025, negara: 'Singapura', volume: '10.000 kg', nilai: 120000000 }], score: 74, omzet: 30000000 },
  { name: 'Keramik Seni "Keramik Klampok"', owner: 'Yusuf Ramadhan', phone: '0813-9900-1122', regency: 'Banjarnegara', kecamatan: 'Klampok', lat: -7.3652, lng: 109.4311, komoditas: 'Keramik', hsCode: '6914.10', volume: 1200, satuan: 'pcs/bulan', pendanaan: { status: 'Sudah', sumber: 'KUR BRI', jumlah: 100000000 }, sertifikasi: ['SNI'], negaraTujuan: ['Malaysia', 'Singapura'], nilaiEkspor: 210000000, history: [{ tahun: 2025, negara: 'Malaysia', volume: '9.000 pcs', nilai: 160000000 }, { tahun: 2024, negara: 'Singapura', volume: '5.000 pcs', nilai: 90000000 }], score: 76, omzet: 45000000 },
  { name: 'Genteng Keramik "Sokka Baru"', owner: 'Suparman', phone: '0812-2233-4455', regency: 'Banjarnegara', kecamatan: 'Mandiraja', lat: -7.3702, lng: 109.5111, komoditas: 'Keramik', hsCode: '6905.10', volume: 15000, satuan: 'pcs/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['SNI'], negaraTujuan: ['Malaysia'], nilaiEkspor: 0, history: [], score: 52, omzet: 60000000 },
  { name: 'Jamu & Empon-Empon "Herbal Jatilawang"', owner: 'Wiwik Handayani', phone: '0821-5566-7788', regency: 'Banjarnegara', kecamatan: 'Mandiraja', lat: -7.3718, lng: 109.5090, komoditas: 'Minuman Herbal', hsCode: '0910.30', volume: 1200, satuan: 'kg/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: ['Halal', 'BPOM'], negaraTujuan: ['Malaysia', 'Brunei'], nilaiEkspor: 0, history: [], score: 57, omzet: 25000000 },
  { name: 'Batik Tulis "Batik Langgeng"', owner: 'Sugeng Riyanto', phone: '0838-1122-3344', regency: 'Banjarnegara', kecamatan: 'Banjarnegara', lat: -7.3968, lng: 109.6959, komoditas: 'Batik', hsCode: '5208.42', volume: 200, satuan: 'pcs/bulan', pendanaan: { status: 'Belum', sumber: '', jumlah: 0 }, sertifikasi: [], negaraTujuan: [], nilaiEkspor: 0, history: [], score: 41, omzet: 30000000 }
]

export const exportUmkm = base.map((u, i) => {
  const tier = tierFromReadiness(u.score)
  return {
    id: `UMK-${String(i + 1).padStart(3, '0')}`,
    name: u.name,
    owner: u.owner,
    phone: u.phone,
    regency: u.regency,
    kecamatan: u.kecamatan,
    lat: u.lat,
    lng: u.lng,
    komoditas: u.komoditas,
    hsCode: u.hsCode,
    volumeProduksi: u.volume,
    satuanProduksi: u.satuan,
    pendanaan: u.pendanaan,
    sertifikasi: u.sertifikasi,
    negaraTujuan: u.negaraTujuan,
    nilaiEkspor: u.nilaiEkspor,
    omzet: u.omzet,
    historyExport: u.history,
    readinessScore: u.score,
    tier: tier.label,
    tierColor: tier.color,
    googleMapsUrl: `https://www.google.com/maps/place/${encodeURIComponent(u.name)}/@${u.lat},${u.lng},17z`,
    recommendation:
      u.score >= 75
        ? 'Pertahankan kualitas dan sertifikasi, jaga konsistensi volume, serta perluas diversifikasi negara tujuan ekspor.'
        : u.score >= 50
        ? 'Tingkatkan kesiapan: lengkapi sertifikasi, stabilkan kapasitas produksi, dan fasilitasi akses pembiayaan.'
        : 'Perlu pendampingan: bantu proses sertifikasi, akses pembiayaan, serta perbaikan kemasan dan legalitas ekspor.'
  }
})

export const komoditasOptions = ['Semua', ...new Set(exportUmkm.map((u) => u.komoditas))]

export const kabupatenOptions = ['Semua', 'Banjarnegara', 'Banyumas', 'Cilacap', 'Purbalingga', 'Lainnya']

export const pendanaanStatusOptions = ['Semua', 'Sudah', 'Belum']

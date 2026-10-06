// Data zonasi untuk halaman Heatmap.
// Di produksi ini berasal dari GET /api/heatmap/kecamatan?metric=&range=

function tierFromScore(score) {
  if (score >= 75) return { label: 'Prime Zone', color: '#22B07D' }
  if (score >= 50) return { label: 'Growth Zone', color: '#F5A623' }
  return { label: 'Basic Zone', color: '#E85D2F' }
}

// weight: 0-1, dipakai sebagai basis untuk menurunkan metrik lain secara konsisten.
const base = [
  // Banyumas
  { name: 'Purwokerto Timur', regency: 'Banyumas', lat: -7.4247, lng: 109.2461, weight: 0.92, merchants: 812, fraudRisk: 0.18, dominantIndustry: 'Kuliner & Kafe' },
  { name: 'Purwokerto Barat', regency: 'Banyumas', lat: -7.4235, lng: 109.2287, weight: 0.86, merchants: 745, fraudRisk: 0.22, dominantIndustry: 'Perdagangan Retail' },
  { name: 'Purwokerto Utara', regency: 'Banyumas', lat: -7.4109, lng: 109.2417, weight: 0.80, merchants: 690, fraudRisk: 0.15, dominantIndustry: 'Jasa & Pendidikan' },
  { name: 'Purwokerto Selatan', regency: 'Banyumas', lat: -7.4370, lng: 109.2360, weight: 0.75, merchants: 655, fraudRisk: 0.20, dominantIndustry: 'Industri Kreatif' },
  { name: 'Sokaraja', regency: 'Banyumas', lat: -7.4370, lng: 109.2870, weight: 0.60, merchants: 410, fraudRisk: 0.28, dominantIndustry: 'Batik & Makanan Khas' },
  { name: 'Baturraden', regency: 'Banyumas', lat: -7.3138, lng: 109.2266, weight: 0.40, merchants: 210, fraudRisk: 0.12, dominantIndustry: 'Pariwisata & Hotel' },
  { name: 'Sumbang', regency: 'Banyumas', lat: -7.3612, lng: 109.2649, weight: 0.35, merchants: 188, fraudRisk: 0.16, dominantIndustry: 'Pertanian & Peternakan' },
  { name: 'Kembaran', regency: 'Banyumas', lat: -7.4276, lng: 109.2650, weight: 0.50, merchants: 265, fraudRisk: 0.19, dominantIndustry: 'Perdagangan & Jasa' },
  { name: 'Cilongok', regency: 'Banyumas', lat: -7.3480, lng: 109.1730, weight: 0.30, merchants: 145, fraudRisk: 0.14, dominantIndustry: 'Pertanian & Gula Semut' },
  { name: 'Ajibarang', regency: 'Banyumas', lat: -7.3900, lng: 109.0730, weight: 0.45, merchants: 240, fraudRisk: 0.24, dominantIndustry: 'Transportasi & Jasa' },
  { name: 'Banyumas', regency: 'Banyumas', lat: -7.5140, lng: 109.2900, weight: 0.40, merchants: 205, fraudRisk: 0.21, dominantIndustry: 'Kerajinan & Kuliner' },
  { name: 'Wangon', regency: 'Banyumas', lat: -7.4900, lng: 109.0450, weight: 0.35, merchants: 175, fraudRisk: 0.17, dominantIndustry: 'Ritel & Logistik' },

  // Cilacap
  { name: 'Cilacap Tengah', regency: 'Cilacap', lat: -7.7260, lng: 109.0140, weight: 0.50, merchants: 275, fraudRisk: 0.26, dominantIndustry: 'Maritim & Perdagangan' },
  { name: 'Cilacap Selatan', regency: 'Cilacap', lat: -7.7380, lng: 109.0250, weight: 0.65, merchants: 390, fraudRisk: 0.22, dominantIndustry: 'Industri & Perikanan' },
  { name: 'Kroya (Cilacap)', regency: 'Cilacap', lat: -7.6330, lng: 109.2450, weight: 0.55, merchants: 320, fraudRisk: 0.30, dominantIndustry: 'Perdagangan Grosir' },
  { name: 'Majenang', regency: 'Cilacap', lat: -7.2980, lng: 108.7610, weight: 0.48, merchants: 215, fraudRisk: 0.18, dominantIndustry: 'Ritel & Pertanian' },
  { name: 'Sidareja', regency: 'Cilacap', lat: -7.4830, lng: 108.8030, weight: 0.42, merchants: 190, fraudRisk: 0.15, dominantIndustry: 'Pertanian & Perdagangan' },

  // Purbalingga
  { name: 'Purbalingga', regency: 'Purbalingga', lat: -7.3890, lng: 109.3620, weight: 0.60, merchants: 385, fraudRisk: 0.23, dominantIndustry: 'Industri Bulu Mata & Rambut' },
  { name: 'Padamara', regency: 'Purbalingga', lat: -7.3750, lng: 109.3250, weight: 0.45, merchants: 220, fraudRisk: 0.14, dominantIndustry: 'Kuliner & Kerajinan' },
  { name: 'Bobotsari', regency: 'Purbalingga', lat: -7.2470, lng: 109.3560, weight: 0.52, merchants: 295, fraudRisk: 0.20, dominantIndustry: 'Grosir & Transportasi' },
  { name: 'Bukateja', regency: 'Purbalingga', lat: -7.4320, lng: 109.4210, weight: 0.38, merchants: 165, fraudRisk: 0.12, dominantIndustry: 'Pertanian & Ritel' },

  // Banjarnegara
  { name: 'Banjarnegara', regency: 'Banjarnegara', lat: -7.3960, lng: 109.6970, weight: 0.58, merchants: 340, fraudRisk: 0.21, dominantIndustry: 'Kerajinan Keramik & Kuliner' },
  { name: 'Klampok (Banjarnegara)', regency: 'Banjarnegara', lat: -7.3660, lng: 109.4300, weight: 0.45, merchants: 210, fraudRisk: 0.16, dominantIndustry: 'Industri Keramik & Genteng' },
  { name: 'Mandiraja', regency: 'Banjarnegara', lat: -7.3710, lng: 109.5100, weight: 0.40, merchants: 185, fraudRisk: 0.13, dominantIndustry: 'Pertanian & Ritel' },
  { name: 'Kalibening', regency: 'Banjarnegara', lat: -7.2180, lng: 109.6430, weight: 0.32, merchants: 130, fraudRisk: 0.10, dominantIndustry: 'Perkebunan Teh & Sayur' }
]

export const kecamatanZonation = base.map((k, i) => {
  const zonationScore = Math.round(k.weight * 100)
  const tier = tierFromScore(zonationScore)
  const qrisAdoption = Math.round(55 + k.weight * 40)
  const transactionVolume7d = Math.round(k.weight * 32000 + k.merchants * 8)
  const transactionVolume30d = Math.round(transactionVolume7d * 4.1)
  const transactionVolumeMonthly = Math.round(transactionVolume7d * 4.3)
  const growthPct = Math.round((k.weight * 18 - k.fraudRisk * 10) * 10) / 10

  return {
    id: `KEC-${String(i + 1).padStart(2, '0')}`,
    name: k.name,
    regency: k.regency,
    dominantIndustry: k.dominantIndustry,
    lat: k.lat,
    lng: k.lng,
    tier: tier.label,
    tierColor: tier.color,
    zonationScore,
    // bobot 0-1 dipakai langsung sebagai heatmap-weight per metrik
    metricWeights: {
      merchantDensity: k.weight,
      transactionVolume: Math.min(1, transactionVolume7d / 30000),
      fraudRisk: k.fraudRisk
    },
    indicators: {
      merchants: k.merchants,
      qrisAdoption,
      transactionVolume7d,
      transactionVolume30d,
      transactionVolumeMonthly,
      fraudRisk: k.fraudRisk,
      growthPct
    },
    recommendation:
      zonationScore >= 75
        ? 'Pertahankan momentum: jadikan kecamatan ini percontohan replikasi 3S (Simplifikasi, Standarisasi, Sistemisasi) untuk kecamatan Growth Zone di sekitarnya.'
        : zonationScore >= 50
        ? 'Tingkatkan adopsi QRIS lewat edukasi merchant baru dan percepat verifikasi pendaftar agar naik ke Prime Zone.'
        : 'Perlu intervensi aktif: onboarding merchant tambahan, pendampingan pencatatan transaksi, dan pemantauan fraud lebih ketat.'
  }
})

export const metricOptions = [
  { key: 'merchantDensity', label: 'Kepadatan Merchant' },
  { key: 'transactionVolume', label: 'Volume Transaksi' },
  { key: 'fraudRisk', label: 'Risiko Fraud' }
]

export const timeRangeOptions = [
  { key: '2026', label: 'Tahun 2026' },
  { key: '2025', label: 'Tahun 2025' },
  { key: '2024', label: 'Tahun 2024' },
  { key: '2023', label: 'Tahun 2023' },
  { key: '2022', label: 'Tahun 2022' },
  { key: '2021', label: 'Tahun 2021' },
  { key: '2020', label: 'Tahun 2020' },
  { key: '2019', label: 'Tahun 2019' },
  { key: '2018', label: 'Tahun 2018' },
  { key: '2017', label: 'Tahun 2017' }
]
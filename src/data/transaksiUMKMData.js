// Mock data layer for the Transaksi UMKM (UMKM Transaction Analytics) page.
// Di produksi diganti pemanggilan GET /api/transaksi/umkm/summary,
// GET /api/transaksi/umkm/kecamatan?kabupaten=&range=, dan
// GET /api/transaksi/umkm/trend?range=.
//
// Data diturunkan konsisten dari kecamatanZonation (heatmapData.js) supaya angka
// lintas halaman selalu konsisten.

import { kecamatanZonation } from './heatmapData.js'

export const kabupatenList = ['Banjarnegara', 'Banyumas', 'Cilacap', 'Purbalingga']

export const rangeOptions = [
  { key: '30d', label: '30 Hari' },
  { key: '90d', label: '90 Hari' },
  { key: '12m', label: '12 Bulan' }
]

export const bulanLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// ---- Deret data per kecamatan ----
export const umkmKecamatan = kecamatanZonation.map((k) => {
  const w = k.zonationScore / 100
  const totalTransaksi = k.indicators.transactionVolumeMonthly
  const transactionWeight = k.metricWeights.transactionVolume
  const avgTicket = 65000 + Math.round(transactionWeight * 55000)
  const jumlahUMKM = Math.round(k.indicators.merchants * 6.5)
  const omsetBulanan = totalTransaksi * avgTicket
  const mikro = Math.round(jumlahUMKM * (0.62 + w * 0.06))
  const kecil = Math.round(jumlahUMKM * (0.24 - w * 0.03))
  const menengah = jumlahUMKM - mikro - kecil

  return {
    id: k.id,
    kabupaten: k.regency,
    kecamatan: k.name.replace(' (Cilacap)', ''),
    sektorDominan: k.dominantIndustry,
    jumlahUMKM,
    totalTransaksi,
    avgTicket,
    omsetBulanan,
    rataOmsetPerUMKM: Math.round(omsetBulanan / jumlahUMKM),
    pertumbuhan: k.indicators.growthPct,
    klasifikasi: { mikro, kecil, menengah },
    metode: {
      QRIS: Math.round(58 + w * 18),
      'E-Wallet': 16,
      Tunai: Math.round(18 - w * 8),
      'Virtual Account': 5,
      'Transfer Bank': 3
    }
  }
})

// ---- Agregasi rata-rata omset per kabupaten (tampilan "general") ----
export const kabupatenOmset = kabupatenList.map((kab) => {
  const rows = umkmKecamatan.filter((k) => k.kabupaten === kab)
  const totalOmset = rows.reduce((s, r) => s + r.omsetBulanan, 0)
  const totalUmkm = rows.reduce((s, r) => s + r.jumlahUMKM, 0)
  const totalTx = rows.reduce((s, r) => s + r.totalTransaksi, 0)
  return {
    kabupaten: kab,
    jumlahUMKM: totalUmkm,
    totalTransaksi: totalTx,
    omsetBulanan: totalOmset,
    rataOmsetPerUMKM: Math.round(totalOmset / totalUmkm),
    pertumbuhan: Math.round((rows.reduce((s, r) => s + r.pertumbuhan, 0) / rows.length) * 10) / 10
  }
})

// ---- Distribusi metode pembayaran agregat (untuk donut) ----
const METODE_KEYS = ['QRIS', 'E-Wallet', 'Tunai', 'Virtual Account', 'Transfer Bank']
export const metodeBreakdown = (() => {
  const avg = METODE_KEYS.map((m) => ({
    name: m,
    value: umkmKecamatan.reduce((s, r) => s + (r.metode[m] ?? 0), 0) / umkmKecamatan.length
  }))
  const total = avg.reduce((s, a) => s + a.value, 0)
  return avg.map((a) => ({ name: a.name, value: Math.round((a.value / total) * 100) }))
})()

// ---- Tren omset bulanan per kabupaten (Rp, full rupiah) ----
const kabBaseOmset = kabupatenOmset.reduce((acc, k) => ({ ...acc, [k.kabupaten]: k.omsetBulanan }), {})

export const trendOmset = bulanLabels.map((bulan, i) => {
  const row = { bulan }
  kabupatenList.forEach((kab) => {
    const season = 1 + 0.16 * Math.sin((i + 3) / 12 * Math.PI * 2) + 0.02 * i
    row[kab] = Math.round((kabBaseOmset[kab] * season) / 1e6) * 1e6
  })
  return row
})

// ---- KPI agregat platform ----
export const umkmSummary = kabupatenOmset.reduce(
  (acc, k) => ({
    totalUmkm: acc.totalUmkm + k.jumlahUMKM,
    totalTransaksi: acc.totalTransaksi + k.totalTransaksi,
    totalOmset: acc.totalOmset + k.omsetBulanan,
    pertumbuhan: acc.pertumbuhan + k.pertumbuhan * k.omsetBulanan
  }),
  { totalUmkm: 0, totalTransaksi: 0, totalOmset: 0, pertumbuhan: 0 }
)
umkmSummary.rataOmsetPerUMKM = Math.round(umkmSummary.totalOmset / umkmSummary.totalUmkm)
umkmSummary.pertumbuhan = Math.round((umkmSummary.pertumbuhan / umkmSummary.totalOmset) * 10) / 10

// ---- Detail daftar UMKM per kecamatan (untuk panel klik per daerah) ----
// Di produksi berasal dari GET /api/transaksi/umkm/:kecamatanId/merchants
const BIDANG = [
  'Kuliner', 'Kuliner', 'Retail', 'Retail', 'Jasa', 'Kerajinan', 'Kuliner', 'Jasa', 'Retail', 'Kerajinan'
]
const PEMILIK = ['Bu Tini', 'Pak Sarno', 'Mbak Rina', 'Mas Joko', 'Bu Sri', 'Pak Ahmad', 'Mbak Dewi', 'Mas Bambang', 'Bu Endah', 'Pak Hendra']
const BISNIS = [
  'Warung Makan', 'Kafe', 'Toko Kelontong', 'Butik & Busana', 'Laundry', 'Bengkel', 'Penjahit', 'Pangkas Rambut',
  'Toko Roti & Kue', 'Agen Pulsa', 'Salon', 'Fotokopi', 'Pedagang Pasar', 'Produsen Kerajinan', 'Kuliner Khas', 'Jasa Reparasi'
]

// Deterministic variance dari index untuk menjaga angka stabil antar render.
const variance = (i, salt = 0) => ((i * 7 + salt * 3) % 9) / 5 - 0.8 // -0.8 .. +0.8

export function getUmkmMerchants(kecamatanRow, limit = 8) {
  const baseOmset = kecamatanRow.rataOmsetPerUMKM
  const baseTx = Math.max(1, Math.round(kecamatanRow.totalTransaksi / Math.max(1, kecamatanRow.jumlahUMKM)))
  const salt = (kecamatanRow.id?.charCodeAt(kecamatanRow.id.length - 1) || 0) % 9

  const merchants = []
  for (let i = 0; i < limit; i++) {
    const biduangIdx = (i + salt) % BISNIS.length
    const ownerIdx = (i + salt) % PEMILIK.length
    const omset = Math.round(baseOmset * (1 + variance(i, salt)))
    const transaksi = Math.max(1, Math.round(baseTx * (1 + variance(i + 1, salt))))
    const cls = i % 7 === 0 && i >= 4 ? 'Menengah' : i % 3 === 1 ? 'Kecil' : 'Mikro'
    merchants.push({
      id: `UMK-${salt}${String(i + 1).padStart(3, '0')}`,
      nama: `${BISNIS[biduangIdx]} ${PEMILIK[ownerIdx]}`,
      bidang: BIDANG[(i + salt) % BIDANG.length],
      klasifikasi: cls,
      omsetBulanan: omset,
      transaksi: transaksi,
      qrisPct: Math.min(100, kecamatanRow.metode?.QRIS ?? 58)
    })
  }
  return merchants
}

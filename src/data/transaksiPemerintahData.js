// Mock data layer for the Transaksi Pemerintah (Government Revenue Analytics) page.
// Di produksi diganti pemanggilan GET /api/pajak/pbb/summary,
// GET /api/pajak/kecamatan?kabupaten=, dan GET /api/pajak/trend?range=.
//
// Diturunkan konsisten dari kecamatanZonation (heatmapData.js).

import { kecamatanZonation } from './heatmapData.js'
import { kabupatenList, bulanLabels } from './transaksiUMKMData.js'

// ---- Deret data per kecamatan ----
export const pajakKecamatan = kecamatanZonation.map((k) => {
  const w = k.zonationScore / 100
  const nopTerdaftar = Math.round(k.indicators.merchants * 34)
  const kepatuhanPct = Math.round((52 + w * 33) * 10) / 10
  const avgPbbPerNop = 175000 + Math.round(w * 155000)
  const transaksiBayar = Math.round((nopTerdaftar * kepatuhanPct) / 100)
  const penerimaanPBB = transaksiBayar * avgPbbPerNop
  const realisasiPct = Math.round((76 + w * 16) * 10) / 10
  const targetPBB = Math.round(penerimaanPBB / (realisasiPct / 100))
  const penerimaanBPHTB = Math.round(penerimaanPBB * (0.22 + w * 0.2))
  const pctQRIS = Math.round((14 + w * 34) * 10) / 10
  const penerimaanLain = Math.round(penerimaanPBB * 0.14)

  return {
    id: k.id,
    kabupaten: k.regency,
    kecamatan: k.name.replace(' (Cilacap)', ''),
    nopTerdaftar,
    transaksiBayar,
    penerimaanPBB,
    targetPBB,
    realisasiPct,
    penerimaanBPHTB,
    kepatuhanPct,
    pctQRIS,
    penerimaanLain,
    qrisPajak: Math.round((penerimaanPBB + penerimaanBPHTB) * (pctQRIS / 100)),
    qrisRetribusi: Math.round(penerimaanLain * ((pctQRIS * 0.75) / 100)),
    rataPenerimaanPerNop: Math.round(penerimaanPBB / nopTerdaftar)
  }
})

// ---- Agregasi per kabupaten ----
export const kabupatenPajak = kabupatenList.map((kab) => {
  const rows = pajakKecamatan.filter((p) => p.kabupaten === kab)
  const agg = rows.reduce(
    (a, r) => ({
      nopTerdaftar: a.nopTerdaftar + r.nopTerdaftar,
      transaksiBayar: a.transaksiBayar + r.transaksiBayar,
      penerimaanPBB: a.penerimaanPBB + r.penerimaanPBB,
      targetPBB: a.targetPBB + r.targetPBB,
      penerimaanBPHTB: a.penerimaanBPHTB + r.penerimaanBPHTB,
      penerimaanLain: a.penerimaanLain + r.penerimaanLain,
      qrisPajak: a.qrisPajak + r.qrisPajak,
      qrisRetribusi: a.qrisRetribusi + r.qrisRetribusi,
      kepatuhan: a.kepatuhan + r.kepatuhanPct
    }),
    { nopTerdaftar: 0, transaksiBayar: 0, penerimaanPBB: 0, targetPBB: 0, penerimaanBPHTB: 0, penerimaanLain: 0, qrisPajak: 0, qrisRetribusi: 0, kepatuhan: 0 }
  )
  return {
    kabupaten: kab,
    ...agg,
    realisasiPct: Math.round((agg.penerimaanPBB / agg.targetPBB) * 1000) / 10,
    kepatuhanPct: Math.round((agg.kepatuhan / rows.length) * 10) / 10,
    padTotal: agg.penerimaanPBB + agg.penerimaanBPHTB + agg.penerimaanLain
  }
})

// ---- KPI agregat ----
export const pajakSummary = kabupatenPajak.reduce(
  (acc, k) => ({
    nopTerdaftar: acc.nopTerdaftar + k.nopTerdaftar,
    penerimaanPBB: acc.penerimaanPBB + k.penerimaanPBB,
    targetPBB: acc.targetPBB + k.targetPBB,
    penerimaanBPHTB: acc.penerimaanBPHTB + k.penerimaanBPHTB,
    penerimaanLain: acc.penerimaanLain + k.penerimaanLain
  }),
  { nopTerdaftar: 0, penerimaanPBB: 0, targetPBB: 0, penerimaanBPHTB: 0, penerimaanLain: 0 }
)
pajakSummary.realisasiPct = Math.round((pajakSummary.penerimaanPBB / pajakSummary.targetPBB) * 1000) / 10
pajakSummary.padTotal = pajakSummary.penerimaanPBB + pajakSummary.penerimaanBPHTB + pajakSummary.penerimaanLain

// ---- Distribusi per jenis pajak (donut) ----
export const jenisBreakdown = [
  { name: 'PBB-P2', value: pajakSummary.penerimaanPBB, color: '#E30617' },
  { name: 'BPHTB', value: pajakSummary.penerimaanBPHTB, color: '#F5A623' },
  { name: 'Retribusi & Lainnya', value: pajakSummary.penerimaanLain, color: '#22B07D' }
]

// ---- Tren realisasi bulanan per kabupaten (Rp) ----
const kabAnnualPbb = kabupatenPajak.reduce((a, k) => ({ ...a, [k.kabupaten]: k.penerimaanPBB }), {})
const kabMonthlyBphtb = kabupatenPajak.reduce((a, k) => ({ ...a, [k.kabupaten]: k.penerimaanBPHTB }), {})

export const trendRealisasi = bulanLabels.map((bulan, i) => {
  const row = { bulan }
  kabupatenList.forEach((kab) => {
    const pbbBase = kabAnnualPbb[kab] / 12
    const bphtbBase = kabMonthlyBphtb[kab] / 12
    // Musiman: lonjakan sekitar tengah tahun (jatuh tempo PBB)
    const season = 0.82 + 0.32 * Math.max(0, Math.sin(((i - 4) / 12) * Math.PI * 2))
    row[`${kab}_PBB`] = Math.round((pbbBase * season) / 1e6) * 1e6
    row[`${kab}_BPHTB`] = Math.round((bphtbBase * (0.75 + 0.5 * Math.sin((i / 12) * Math.PI * 2))) / 1e6) * 1e6
  })
  return row
})

// ---- Sebaran realisasi vs target per kabupaten (progress) ----
export const targetCapaian = kabupatenPajak.map((k) => ({
  kabupaten: k.kabupaten,
  targetPBB: k.targetPBB,
  penerimaanPBB: k.penerimaanPBB,
  sisa: k.targetPBB - k.penerimaanPBB,
  realisasiPct: k.realisasiPct
}))

export const pajakRangeOptions = [
  { key: '30d', label: '30 Hari' },
  { key: '90d', label: '90 Hari' },
  { key: '12m', label: '12 Bulan' }
]
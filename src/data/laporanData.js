// Mock data layer for the Laporan (Report Generator) page.
// Di produksi diganti pemanggilan GET /api/reports, POST /api/reports/generate,
// dan GET /api/reports/:id/preview.
//
// Catatan desain: builder preview di bawah ini SENGAJA menarik dari sumber data yang
// sama dengan halaman lain (heatmapData, transaksiData, penggunaData, mockData) supaya
// angka yang muncul di Laporan selalu konsisten dengan Dashboard, Transaksi, Pengguna,
// dan Heatmap — bukan angka acak yang terpisah.

import { kecamatanZonation } from './heatmapData.js'
import { transactionSummary, methodBreakdown, transactions } from './transaksiData.js'
import { userSummary } from './penggunaData.js'
import { kpis } from './mockData.js'

export const reportTypes = [
  {
    key: 'ringkasan-platform',
    label: 'Ringkasan Aktivitas Platform',
    description: 'Snapshot KPI utama platform: pengguna, merchant, transaksi, dan tren mingguan.',
    icon: 'BarChart3',
    granularities: ['Harian', 'Mingguan', 'Bulanan']
  },
  {
    key: 'zonation-scorecard',
    label: 'Zonation Scorecard per Kecamatan',
    description: 'Skor zonasi, tier (Prime/Growth/Basic), dan indikator penilaian 18 kecamatan.',
    icon: 'Layers',
    granularities: ['Per Kecamatan', 'Seluruh Wilayah']
  },
  {
    key: 'adopsi-qris',
    label: 'Statistik Adopsi QRIS',
    description: 'Persentase merchant yang sudah pakai QR Merchant BahLink vs metode lain.',
    icon: 'QrCode',
    granularities: ['Per Kecamatan', 'Seluruh Wilayah']
  },
  {
    key: 'fraud-verifikasi',
    label: 'Laporan Fraud & Verifikasi',
    description: 'Rekap kasus fraud, status verifikasi merchant, dan waktu penyelesaian.',
    icon: 'ShieldAlert',
    granularities: ['Harian', 'Mingguan', 'Bulanan']
  },
  {
    key: 'pertumbuhan',
    label: 'Laporan Pertumbuhan Pengguna & Merchant',
    description: 'Tren registrasi pengguna & merchant baru serta tingkat retensi.',
    icon: 'TrendingUp',
    granularities: ['Mingguan', 'Bulanan']
  }
]

export const aggregationLevels = ['Per Kecamatan', 'Seluruh Wilayah']

export const kecamatanList = kecamatanZonation.map((k) => k.name)

export const exportFormats = ['PDF', 'CSV', 'XLSX']

export const mitraList = [
  { id: 'bi-purwokerto', name: 'KPw BI Purwokerto', role: 'Bank Indonesia' },
  { id: 'pemda-banyumas', name: 'Pemda Kabupaten Banyumas', role: 'Pemerintah Daerah' },
  { id: 'opd-koperasi', name: 'OPD Koperasi & UKM', role: 'Pemerintah Daerah' },
  { id: 'pjp-mitra', name: 'PJP/Perbankan Mitra', role: 'Perbankan' }
]

// Riwayat laporan yang sudah pernah dibuat.
export const reportHistory = [
  {
    id: 'RPT-20260717-001',
    typeKey: 'ringkasan-platform',
    granularity: 'Mingguan',
    aggregation: 'Seluruh Wilayah',
    format: 'PDF',
    generatedBy: 'Admin Bahlink',
    generatedAt: '2026-07-17T16:20:00',
    status: 'Siap',
    sharedWith: ['KPw BI Purwokerto']
  },
  {
    id: 'RPT-20260716-004',
    typeKey: 'zonation-scorecard',
    granularity: 'Per Kecamatan',
    aggregation: 'Per Kecamatan',
    format: 'XLSX',
    generatedBy: 'Rangga Wibisono',
    generatedAt: '2026-07-16T11:05:00',
    status: 'Siap',
    sharedWith: ['Pemda Kabupaten Banyumas', 'KPw BI Purwokerto']
  },
  {
    id: 'RPT-20260715-002',
    typeKey: 'adopsi-qris',
    granularity: 'Seluruh Wilayah',
    aggregation: 'Seluruh Wilayah',
    format: 'CSV',
    generatedBy: 'Admin Bahlink',
    generatedAt: '2026-07-15T09:40:00',
    status: 'Siap',
    sharedWith: []
  },
  {
    id: 'RPT-20260714-011',
    typeKey: 'fraud-verifikasi',
    granularity: 'Mingguan',
    aggregation: 'Seluruh Wilayah',
    format: 'PDF',
    generatedBy: 'Admin Bahlink',
    generatedAt: '2026-07-14T20:12:00',
    status: 'Siap',
    sharedWith: ['OPD Koperasi & UKM']
  },
  {
    id: 'RPT-20260710-007',
    typeKey: 'pertumbuhan',
    granularity: 'Bulanan',
    aggregation: 'Seluruh Wilayah',
    format: 'XLSX',
    generatedBy: 'Rangga Wibisono',
    generatedAt: '2026-07-10T08:55:00',
    status: 'Diproses',
    sharedWith: []
  },
  {
    id: 'RPT-20260702-003',
    typeKey: 'ringkasan-platform',
    granularity: 'Bulanan',
    aggregation: 'Seluruh Wilayah',
    format: 'PDF',
    generatedBy: 'Admin Bahlink',
    generatedAt: '2026-07-02T14:00:00',
    status: 'Siap',
    sharedWith: ['PJP/Perbankan Mitra']
  }
]

function mask(name) {
  return name.replace(/./g, (c, i) => (i < 2 ? c : '•'))
}

// Membangun data preview sesuai jenis laporan + tingkat agregasi yang dipilih.
// anonymize=true akan menyamarkan nama merchant/pengguna individual (mode berbagi ke mitra).
export function buildReportPreview({ typeKey, aggregation, anonymize }) {
  switch (typeKey) {
    case 'ringkasan-platform':
      return {
        kind: 'kpi-grid',
        title: 'Ringkasan Aktivitas Platform',
        items: [
          { label: 'Total Pengguna', value: userSummary.totalUsers },
          { label: 'Pengguna Aktif 7 Hari', value: userSummary.activeLast7d },
          { label: 'Total Transaksi', value: transactionSummary.totalTransactions },
          { label: 'Transaksi Berhasil', value: transactionSummary.successCount },
          { label: 'Rata-rata Nilai Transaksi', value: transactionSummary.averageValue, isCurrency: true },
          { label: 'Pertumbuhan Pengguna', value: `${userSummary.growthPct}%`, isText: true }
        ]
      }

    case 'zonation-scorecard': {
      const rows = [...kecamatanZonation]
        .sort((a, b) => b.zonationScore - a.zonationScore)
        .map((k) => ({
          kecamatan: k.name,
          tier: k.tier,
          skor: k.zonationScore,
          merchant: k.indicators.merchants,
          adopsiQris: `${k.indicators.qrisAdoption}%`
        }))
      return {
        kind: 'table',
        title: 'Zonation Scorecard per Kecamatan',
        columns: ['Kecamatan', 'Tier', 'Skor Zonasi', 'Jumlah Merchant', 'Adopsi QRIS'],
        rows:
          aggregation === 'Seluruh Wilayah'
            ? [
                {
                  kecamatan: 'Seluruh Banyumas Raya (agregat)',
                  tier: '—',
                  skor: Math.round(rows.reduce((s, r) => s + r.skor, 0) / rows.length),
                  merchant: rows.reduce((s, r) => s + r.merchant, 0),
                  adopsiQris: `${Math.round(rows.reduce((s, r) => s + parseInt(r.adopsiQris), 0) / rows.length)}%`
                }
              ]
            : rows
      }
    }

    case 'adopsi-qris': {
      return {
        kind: 'donut',
        title: 'Statistik Adopsi QRIS',
        data: methodBreakdown,
        note: 'Persentase volume transaksi berdasarkan metode pembayaran, termasuk QRIS via QR Merchant BahLink maupun e-wallet pihak ketiga.'
      }
    }

    case 'fraud-verifikasi': {
      const flagged = transactions.filter((t) => t.status === 'Gagal' || t.note)
      return {
        kind: 'table',
        title: 'Laporan Fraud & Verifikasi',
        columns: ['ID Transaksi', 'Merchant', 'Status', 'Catatan Sistem'],
        rows: flagged.map((t) => ({
          idTransaksi: t.id,
          merchant: anonymize ? mask(t.merchant) : t.merchant,
          status: t.status,
          catatan: t.note || '—'
        })),
        columnKeys: ['idTransaksi', 'merchant', 'status', 'catatan']
      }
    }

    case 'pertumbuhan':
      return {
        kind: 'kpi-grid',
        title: 'Pertumbuhan Pengguna & Merchant',
        items: [
          { label: 'Pengguna Baru Bulan Ini', value: userSummary.newThisMonth },
          { label: 'Pertumbuhan Pengguna', value: `${userSummary.growthPct}%`, isText: true },
          { label: 'Total Merchant', value: kpis.find((k) => k.id === 'merchants')?.value ?? 0 },
          { label: 'Pertumbuhan Merchant', value: `${kpis.find((k) => k.id === 'merchants')?.delta ?? 0}%`, isText: true }
        ]
      }

    default:
      return { kind: 'empty' }
  }
}

export function reportTypeMeta(typeKey) {
  return reportTypes.find((r) => r.key === typeKey)
}
// Data + "answer engine" untuk halaman AI Assistant.
// PENTING: seluruh jawaban di file ini dibangun dari data yang SUDAH TERAGREGASI
// (skor, jumlah transaksi, persentase) — tidak pernah dari nilai finansial individual
// merchant (mis. omzet/saldo mentah), sesuai batasan yang diminta:
// "AI Assistant memberi insight berbasis data yang sudah teragregasi di sistem;
// tidak mengakses data finansial individual merchant secara langsung."
//
// Di produksi, fungsi generateAnswer() ini digantikan panggilan ke backend Express
// yang memanggil Grok API: POST /api/ai/ask { question, sessionId }. Backend-lah yang
// bertanggung jawab menyusun konteks teragregasi sebelum dikirim ke model.

import { kecamatanZonation } from './heatmapData.js'
import { transactionSummary, zoneBreakdown, methodBreakdown } from './transaksiData.js'
import { userSummary } from './penggunaData.js'
import { fraudCases } from './fraudData.js'
import { merchants } from './merchantData.js'

export const quickQuestions = [
  'Wilayah mana dengan transaksi tertinggi minggu ini?',
  'Merchant dengan pertumbuhan transaksi tertinggi?',
  'Ringkasan transaksi 7 hari terakhir',
  'Apakah ada aktivitas mencurigakan hari ini?',
  'Kecamatan mana yang berisiko turun tier zonasi?'
]

export const aiDisclaimer =
  'AI Assistant hanya membaca data yang sudah teragregasi (skor, jumlah transaksi, persentase) — tidak pernah mengakses nilai finansial individual merchant seperti omzet atau saldo.'

function formatNumber(n) {
  return new Intl.NumberFormat('id-ID').format(Math.round(n))
}

// ---- Jawaban per topik ------------------------------------------------

function answerTopZone() {
  const ranked = [...zoneBreakdown].sort((a, b) => b.volume - a.volume).slice(0, 5)
  return {
    kind: 'ranked-list',
    intro: `Berdasarkan volume transaksi 7 hari terakhir, ${ranked[0].zone} memimpin dengan ${formatNumber(
      ranked[0].volume
    )} transaksi — sekitar ${Math.round((ranked[0].volume / zoneBreakdown.reduce((s, z) => s + z.volume, 0)) * 100)}% dari total volume di daftar ini.`,
    title: 'Top 5 Wilayah — Volume Transaksi 7 Hari Terakhir',
    items: ranked.map((z, i) => ({ rank: i + 1, name: z.zone, value: `${formatNumber(z.volume)} transaksi` })),
    actions: [
      'Buka halaman Heatmap untuk melihat sebaran geografisnya secara visual.',
      'Pertimbangkan menjadikan wilayah teratas sebagai percontohan pada Lomba Kecamatan berikutnya.'
    ]
  }
}

function answerMerchantGrowth() {
  const ranked = [...merchants].sort((a, b) => b.transactions30d - a.transactions30d).slice(0, 5)
  return {
    kind: 'ranked-list',
    intro:
      'Berikut merchant dengan jumlah transaksi tertinggi 30 hari terakhir (indikator pertumbuhan aktivitas, bukan nilai omzet).',
    title: 'Top 5 Merchant — Jumlah Transaksi 30 Hari',
    items: ranked.map((m, i) => ({
      rank: i + 1,
      name: m.name,
      value: `${formatNumber(m.transactions30d)} transaksi`,
      sub: `BahScore ${m.bahScore} · ${m.kecamatan}`
    })),
    actions: [
      'Merchant dengan BahScore tinggi & transaksi meningkat adalah kandidat baik untuk studi kasus keberhasilan onboarding.'
    ]
  }
}

function answerWeeklySummary() {
  const successRate = Math.round((transactionSummary.successCount / transactionSummary.totalTransactions) * 1000) / 10
  return {
    kind: 'kpi-list',
    intro: 'Ringkasan aktivitas platform 7 hari terakhir:',
    items: [
      { label: 'Total Transaksi', value: formatNumber(transactionSummary.totalTransactions) },
      { label: 'Tingkat Keberhasilan', value: `${successRate}%` },
      { label: 'Transaksi Pending', value: formatNumber(transactionSummary.pendingCount) },
      { label: 'Transaksi Gagal', value: formatNumber(transactionSummary.failedCount) },
      { label: 'Pengguna Aktif', value: formatNumber(userSummary.activeLast7d) },
      { label: 'Metode Terbanyak', value: `${methodBreakdown[0].name} (${methodBreakdown[0].value}%)` }
    ],
    actions: ['Buka halaman Transaksi untuk rincian per merchant, kategori, dan wilayah.']
  }
}

function answerSuspiciousActivity() {
  const activeCases = fraudCases.filter((c) => c.status === 'Baru' || c.status === 'Sedang Ditinjau')
  const highPriority = activeCases.filter((c) => c.priority === 'Tinggi')

  if (activeCases.length === 0) {
    return {
      kind: 'text',
      intro: 'Tidak ada kasus fraud aktif yang tercatat hari ini. Semua kasus sebelumnya sudah diputuskan.',
      actions: []
    }
  }

  return {
    kind: 'recommendation',
    intro: `Ada ${activeCases.length} kasus aktif di antrean Fraud Monitoring, ${highPriority.length} di antaranya berprioritas Tinggi.`,
    items: activeCases.slice(0, 5).map((c) => ({
      rank: null,
      name: `${c.id} · ${c.merchant}`,
      value: c.priority,
      sub: c.indication
    })),
    actions: [
      highPriority.length > 0
        ? `Prioritaskan peninjauan ${highPriority.length} kasus berprioritas Tinggi terlebih dahulu.`
        : 'Tidak ada kasus prioritas Tinggi — antrean masih dalam kondisi terkendali.',
      'Buka halaman Fraud Monitoring untuk meninjau bukti lengkap tiap kasus.'
    ]
  }
}

function answerZoneAtRisk() {
  const atRisk = [...kecamatanZonation]
    .filter((k) => k.indicators.growthPct < 0 || (k.tier === 'Growth Zone' && k.zonationScore < 60))
    .sort((a, b) => a.indicators.growthPct - b.indicators.growthPct)
    .slice(0, 5)

  if (atRisk.length === 0) {
    return {
      kind: 'text',
      intro: 'Tidak ada kecamatan yang menunjukkan tren penurunan signifikan saat ini. Seluruh zona stabil atau bertumbuh.',
      actions: []
    }
  }

  return {
    kind: 'ranked-list',
    intro: 'Kecamatan berikut menunjukkan tren pertumbuhan negatif atau skor mendekati batas bawah tier-nya:',
    title: 'Kecamatan Berisiko Turun Tier',
    items: atRisk.map((k, i) => ({
      rank: i + 1,
      name: k.name,
      value: `Skor ${k.zonationScore} (${k.tier})`,
      sub: `Tren: ${k.indicators.growthPct > 0 ? '+' : ''}${k.indicators.growthPct}%`
    })),
    actions: [
      'Buka halaman Heatmap → pilih kecamatan terkait untuk melihat rekomendasi intervensi spesifik.',
      'Pertimbangkan kunjungan lapangan tim onboarding untuk kecamatan dengan tren paling negatif.'
    ]
  }
}

function answerFallback(question) {
  return {
    kind: 'text',
    intro: `Saya belum punya jawaban spesifik untuk "${question}" dari data yang tersedia saat ini. Coba salah satu pertanyaan cepat di bawah, atau tanyakan dengan menyebut wilayah/merchant/rentang waktu secara spesifik.`,
    actions: []
  }
}

// Pencocokan kata kunci sederhana — di backend sungguhan, langkah ini digantikan
// oleh model bahasa (Grok API) yang membaca konteks data teragregasi.
export function generateAnswer(question) {
  const q = question.toLowerCase()

  if (q.includes('wilayah') && (q.includes('tinggi') || q.includes('transaksi'))) return answerTopZone()
  if (q.includes('merchant') && (q.includes('pertumbuhan') || q.includes('tinggi'))) return answerMerchantGrowth()
  if (q.includes('ringkasan') || (q.includes('7 hari') && q.includes('transaksi'))) return answerWeeklySummary()
  if (q.includes('mencurigakan') || q.includes('fraud') || q.includes('curiga')) return answerSuspiciousActivity()
  if (q.includes('turun tier') || q.includes('berisiko') || q.includes('zonasi')) return answerZoneAtRisk()

  return answerFallback(question)
}

// ---- Riwayat sesi percakapan -------------------------------------------
// Di produksi: GET /api/ai/sessions (per admin yang sedang login)

export const sessionSeed = [
  {
    id: 'sess-1',
    title: 'Wilayah dengan transaksi tertinggi',
    createdAt: '2026-07-18T08:15:00',
    messages: [
      { id: 'm1', role: 'user', text: 'Wilayah mana dengan transaksi tertinggi minggu ini?' },
      { id: 'm2', role: 'assistant', content: answerTopZone(), pinned: true }
    ]
  },
  {
    id: 'sess-2',
    title: 'Cek aktivitas mencurigakan',
    createdAt: '2026-07-17T14:02:00',
    messages: [
      { id: 'm1', role: 'user', text: 'Apakah ada aktivitas mencurigakan hari ini?' },
      { id: 'm2', role: 'assistant', content: answerSuspiciousActivity(), pinned: false }
    ]
  }
]
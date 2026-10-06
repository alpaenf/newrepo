// Data layer for the Pengaturan Sistem (System Settings) page.
// Di produksi diganti pemanggilan GET /api/settings dan PATCH /api/settings.

export const defaultSettings = {
  institution: {
    name: 'BahLink',
    program: 'ZONA QRIS Banyumas Raya',
    picName: 'Admin Bahlink',
    picEmail: 'admin@bahlink.id',
    picPhone: '0812-0000-0000',
    address: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah'
  },
  thresholds: {
    autoFraudScore: 70,
    bahScoreAtRisk: 39,
    verificationQueueHours: 48
  },
  integrations: {
    grokApiKey: '',
    grokEnabled: false,
    tileProvider: 'CARTO Positron (gratis, tanpa API key)',
    tileApiKey: '',
    webhookUrl: '',
    webhookEnabled: false
  },
  display: {
    defaultRegionUnit: 'Kecamatan',
    dateFormat: 'DD MMM YYYY',
    timezone: 'Asia/Jakarta (WIB, UTC+7)'
  }
}

export const regionUnitOptions = ['Kecamatan', 'Kabupaten/Kota', 'Provinsi']
export const dateFormatOptions = ['DD MMM YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'D MMMM YYYY']
export const timezoneOptions = [
  'Asia/Jakarta (WIB, UTC+7)',
  'Asia/Makassar (WITA, UTC+8)',
  'Asia/Jayapura (WIT, UTC+9)'
]
export const tileProviderOptions = [
  'CARTO Positron (gratis, tanpa API key)',
  'Mapbox GL JS (butuh API key)',
  'Stadia Maps (butuh API key)'
]

export const reportTemplates = [
  { id: 'tpl-ringkasan', name: 'Ringkasan Aktivitas Platform', enabled: true, schedule: 'Mingguan' },
  { id: 'tpl-scorecard', name: 'Zonation Scorecard per Kecamatan', enabled: true, schedule: 'Bulanan' },
  { id: 'tpl-qris', name: 'Statistik Adopsi QRIS', enabled: true, schedule: 'Bulanan' },
  { id: 'tpl-fraud', name: 'Laporan Fraud & Verifikasi', enabled: true, schedule: 'Mingguan' },
  { id: 'tpl-pertumbuhan', name: 'Pertumbuhan Pengguna & Merchant', enabled: false, schedule: 'Bulanan' }
]

export const notificationTemplates = [
  { id: 'ntpl-verifikasi', name: 'Verifikasi merchant/pengguna baru', enabled: true, channel: 'In-app + Email' },
  { id: 'ntpl-fraud', name: 'Potensi fraud terdeteksi', enabled: true, channel: 'In-app + Email' },
  { id: 'ntpl-bahscore', name: 'BahScore nasional turun signifikan', enabled: true, channel: 'In-app' },
  { id: 'ntpl-transaksi', name: 'Transaksi gagal/pending meningkat', enabled: false, channel: 'In-app' },
  { id: 'ntpl-laporan', name: 'Laporan siap diunduh', enabled: true, channel: 'In-app + Email' }
]

export const settingsChangeLogSeed = [
  {
    id: 'CHG-2026-0031',
    section: 'Ambang Batas',
    field: 'Batas Skor Fraud Otomatis',
    oldValue: '75',
    newValue: '70',
    changedBy: 'Admin Bahlink',
    changedAt: '2026-07-15T10:20:00'
  },
  {
    id: 'CHG-2026-0028',
    section: 'Integrasi',
    field: 'Webhook URL',
    oldValue: '(kosong)',
    newValue: 'https://hooks.bahlink.id/zona-qris',
    changedBy: 'Rangga Wibisono',
    changedAt: '2026-07-10T14:05:00'
  },
  {
    id: 'CHG-2026-0019',
    section: 'Tampilan',
    field: 'Zona Waktu',
    oldValue: 'Asia/Makassar (WITA, UTC+8)',
    newValue: 'Asia/Jakarta (WIB, UTC+7)',
    changedBy: 'Admin Bahlink',
    changedAt: '2026-06-28T09:00:00'
  },
  {
    id: 'CHG-2026-0012',
    section: 'Template',
    field: 'Laporan Pertumbuhan Pengguna & Merchant',
    oldValue: 'Aktif',
    newValue: 'Nonaktif',
    changedBy: 'Dewi Anggraini',
    changedAt: '2026-06-20T16:40:00'
  }
]

export function maskApiKey(key) {
  if (!key) return ''
  if (key.length <= 8) return '•'.repeat(key.length)
  return `${key.slice(0, 4)}${'•'.repeat(key.length - 8)}${key.slice(-4)}`
}
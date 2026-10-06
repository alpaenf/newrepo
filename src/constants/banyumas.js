/**
 * Central Constants for Banyumas Raya QRIS Command Center
 */

export const KABUPATEN_LIST = [
  'Banyumas',
  'Cilacap',
  'Purbalingga',
  'Banjarnegara'
]

export const KABUPATEN_COORDINATES = {
  Banyumas: { lat: -7.5147, lng: 109.2943, zoom: 11 },
  Cilacap: { lat: -7.7279, lng: 109.0059, zoom: 10 },
  Purbalingga: { lat: -7.3892, lng: 109.3639, zoom: 11 },
  Banjarnegara: { lat: -7.3976, lng: 109.6975, zoom: 11 }
}

export const MAP_DEFAULTS = {
  center: [-7.5147, 109.2943],
  zoom: 10,
  minZoom: 8,
  maxZoom: 18
}

export const SKALA_USAHA_CATEGORIES = [
  { id: 'all', label: 'Semua Skala', color: '#045498' },
  { id: 'UMI', label: 'Usaha Mikro (UMI)', color: '#10B981' },
  { id: 'UKE', label: 'Usaha Kecil (UKE)', color: '#3B82F6' },
  { id: 'UME', label: 'Usaha Menengah (UME)', color: '#8B5CF6' },
  { id: 'UBE', label: 'Usaha Besar (UBE)', color: '#F59E0B' },
  { id: 'DONASI', label: 'Donasi & Sosial', color: '#EC4899' },
  { id: 'GVP', label: 'Pemerintah (GVP)', color: '#6366F1' }
]

export const BULAN_OPTIONS = [
  { value: 'Januari', label: 'Januari' },
  { value: 'Februari', label: 'Februari' },
  { value: 'Maret', label: 'Maret' },
  { value: 'April', label: 'April' },
  { value: 'Mei', label: 'Mei' },
  { value: 'Juni', label: 'Juni' },
  { value: 'Juli', label: 'Juli' },
  { value: 'Agustus', label: 'Agustus' },
  { value: 'September', label: 'September' },
  { value: 'Oktober', label: 'Oktober' },
  { value: 'November', label: 'November' },
  { value: 'Desember', label: 'Desember' }
]

export const TAHUN_OPTIONS = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' }
]

import { useState, useMemo } from 'react'
import * as XLSX from 'xlsx'
import StokMapLeaflet, { StokMapLegend } from '../../components/StokMapLeaflet.jsx'
import StokDetailPanel from './StokDetailPanel.jsx'
import StokChartAnalytics from './StokChartAnalytics.jsx'

const stockMetricOptions = [
  { key: 'volumeStok', label: 'Volume Stok' },
  { key: 'bufferStok', label: 'Target Buffer' },
  { key: 'avgPrice', label: 'Rata-rata Harga' }
]
import {
  Package,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Building,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  MapPin,
  Upload,
  Download,
  Layers,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from '../../components/icons.jsx'

const sampleStokData = [
  {
    id: 1,
    wilayahId: 'banyumas',
    wilayahName: 'Banyumas',
    komoditas: 'Beras Medium Pandan Wangi',
    gudang: 'Gudang Bulog Sub-Divre Pasuruan',
    stok: '1,450 Ton',
    minBuffer: '500 Ton',
    status: 'Aman',
    terakhirUpdate: '10 Menit lalu',
    lat: -7.4247,
    lng: 109.2461,
    rincianStok: [
      { nama: 'Beras Medium Pandan Wangi', jumlah: '850 Ton', harga: 'Rp 13.500/kg', status: 'Aman' },
      { nama: 'Beras Premium IR-64', jumlah: '400 Ton', harga: 'Rp 15.500/kg', status: 'Aman' },
      { nama: 'Minyak Goreng Kita', jumlah: '200 Ton', harga: 'Rp 16.000/kg', status: 'Aman' }
    ]
  },
  {
    id: 2,
    wilayahId: 'banyumas',
    wilayahName: 'Banyumas',
    komoditas: 'Gula Pasir Kristal',
    gudang: 'Gudang Distribusi Sokaraja',
    stok: '320 Ton',
    minBuffer: '400 Ton',
    status: 'Menipis',
    terakhirUpdate: '1 Jam lalu',
    lat: -7.4370,
    lng: 109.2870,
    rincianStok: [
      { nama: 'Gula Pasir Kristal', jumlah: '180 Ton', harga: 'Rp 17.500/kg', status: 'Menipis' },
      { nama: 'Tepung Terigu Segitiga', jumlah: '90 Ton', harga: 'Rp 12.000/kg', status: 'Aman' },
      { nama: 'Bawang Merah Brebes', jumlah: '50 Ton', harga: 'Rp 32.000/kg', status: 'Menipis' }
    ]
  },
  {
    id: 3,
    wilayahId: 'purbalingga',
    wilayahName: 'Purbalingga',
    komoditas: 'Beras Super Pulen',
    gudang: 'Gudang Pangan Bobotsari',
    stok: '890 Ton',
    minBuffer: '300 Ton',
    status: 'Aman',
    terakhirUpdate: '25 Menit lalu',
    lat: -7.2470,
    lng: 109.3560,
    rincianStok: [
      { nama: 'Beras Super Pulen', jumlah: '550 Ton', harga: 'Rp 15.000/kg', status: 'Aman' },
      { nama: 'Jagung Hibrida', jumlah: '240 Ton', harga: 'Rp 7.500/kg', status: 'Aman' },
      { nama: 'Kacang Tanah', jumlah: '100 Ton', harga: 'Rp 22.000/kg', status: 'Aman' }
    ]
  },
  {
    id: 4,
    wilayahId: 'purbalingga',
    wilayahName: 'Purbalingga',
    komoditas: 'Telur Ayam Ras',
    gudang: 'Sentra Unggas Bukateja',
    stok: '120 Ton',
    minBuffer: '100 Ton',
    status: 'Aman',
    terakhirUpdate: '5 Menit lalu',
    lat: -7.4320,
    lng: 109.4210,
    rincianStok: [
      { nama: 'Telur Ayam Ras', jumlah: '80 Ton', harga: 'Rp 28.500/kg', status: 'Aman' },
      { nama: 'Daging Ayam Broiler', jumlah: '40 Ton', harga: 'Rp 36.500/kg', status: 'Aman' }
    ]
  },
  {
    id: 5,
    wilayahId: 'banjarnegara',
    wilayahName: 'Banjarnegara',
    komoditas: 'Cabai Merah Keriting',
    gudang: 'Pasar Induk Banjarnegara',
    stok: '28 Ton',
    minBuffer: '50 Ton',
    status: 'Kritis',
    terakhirUpdate: '15 Menit lalu',
    lat: -7.3960,
    lng: 109.6970,
    rincianStok: [
      { nama: 'Cabai Merah Keriting', jumlah: '18 Ton', harga: 'Rp 48.000/kg', status: 'Kritis' },
      { nama: 'Cabai Rawit Merah', jumlah: '10 Ton', harga: 'Rp 55.000/kg', status: 'Kritis' }
    ]
  },
  {
    id: 6,
    wilayahId: 'cilacap',
    wilayahName: 'Cilacap',
    komoditas: 'Ikan Laut & Seafood',
    gudang: 'Cold Storage TPI Sidakaya',
    stok: '650 Ton',
    minBuffer: '200 Ton',
    status: 'Aman',
    terakhirUpdate: '20 Menit lalu',
    lat: -7.7380,
    lng: 109.0250,
    rincianStok: [
      { nama: 'Ikan Laut & Seafood', jumlah: '350 Ton', harga: 'Rp 35.000/kg', status: 'Aman' },
      { nama: 'Udang Vaname', jumlah: '180 Ton', harga: 'Rp 85.000/kg', status: 'Aman' },
      { nama: 'Cumi-Cumi Fresh', jumlah: '120 Ton', harga: 'Rp 75.000/kg', status: 'Aman' }
    ]
  },
  {
    id: 7,
    wilayahId: 'kebumen',
    wilayahName: 'Kebumen',
    komoditas: 'Daging Sapi Segar',
    gudang: 'RPH & Cold Storage Gombong',
    stok: '18 Ton',
    minBuffer: '40 Ton',
    status: 'Kritis',
    terakhirUpdate: '30 Menit lalu',
    lat: -7.6074,
    lng: 109.5143,
    rincianStok: [
      { nama: 'Daging Sapi Segar', jumlah: '12 Ton', harga: 'Rp 130.000/kg', status: 'Kritis' },
      { nama: 'Daging Kambing', jumlah: '6 Ton', harga: 'Rp 140.000/kg', status: 'Kritis' }
    ]
  }
]

export default function StokKomoditas({ isAdmin = true }) {
  const [stokData, setStokData] = useState(sampleStokData)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [komoditasFilter, setKomoditasFilter] = useState('Semua')
  const [stockMetric, setStockMetric] = useState('volumeStok')
  const [selectedWilayahId, setSelectedWilayahId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAlertSidebarOpen, setIsAlertSidebarOpen] = useState(true)

  // Ambil item terpilih untuk detail panel
  const selectedStockItem = stokData.find(
    item => item.id === selectedWilayahId || item.wilayahId === selectedWilayahId || item.wilayahName?.toLowerCase() === String(selectedWilayahId).toLowerCase()
  ) || (selectedWilayahId ? {
    wilayahName: selectedWilayahId,
    gudang: `Gudang Komoditas ${selectedWilayahId}`,
    stok: '6.5 ton',
    qrisActivity: '7',
    avgPrice: 'Rp 27.786/kg',
    komoditasUtama: [
      'Beras Pandan Wangi',
      'Cabai Rawit Merah',
      'Beras Pandan Wangi Purbalingga',
      'bawang merah',
      'Cabai Rawit Merah Purbalingga',
      'kunyit',
      'cabai merah keriting'
    ]
  } : null)

  // Ekstrak Kategori Komoditas Dinamis dari stokData (termasuk data import baru)
  const availableCategories = useMemo(() => {
    const defaultCats = ['Semua Komoditas', 'Beras', 'Gula Pasir', 'Cabai', 'Telur & Daging', 'Ikan & Seafood']
    const customCats = new Set()

    stokData.forEach(item => {
      const name = (item.komoditas || '').trim()
      if (!name) return

      const lower = name.toLowerCase()
      if (lower.includes('beras')) return
      if (lower.includes('gula')) return
      if (lower.includes('cabai') || lower.includes('cabe')) return
      if (lower.includes('telur') || lower.includes('daging') || lower.includes('sapi') || lower.includes('kambing') || lower.includes('ayam')) return
      if (lower.includes('ikan') || lower.includes('seafood') || lower.includes('udang')) return

      if (lower.includes('minyak')) customCats.add('Minyak Goreng')
      else if (lower.includes('bawang')) customCats.add('Bawang')
      else if (lower.includes('tepung') || lower.includes('terigu')) customCats.add('Tepung')
      else {
        const words = name.split(' ')
        const categoryLabel = words.length > 1 ? `${words[0]} ${words[1]}` : words[0]
        customCats.add(categoryLabel)
      }
    })

    return [...defaultCats, ...Array.from(customCats)]
  }, [stokData])

  // Hitung Rasio Keterpenuhan Buffer (%) per item
  const calcBufferRatio = (stokStr, minBufferStr) => {
    const stokNum = parseFloat(String(stokStr).replace(/[^0-9.]/g, '')) || 0
    const bufferNum = parseFloat(String(minBufferStr).replace(/[^0-9.]/g, '')) || 1
    return Math.round((stokNum / bufferNum) * 100)
  }

  // Filtering Data
  const filteredData = stokData.filter(item => {
    const matchSearch = item.komoditas.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.gudang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.wilayahName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'Semua' || item.status === statusFilter
    const matchKomoditas = komoditasFilter === 'Semua' || (
      komoditasFilter === 'Telur & Daging'
        ? (item.komoditas.toLowerCase().includes('telur') || item.komoditas.toLowerCase().includes('daging') || item.komoditas.toLowerCase().includes('sapi') || item.komoditas.toLowerCase().includes('kambing') || item.komoditas.toLowerCase().includes('ayam'))
        : komoditasFilter === 'Ikan & Seafood'
        ? (item.komoditas.toLowerCase().includes('ikan') || item.komoditas.toLowerCase().includes('seafood'))
        : komoditasFilter === 'Gula Pasir'
        ? item.komoditas.toLowerCase().includes('gula')
        : item.komoditas.toLowerCase().includes(komoditasFilter.toLowerCase())
    )
    const matchWilayah = !selectedWilayahId || item.wilayahId === selectedWilayahId
    return matchSearch && matchStatus && matchKomoditas && matchWilayah
  })

  // ─── DYNAMIC REGENCY SUPPLY RECOMMENDATIONS & UMKM COMPUTATION ─────────
  const dynamicRegencyRecommendations = useMemo(() => {
    // Group stokData by Regency (wilayahName)
    const map = new Map()

    stokData.forEach(item => {
      const regency = item.wilayahName || 'Banyumas'
      if (!map.has(regency)) {
        map.set(regency, {
          regencyName: regency,
          stokTotal: 0,
          bufferTotal: 0,
          items: [],
          kritisItems: [],
          menipisItems: [],
          amanItems: []
        })
      }
      const entry = map.get(regency)
      const sNum = parseFloat(String(item.stok).replace(/[^0-9.]/g, '')) || 0
      const bNum = parseFloat(String(item.minBuffer).replace(/[^0-9.]/g, '')) || 0

      entry.stokTotal += sNum
      entry.bufferTotal += bNum
      entry.items.push(item)

      const ratio = Math.round((sNum / (bNum || 1)) * 100)
      if (item.status === 'Kritis' || ratio < 70) {
        entry.kritisItems.push({ ...item, sNum, bNum, defisit: Math.max(0, bNum - sNum) })
      } else if (item.status === 'Menipis' || ratio < 100) {
        entry.menipisItems.push({ ...item, sNum, bNum, defisit: Math.max(0, bNum - sNum) })
      } else {
        entry.amanItems.push({ ...item, sNum, bNum, surplus: Math.max(0, sNum - bNum) })
      }
    })

    const result = []

    map.forEach((data, regName) => {
      const surplusDefisit = data.stokTotal - data.bufferTotal
      const isCritical = data.kritisItems.length > 0 || surplusDefisit < 0
      const isWarning = !isCritical && data.menipisItems.length > 0
      const isSurplus = !isCritical && !isWarning

      let statusLabel = isCritical ? 'Target Intervensi (Defisit)' : isWarning ? 'Waspada Buffer Menipis' : 'Pemasok Utama (Surplus)'
      let shortStatusBadge = isCritical ? 'Restock Urgent' : isWarning ? 'Waspada Buffer' : 'Surplus Pemasok'
      let cardStyle = isCritical
        ? 'bg-gradient-to-br from-rose-50 to-red-50/60 border-rose-200/90 text-rose-950'
        : isWarning
        ? 'bg-gradient-to-br from-amber-50 to-orange-50/60 border-amber-200/90 text-amber-950'
        : 'bg-gradient-to-br from-emerald-50 to-teal-50/60 border-emerald-200/90 text-emerald-950'

      let badgeTagStyle = isCritical ? 'bg-rose-600 text-white' : isWarning ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
      let pinColor = isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'

      // Dynamic Restock / Supply recommendation text
      let recommendationText = ''
      if (isCritical) {
        const topKritis = data.kritisItems[0] || data.items[0]
        const defisitVal = topKritis.defisit > 0 ? `${topKritis.defisit} Ton` : `${Math.abs(Math.round(surplusDefisit))} Ton`
        recommendationText = `Diperlukan restock darurat +${defisitVal} ${topKritis.komoditas} via KAD QRIS B2B.`
      } else if (isWarning) {
        const topMenipis = data.menipisItems[0] || data.items[0]
        const defisitVal = topMenipis.defisit > 0 ? `${topMenipis.defisit} Ton` : `15 Ton`
        recommendationText = `Jadwalkan penambahan buffer +${defisitVal} ${topMenipis.komoditas} untuk menjaga harga UMKM.`
      } else {
        const topAman = data.amanItems[0] || data.items[0]
        const surplusFmt = surplusDefisit > 0 ? `+${Math.round(surplusDefisit)} Ton` : 'Melimpah'
        recommendationText = `Cadangan stok ${surplusFmt} (${topAman?.komoditas || 'Pangan'}). Siap untuk pemasok KAD.`
      }

      // Dynamic UMKM merchant count computed from actual items & stocks
      const umkmCount = Math.max(28, data.items.length * 18 + Math.round(data.stokTotal * 0.35))

      result.push({
        regencyName: regName,
        statusLabel,
        shortStatusBadge,
        cardStyle,
        badgeTagStyle,
        pinColor,
        recommendationText,
        umkmCount,
        isCritical,
        isWarning,
        isSurplus
      })
    })

    // Sort: Critical regencies first, then warning, then surplus (slice top 3 for clean dashboard grid)
    return result.sort((a, b) => {
      if (a.isCritical && !b.isCritical) return -1
      if (!a.isCritical && b.isCritical) return 1
      if (a.isWarning && !b.isWarning) return -1
      if (!a.isWarning && b.isWarning) return 1
      return 0
    })
  }, [stokData])

  // Hitung ringkasan KAD secara penuh dari live stokData (100% Non-Dummy)
  const dynamicKadSummary = useMemo(() => {
    let totalSurplus = 0
    const surplusRegencies = new Set()
    const deficitRegencies = new Set()

    dynamicRegencyRecommendations.forEach(r => {
      if (r.isSurplus) {
        surplusRegencies.add(r.regencyName)
      } else if (r.isCritical || r.isWarning) {
        deficitRegencies.add(r.regencyName)
      }
    })

    stokData.forEach(item => {
      const s = parseFloat(String(item.stok).replace(/[^0-9.]/g, '')) || 0
      const b = parseFloat(String(item.minBuffer).replace(/[^0-9.]/g, '')) || 0
      if (s > b) {
        totalSurplus += (s - b)
      }
    })

    const surplusText = Array.from(surplusRegencies).join(' & ') || 'Wilayah Penyangga'
    const deficitText = Array.from(deficitRegencies).join(' & ') || 'Wilayah Intervensi Defisit'

    return {
      totalSurplusFormatted: Math.round(totalSurplus).toLocaleString('id-ID'),
      surplusText,
      deficitText
    }
  }, [dynamicRegencyRecommendations, stokData])

  // Helper untuk mengekstrak Latitude & Longitude otomatis dari URL Google Maps jika diisi user
  function extractCoordsFromGmapsUrl(url) {
    if (!url || typeof url !== 'string') return null
    const atMatch = url.match(/@(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/)
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }

    const paramMatch = url.match(/[?&](?:query|q|ll)=(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/)
    if (paramMatch) return { lat: parseFloat(paramMatch[1]), lng: parseFloat(paramMatch[2]) }

    const genericMatch = url.match(/(-?\d{1,2}\.\d+)\s*,\s*(\d{2,3}\.\d+)/)
    if (genericMatch) return { lat: parseFloat(genericMatch[1]), lng: parseFloat(genericMatch[2]) }

    return null
  }

  // Fitur Export Data Ke File Excel / CSV
  function handleExportExcel() {
    const headers = ['ID', 'Wilayah', 'Nama Komoditas', 'Lokasi Gudang', 'Jumlah Stok', 'Minimum Buffer', 'Status', 'Latitude', 'Longitude', 'Link Google Maps', 'Terakhir Update']
    const rows = stokData.map(item => {
      const lat = item.lat || ''
      const lng = item.lng || ''
      const gmapsLink = item.gmapsLink || (lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : '')
      return [
        item.id,
        item.wilayahName,
        item.komoditas,
        item.gudang,
        item.stok,
        item.minBuffer,
        item.status,
        lat,
        lng,
        gmapsLink,
        item.terakhirUpdate
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-stok-komoditas-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Fitur Import Data Dari File Excel / CSV (seperti di Heatmap)
  async function handleImportExcel(filesInput) {
    const files = Array.isArray(filesInput) ? filesInput : [filesInput]
    if (!files || files.length === 0) return

    let importedItems = []
    for (let fIdx = 0; fIdx < files.length; fIdx++) {
      const file = files[fIdx]
      try {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        if (!rawRows || rawRows.length === 0) continue

        rawRows.forEach((row, i) => {
          let wilayahName = ''
          let komoditas = ''
          let gudang = ''
          let stok = ''
          let minBuffer = ''
          let status = ''
          let latVal = null
          let lngVal = null
          let gmapsUrl = ''

          Object.entries(row).forEach(([key, val]) => {
            const k = key.toLowerCase().trim()
            const strVal = String(val).trim()
            if (!strVal) return

            if (k.includes('wilayah') || k.includes('kabupaten')) wilayahName = strVal
            else if (k.includes('komoditas') || k.includes('nama')) komoditas = strVal
            else if (k.includes('gudang') || k.includes('lokasi')) gudang = strVal
            else if (k.includes('stok') || k.includes('jumlah')) stok = strVal
            else if (k.includes('buffer') || k.includes('min')) minBuffer = strVal
            else if (k.includes('status')) status = strVal
            else if (k.includes('link') || k.includes('gmaps') || k.includes('google maps') || k.includes('url')) {
              gmapsUrl = strVal
              const extracted = extractCoordsFromGmapsUrl(strVal)
              if (extracted) {
                if (latVal === null) latVal = extracted.lat
                if (lngVal === null) lngVal = extracted.lng
              }
            }
            else if (k === 'lat' || k === 'latitude' || k.includes('lat')) {
              const parsed = parseFloat(String(val).replace(',', '.'))
              if (!isNaN(parsed)) latVal = parsed
            }
            else if (k === 'lng' || k === 'long' || k === 'longitude' || k.includes('lng') || k.includes('long')) {
              const parsed = parseFloat(String(val).replace(',', '.'))
              if (!isNaN(parsed)) lngVal = parsed
            }
          })

          wilayahName = wilayahName || 'Banyumas'
          komoditas = komoditas || 'Komoditas Baru'
          gudang = gudang || 'Gudang Daerah'
          stok = stok || '100 Ton'
          minBuffer = minBuffer || '50 Ton'

          // Hitung status otomatis berdasarkan rasio ketersediaan buffer jika belum diset
          const stokNum = parseFloat(String(stok).replace(/[^0-9.]/g, '')) || 0
          const bufferNum = parseFloat(String(minBuffer).replace(/[^0-9.]/g, '')) || 1
          const ratio = Math.round((stokNum / bufferNum) * 100)

          if (!status || status.trim() === '' || status.toLowerCase() === 'aman') {
            if (ratio < 70) status = 'Kritis'
            else if (ratio < 100) status = 'Menipis'
            else status = 'Aman'
          }

          const WILAYAH_COORDS = {
            banyumas: { lat: -7.4247, lng: 109.2461 },
            purbalingga: { lat: -7.3890, lng: 109.3620 },
            banjarnegara: { lat: -7.3960, lng: 109.6970 },
            cilacap: { lat: -7.7260, lng: 109.0140 },
            kebumen: { lat: -7.6074, lng: 109.5143 }
          }
          const baseCoords = WILAYAH_COORDS[wilayahName.toLowerCase().replace(/[^a-z]/g, '')] || { lat: -7.44, lng: 109.22 }

          // Jitter offset if coordinates missing so markers for same region don't stack directly on top of each other
          const jitterLat = ((i % 5) - 2) * 0.008
          const jitterLng = (((i * 3) % 5) - 2) * 0.008

          const finalLat = latVal !== null ? latVal : Number((baseCoords.lat + jitterLat).toFixed(5))
          const finalLng = lngVal !== null ? lngVal : Number((baseCoords.lng + jitterLng).toFixed(5))
          const finalGmapsLink = gmapsUrl || `https://www.google.com/maps/search/?api=1&query=${finalLat},${finalLng}`

          importedItems.push({
            id: Date.now() + i,
            wilayahId: wilayahName.toLowerCase().replace(/[^a-z]/g, ''),
            wilayahName,
            komoditas,
            gudang,
            stok,
            minBuffer,
            status,
            lat: finalLat,
            lng: finalLng,
            gmapsLink: finalGmapsLink,
            terakhirUpdate: 'Baru saja diimport'
          })
        })
      } catch (err) {
        console.error('Failed to import file:', err)
      }
    }

    if (importedItems.length > 0) {
      setStokData(prev => [...importedItems, ...prev])
      window.alert(`Berhasil mengimpor ${importedItems.length} data stok komoditas baru!`)
    } else {
      window.alert('Gagal membaca file. Pastikan format file Excel/CSV sesuai.')
    }
  }

  // Hitung statistik ringkasan
  const totalStokAman = stokData.filter(i => i.status === 'Aman').length
  const totalStokMenipis = stokData.filter(i => i.status === 'Menipis').length
  const totalStokKritis = stokData.filter(i => i.status === 'Kritis').length

  // Map data stok ke pins lokasi Leaflet
  const WILAYAH_COORDS = {
    banyumas: { lat: -7.4247, lng: 109.2461 },
    purbalingga: { lat: -7.3890, lng: 109.3620 },
    banjarnegara: { lat: -7.3960, lng: 109.6970 },
    cilacap: { lat: -7.7260, lng: 109.0140 },
    kebumen: { lat: -7.6074, lng: 109.5143 }
  }

  const mapPins = filteredData.map((item, idx) => {
    const coords = WILAYAH_COORDS[item.wilayahId?.toLowerCase()] || { lat: -7.44, lng: 109.22 }
    const stokTon = parseFloat(String(item.stok).replace(/[^0-9.]/g, '')) || 100
    return {
      id: item.id,
      komoditas: item.komoditas,
      name: `${item.komoditas} (${item.gudang})`,
      lat: item.lat ?? coords.lat,
      lng: item.lng ?? coords.lng,
      gmapsLink: item.gmapsLink || `https://www.google.com/maps/search/?api=1&query=${item.lat ?? coords.lat},${item.lng ?? coords.lng}`,
      status: item.status,
      stok: item.stok,
      stokTon,
      qrisActivityNum: parseInt(item.qrisActivity) || (10 + (idx * 3)),
      avgPriceNum: item.avgPrice ? parseInt(item.avgPrice.replace(/[^0-9]/g, '')) : 25000
    }
  })

  const wilayahSummaryData = useMemo(() => {
    const regencies = ['banyumas', 'purbalingga', 'banjarnegara', 'cilacap', 'kebumen']
    const regencyNames = {
      banyumas: 'Banyumas',
      purbalingga: 'Purbalingga',
      banjarnegara: 'Banjarnegara',
      cilacap: 'Cilacap',
      kebumen: 'Kebumen'
    }
    const regencyCoords = {
      banyumas: { lat: -7.4247, lng: 109.2461 },
      purbalingga: { lat: -7.3890, lng: 109.3620 },
      banjarnegara: { lat: -7.3960, lng: 109.6970 },
      cilacap: { lat: -7.7260, lng: 109.0140 },
      kebumen: { lat: -7.6074, lng: 109.5143 }
    }

    return regencies.map(rId => {
      const items = stokData.filter(i => (i.wilayahId || i.wilayahName?.toLowerCase()) === rId)
      const hasKritis = items.some(i => i.status === 'Kritis')
      const hasMenipis = items.some(i => i.status === 'Menipis')

      let status = 'tinggi'
      if (hasKritis) status = 'kritis'
      else if (hasMenipis) status = 'waspada'

      const totalStokTon = items.reduce((sum, i) => sum + (parseFloat(String(i.stok).replace(/[^0-9.]/g, '')) || 0), 0)
      const stokFmt = totalStokTon > 0 ? `${Math.round(totalStokTon).toLocaleString('id-ID')} Ton` : '100 Ton'

      return {
        id: rId,
        name: regencyNames[rId],
        ...regencyCoords[rId],
        status,
        stok: stokFmt
      }
    })
  }, [stokData])

  // Fitur Unduh Template Excel / CSV
  function handleDownloadTemplate() {
    const headers = ['Wilayah', 'Nama Komoditas', 'Lokasi Gudang', 'Jumlah Stok', 'Minimum Buffer', 'Status', 'Latitude', 'Longitude', 'Link Google Maps']
    const sampleRows = [
      ['Banyumas', 'Beras Medium Pandan Wangi', 'Gudang Bulog Sub-Divre Pasuruan', '1,450 Ton', '500 Ton', 'Aman', '-7.4247', '109.2461', 'https://www.google.com/maps/search/?api=1&query=-7.4247,109.2461'],
      ['Purbalingga', 'Beras Super Pulen', 'Gudang Pangan Bobotsari', '890 Ton', '300 Ton', 'Aman', '-7.3890', '109.3620', 'https://www.google.com/maps/search/?api=1&query=-7.3890,109.3620'],
      ['Banjarnegara', 'Cabai Merah Keriting', 'Pasar Induk Banjarnegara', '28 Ton', '50 Ton', 'Kritis', '-7.3960', '109.6970', 'https://www.google.com/maps/search/?api=1&query=-7.3960,109.6970'],
      ['Cilacap', 'Ikan Laut & Seafood', 'Cold Storage TPI Sidakaya', '650 Ton', '200 Ton', 'Aman', '-7.7260', '109.0140', 'https://www.google.com/maps/search/?api=1&query=-7.7260,109.0140'],
      ['Kebumen', 'Daging Sapi Segar', 'RPH & Cold Storage Gombong', '18 Ton', '40 Ton', 'Kritis', '-7.6074', '109.5143', 'https://www.google.com/maps/search/?api=1&query=-7.6074,109.5143']
    ]

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `template-import-stok-komoditas.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand text-xs font-semibold uppercase tracking-wider mb-1">
            <Package size={16} />
            <span>Peta & Monitoring Stok Komoditas</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Monitoring & Ketahanan Stok Pangan
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Pantau sebaran ketersediaan stok pangan utama di 5 wilayah kabupaten secara real-time.
          </p>
        </div>

        {/* Action Buttons: Template, Import & Export */}
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-ink-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors border border-surface-border"
              title="Unduh format file Excel/CSV yang sesuai"
            >
              <Download size={14} className="text-slate-600" />
              Unduh Template
            </button>
            <button
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.csv, .xlsx, .xls'
                input.onchange = (e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length > 0) handleImportExcel(files)
                }
                input.click()
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white text-ink-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors border border-surface-border shadow-sm"
            >
              <Upload size={15} className="text-brand" />
              Import Excel / CSV
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-3.5 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand/90 transition-colors shadow-sm"
            >
              <FileSpreadsheet size={15} />
              Export Laporan
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Section — Berbasis Rasio Keterpenuhan Buffer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Rata-Rata Keterpenuhan Buffer</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink-900">
            {filteredData.length > 0
              ? Math.round(filteredData.reduce((acc, i) => acc + calcBufferRatio(i.stok, i.minBuffer), 0) / filteredData.length)
              : 0}%
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <CheckCircle2 size={14} />
            <span>Target Minimum: 100% Buffer</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Stok Terpenuhi (&ge; 100%)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink-900">{totalStokAman} Komoditas</div>
          <div className="text-xs text-ink-500 mt-2">Buffer aman melampaui target</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Waspada Buffer (70-99%)</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink-900">{totalStokMenipis} Komoditas</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600">
            <ArrowDownRight size={14} />
            <span>Di bawah ambang 100% buffer</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Peringatan Kritis (&lt; 70%)</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600">{totalStokKritis} Komoditas</div>
          <div className="text-xs text-rose-500 font-medium mt-2">Segera alokasikan pasokan tambahan</div>
        </div>
      </div>

      {/* Commodity Category Filter Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-surface-border shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-ink-700 uppercase tracking-wider px-1">
          <Layers size={16} className="text-brand shrink-0" />
          <span>FILTER KATEGORI KOMODITAS:</span>
        </div>

        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <select
            value={komoditasFilter}
            onChange={(e) => setKomoditasFilter(e.target.value)}
            className="w-full appearance-none bg-surface-muted border border-surface-border text-ink-900 text-xs sm:text-sm font-bold rounded-xl py-2 px-3.5 pr-9 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer shadow-2xs transition-all"
          >
            {availableCategories.map((catLabel) => {
              const catKey = catLabel === 'Semua Komoditas' ? 'Semua' : catLabel
              return (
                <option key={catLabel} value={catKey} className="font-semibold text-ink-900">
                  {catLabel === 'Semua' || catLabel === 'Semua Komoditas' ? 'Semua Komoditas Pangan' : catLabel}
                </option>
              )
            })}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </div>

      {/* Stock Metric Tab Toolbar */}
      <div className="flex items-center bg-white border border-surface-border rounded-xl p-1 shadow-card w-full sm:w-auto self-start">
        {stockMetricOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setStockMetric(opt.key)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center whitespace-nowrap ${
              stockMetric === opt.key ? 'bg-brand text-white shadow-sm' : 'text-ink-700 hover:bg-surface-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Banner Info Surplus & Potensi Kerjasama Antar Daerah (KAD) */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-brand/10 to-blue-500/10 border border-brand/20 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-brand text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
            <RefreshCw size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-ink-900 text-sm">Info Surplus & Potensi Kerjasama Antar Daerah (KAD)</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Surplus +{dynamicKadSummary.totalSurplusFormatted} Ton
              </span>
            </div>
            <p className="text-xs text-ink-600 leading-relaxed">
              Kabupaten <strong className="text-emerald-700 font-semibold">{dynamicKadSummary.surplusText}</strong> memiliki cadangan stok pangan melimpah. Siap dialokasikan via <strong>KAD / Transfer Stok BI</strong> untuk menopang wilayah defisit di <strong className="text-rose-600 font-semibold">{dynamicKadSummary.deficitText}</strong>.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 border-t md:border-t-0 border-brand/10 pt-2 md:pt-0">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Penyelesaian Transaksi KAD</p>
            <p className="text-xs font-semibold text-brand">QRIS B2B Wholesale Settlement</p>
          </div>
        </div>
      </div>

      {/* Grid Rekomendasi Pasokan & Integrasi UMKM per Kabupaten (Clean & Non-Overlapping) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
        {dynamicRegencyRecommendations.slice(0, 3).map((rec, idx) => (
          <div
            key={rec.regencyName + idx}
            className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between space-y-3 transition-all ${rec.cardStyle}`}
          >
            {/* Header: Regency Name + Short Badge */}
            <div className="flex items-start justify-between gap-2 border-b border-black/5 pb-2.5">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-widest block mb-0.5">
                  Kabupaten
                </span>
                <h4 className="text-sm font-semibold text-ink-900 truncate">
                  {rec.regencyName}
                </h4>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase shrink-0 shadow-xs ${rec.badgeTagStyle}`}>
                {rec.shortStatusBadge}
              </span>
            </div>

            {/* Content: Recommendation */}
            <div className="flex-1 space-y-1">
              <p className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                Rekomendasi Pasokan:
              </p>
              <p className="text-xs text-ink-900 font-semibold leading-relaxed">
                {rec.recommendationText}
              </p>
            </div>

            {/* Footer: UMKM Count */}
            <div className="pt-2 flex items-center justify-between text-xs font-semibold border-t border-black/10">
              <span className="text-ink-500 font-semibold">Merchant UMKM Terkait:</span>
              <strong className="text-brand font-semibold">{rec.umkmCount} QRIS Merchant</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Utama: Heatmap Map + Alert Sidebar (Animasi Buka/Tutup Sidebar) */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch transition-all duration-300 ease-in-out">
        {/* Area Utama: Peta atau Chart Analytics tergantung Tab terpilih */}
        <div
          className={`relative h-[450px] sm:h-[540px] rounded-2xl overflow-hidden border border-surface-border shadow-card bg-white transition-all duration-300 ease-in-out ${
            isAlertSidebarOpen ? 'w-full xl:w-[calc(100%-344px)]' : 'w-full'
          }`}
        >
          {stockMetric === 'volumeStok' ? (
            <>
              <StokMapLeaflet
                metric={stockMetric}
                pins={mapPins}
                selectedId={selectedWilayahId}
                onSelect={(id) => setSelectedWilayahId(id)}
                wilayahSummaryData={wilayahSummaryData}
                sidebarOpen={isAlertSidebarOpen}
              />
              <StokMapLegend metric={stockMetric} />

              {/* Floating Re-Open Button for Alert Sidebar when Closed */}
              {!isAlertSidebarOpen && (
                <button
                  onClick={() => setIsAlertSidebarOpen(true)}
                  className="absolute top-3 right-16 bg-white/95 backdrop-blur hover:bg-white text-ink-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md border border-surface-border z-[500] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 animate-float-in"
                  title="Buka Alert Restock Komoditas"
                >
                  <AlertTriangle size={15} className="text-rose-500 shrink-0" />
                  <span>Alert Restock ({stokData.filter(i => i.status !== 'Aman').length})</span>
                  <ChevronLeft size={16} className="text-brand shrink-0" />
                </button>
              )}

              {/* Floating Stock Detail Panel */}
              {selectedStockItem && (
                <StokDetailPanel
                  item={selectedStockItem}
                  onClose={() => setSelectedWilayahId(null)}
                  isAdmin={isAdmin}
                />
              )}
            </>
          ) : (
            <StokChartAnalytics
              metric={stockMetric}
              stokData={stokData}
              komoditasFilter={komoditasFilter}
            />
          )}
        </div>

        {/* Panel Alert Restock & Ringkasan Wilayah (Dapat ditutup / dibuka dengan animasi) */}
        {isAlertSidebarOpen && (
          <div className="w-full xl:w-[320px] shrink-0 bg-white p-5 rounded-2xl border border-surface-border shadow-sm flex flex-col justify-between space-y-4 transition-all duration-300 animate-float-in">
            <div>
              <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-3">
                <h3 className="font-extrabold text-ink-900 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-500" />
                  Alert Restock Komoditas
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Prioritas
                  </span>
                  <button
                    onClick={() => setIsAlertSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-surface-muted text-ink-400 hover:text-rose-600 transition-colors"
                    title="Tutup Sidebar Alert (Peta Melebar Penuh)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {stokData.filter(i => i.status !== 'Aman').map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      item.status === 'Kritis'
                        ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm">{item.komoditas}</p>
                      <p className="text-[11px] opacity-80 mt-0.5">{item.gudang} ({item.wilayahName})</p>
                      <p className="font-semibold mt-1">Stok: {item.stok} (Min: {item.minBuffer})</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase shrink-0 ${
                      item.status === 'Kritis' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
                {stokData.filter(i => i.status !== 'Aman').length === 0 && (
                  <div className="py-8 text-center text-xs text-ink-400">
                    Semua stok komoditas dalam keadaan aman (memenuhi buffer).
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border text-xs text-ink-400 flex items-center justify-between">
              <span>Terakhir diperbarui:</span>
              <span className="font-semibold text-ink-700">Hari ini, {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabel Detail & Pencarian Stok */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Cari komoditas, gudang, atau wilayah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-muted rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-ink-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-surface-muted border border-surface-border rounded-xl text-sm font-medium text-ink-700 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aman">Aman</option>
              <option value="Menipis">Menipis</option>
              <option value="Kritis">Kritis</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted/50 text-ink-500 text-xs uppercase font-semibold border-b border-surface-border">
                <th className="py-3.5 px-6">Wilayah</th>
                <th className="py-3.5 px-4">Nama Komoditas</th>
                <th className="py-3.5 px-4">Lokasi Gudang</th>
                <th className="py-3.5 px-4">Jumlah Stok</th>
                <th className="py-3.5 px-4">Min. Buffer</th>
                <th className="py-3.5 px-4">% Keterpenuhan Buffer</th>
                <th className="py-3.5 px-4">Status Ketersediaan</th>
                <th className="py-3.5 px-6 text-right">Update Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {filteredData
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((item) => {
                  const bufferRatio = calcBufferRatio(item.stok, item.minBuffer)
                  return (
                    <tr key={item.id} className="hover:bg-surface-muted/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-ink-900">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
                          <MapPin size={12} className="text-brand" />
                          {item.wilayahName}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-ink-900">{item.komoditas}</td>
                      <td className="py-4 px-4 text-ink-600 flex items-center gap-1.5">
                        <Building size={14} className="text-ink-400 shrink-0" />
                        <span>{item.gudang}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-ink-900">{item.stok}</td>
                      <td className="py-4 px-4 text-ink-500 font-medium">{item.minBuffer}</td>
                      <td className="py-4 px-4">
                        <div className="w-36 space-y-1">
                          <div className="flex items-center justify-between text-xs font-extrabold">
                            <span className={bufferRatio >= 100 ? 'text-emerald-600' : bufferRatio >= 70 ? 'text-amber-600' : 'text-rose-600'}>
                              {bufferRatio}%
                            </span>
                            <span className="text-[10px] text-ink-400 font-normal">
                              {bufferRatio >= 100 ? 'Tercapai' : 'Defisit'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                bufferRatio >= 100 ? 'bg-emerald-500' : bufferRatio >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(bufferRatio, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                            item.status === 'Aman'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.status === 'Menipis'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.status === 'Aman' && <CheckCircle2 size={12} />}
                          {item.status === 'Menipis' && <Clock size={12} />}
                          {item.status === 'Kritis' && <AlertTriangle size={12} />}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-xs text-ink-400 font-medium">
                        {item.terakhirUpdate}
                      </td>
                    </tr>
                  )
                })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-ink-400 text-sm">
                    Tidak ada data stok komoditas yang sesuai kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="p-4 bg-surface-muted/30 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-ink-500 font-medium">
            Menampilkan <strong className="text-ink-900">{filteredData.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</strong> - <strong className="text-ink-900">{Math.min(currentPage * 10, filteredData.length)}</strong> dari <strong className="text-ink-900">{filteredData.length}</strong> data stok komoditas
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white border border-surface-border rounded-xl font-bold text-ink-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1.5 font-bold text-brand bg-brand/10 rounded-xl">
              Halaman {currentPage} dari {Math.max(1, Math.ceil(filteredData.length / 10))}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / 10), p + 1))}
              disabled={currentPage >= Math.ceil(filteredData.length / 10)}
              className="px-3 py-1.5 bg-white border border-surface-border rounded-xl font-bold text-ink-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

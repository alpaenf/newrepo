/**
 * StokMapLeaflet.jsx — Peta Sebaran Stok & Ketahanan Pangan
 *
 * Reverse-engineered dari peta Tumbasna + QRIS Marker Clustering:
 *  - GeoJSON Polygons batas wilayah administratif Jawa Tengah (jawaTengahGeoJSON.json)
 *  - Warna wilayah: Hijau (#10B981) untuk Stok Aman/Tinggi & Merah (#EF4444) untuk Kritis/Menipis
 *  - Region Center Badges (Pill badge "• Banyumas", "• Cilacap", "• Kebumen", "• Banjarnegara", "• Purbalingga")
 *  - Dynamic Zoom Visibility Control: Region Pill Badges akan OTOMATIS HILANG saat peta di-zoom out (< 9 zoom) agar tidak bertumpukan
 *  - Pin Icons Tumbasna: Orange drop pin (Stok/Supplier) & Blue drop pin (Gudang/Buyer)
 *  - Marker Cluster Group: Menggabungkan pin yang berdekatan saat zoom-out dengan animasi badge lingkaran & spiderfy
 *  - Tile Layer: Options Satelit (Google Earth), Google Terrain, & OpenStreetMap
 *  - Smooth Auto-pan ke wilayah terpilih
 */

import React, { useEffect, useRef, useState, memo } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { kabupatenGeoJSON as jawaTengahGeoJSON } from '../data/kabupatenGeoJSON.js'
import { brandPinIcon, clusterIconCreate } from './brand-pin.js'

function isMapAlive(map) {
  if (!map) return false
  try {
    const container = map.getContainer?.()
    return !!(container && container.isConnected)
  } catch {
    return false
  }
}

// ─── Auto-pan to selected region ──────────────────────────────
function PanToSelected({ selected, pins }) {
  const map = useMap()
  useEffect(() => {
    if (!selected || !map) return
    const p = pins.find(x => String(x.id).toLowerCase() === String(selected).toLowerCase() || String(x.wilayahId).toLowerCase() === String(selected).toLowerCase())
    if (p) {
      const timer = setTimeout(() => {
        try {
          if (isMapAlive(map) && map._loaded) {
            map.flyTo([p.lat, p.lng], 10, { duration: 1.2 })
          }
        } catch (e) {
          console.warn('PanToSelected flyTo warning:', e)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [selected, pins, map])
  return null
}

// ─── Marker Cluster Group Component ──────────────────────────
function StokMarkerClusterGroup({ pins, onSelect, selectedId }) {
  const map = useMap()
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!isMapAlive(map)) return
    if (typeof L.markerClusterGroup !== 'function') return

    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 16,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: clusterIconCreate
    })

    const markersById = new Map()

    for (let idx = 0; idx < pins.length; idx++) {
      const pin = pins[idx]
      if (!Number.isFinite(pin.lat) || !Number.isFinite(pin.lng)) continue

      const marker = L.marker([pin.lat, pin.lng], { icon: brandPinIcon, title: pin.komoditas || pin.name })

      const isAman = pin.status === 'Aman'
      const isMenipis = pin.status === 'Menipis'
      const statusColor = isAman ? '#22B07D' : isMenipis ? '#F5A623' : '#E85D2F'

      const tooltipContent = `
        <div style="font-family:'Inter',sans-serif;padding:3px 6px;">
          <div style="font-weight:700;font-size:12px;color:#1A1D29;">${pin.komoditas || pin.name}</div>
          <div style="font-size:11px;color:#6B7280;margin-top:2px;">
            Stok: <strong style="color:#045498;">${pin.stok || '-'}</strong> · <span style="color:${statusColor};font-weight:600;">${pin.status || 'Aman'}</span>
          </div>
        </div>`

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -36],
        opacity: 0.95
      })

      marker.on('click', () => onSelectRef.current?.(pin.id))

      group.addLayer(marker)
      markersById.set(pin.id, marker)
    }

    try { map.addLayer(group) } catch { return }

    if (selectedId) {
      const m = markersById.get(selectedId)
      if (m && typeof group.zoomToShowLayer === 'function') {
        try { group.zoomToShowLayer(m) } catch { /* ignore */ }
      }
    }

    return () => {
      try { if (isMapAlive(map) && map.hasLayer(group)) map.removeLayer(group) } catch { /* ignore */ }
      try { group.clearLayers() } catch { /* ignore */ }
    }
  }, [map, pins, selectedId])

  return null
}

// Data Wilayah Kabupaten bawaan Tumbasna
const defaultWilayahData = [
  { id: 'banyumas', name: 'Banyumas', lat: -7.4247, lng: 109.2461, status: 'tinggi', stok: '1,770 Ton', transaksi: 42 },
  { id: 'purbalingga', name: 'Purbalingga', lat: -7.3890, lng: 109.3620, status: 'tinggi', stok: '1,010 Ton', transaksi: 35 },
  { id: 'banjarnegara', name: 'Banjarnegara', lat: -7.3960, lng: 109.6970, status: 'kritis', stok: '28 Ton', transaksi: 12 },
  { id: 'cilacap', name: 'Cilacap', lat: -7.7260, lng: 109.0140, status: 'tinggi', stok: '650 Ton', transaksi: 28 },
  { id: 'kebumen', name: 'Kebumen', lat: -7.6074, lng: 109.5143, status: 'kritis', stok: '18 Ton', transaksi: 15 }
]

export function StokMapLegend({ metric }) {
  return (
    <div className="absolute left-2.5 sm:left-3 bottom-2.5 sm:bottom-3 flex flex-col gap-1.5 bg-white/95 backdrop-blur px-3 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-medium text-ink-500 shadow-card border border-surface-border z-[500] max-w-[calc(100%-20px)] sm:max-w-xs">
      <div className="text-ink-700 font-semibold truncate">Status Sebaran Stok Pangan</div>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] sm:text-[10px]">
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 bg-[#22B07D]" />
          <span>Aman</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 bg-[#F5A623]" />
          <span>Waspada</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 bg-[#E85D2F]" />
          <span>Kritis</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5 pt-1.5 border-t border-surface-border mt-0.5 text-[9px] sm:text-[10px]">
        <svg width="12" height="12" viewBox="0 0 36 44" fill="none" className="shrink-0">
          <path d="M18 42C18 42 32 28.5 32 16.5C32 8.5 25.7 2 18 2C10.3 2 4 8.5 4 16.5C4 28.5 18 42 18 42Z" fill="#1266A8" stroke="#0B2E4A" strokeWidth="2"/>
          <circle cx="18" cy="16.5" r="6" fill="#FFFFFF"/>
          <circle cx="18" cy="16.5" r="3" fill="#F28A24"/>
        </svg>
        <span className="truncate">Lokasi Stok Pangan (Gudang/Supplier)</span>
      </div>
    </div>
  )
}

// ─── Map Zoom Event Tracker ──────────────────────────────────
function MapZoomTracker({ onZoomChange, zoomRef }) {
  const map = useMapEvents({
    zoom() {
      if (map) {
        const z = map.getZoom()
        zoomRef.current = z
        onZoomChange(z)
      }
    },
    zoomend() {
      if (map) {
        const z = map.getZoom()
        zoomRef.current = z
        onZoomChange(z)
      }
    }
  })
  return null
}

// ─── Map Resize Tracker for smooth Sidebar toggle expansion ───
function MapResizeTracker({ sidebarOpen }) {
  const map = useMap()
  useEffect(() => {
    if (!map) return
    const timer = setTimeout(() => {
      try {
        if (isMapAlive(map)) {
          map.invalidateSize({ animate: true })
        }
      } catch (e) {
        console.warn(e)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [sidebarOpen, map])
  return null
}

export default memo(function StokMapLeaflet({ pins = [], selectedId, onSelect, wilayahSummaryData, sidebarOpen = true }) {
  const [mounted, setMounted] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(9)
  const zoomLevelRef = useRef(9)

  useEffect(() => {
    setMounted(true)
  }, [])

  const center = [-7.45, 109.35]
  const wilayahList = wilayahSummaryData || defaultWilayahData

  const geoJsonStyle = (feature) => {
    const name = feature?.properties?.name || ''
    const id = feature?.properties?.id || name.toLowerCase()
    const w = wilayahList.find(x => x.id.toLowerCase() === id.toLowerCase() || x.name.toLowerCase() === name.toLowerCase())

    const z = zoomLevelRef.current || zoomLevel || 9

    const hasData = Boolean(w)
    const isAman = Boolean(w && (w.status === 'tinggi' || w.status === 'Aman'))
    const isMenipis = Boolean(w && (w.status === 'menipis' || w.status === 'Menipis' || w.status === 'waspada'))
    const isSelected = Boolean(selectedId && String(selectedId).toLowerCase() === id.toLowerCase())

    let baseColor = '#94A3B8'
    let selColor = '#334155'
    let strokeColor = '#FFFFFF'

    if (hasData) {
      if (isAman) {
        baseColor = '#10B981'
        selColor = '#047857'
        strokeColor = isSelected ? '#34D399' : '#FFFFFF'
      } else if (isMenipis) {
        baseColor = '#F5A623'
        selColor = '#D97706'
        strokeColor = isSelected ? '#FCD34D' : '#FFFFFF'
      } else {
        baseColor = '#EF4444'
        selColor = '#B91C1C'
        strokeColor = isSelected ? '#FCA5A5' : '#FFFFFF'
      }
    }

    // Dynamic Opacity calculation based on Zoom Level
    let baseOpacity = isSelected ? 0.45 : (hasData ? 0.35 : 0.2)
    if (z >= 11) {
      baseOpacity = 0.02 // Memudar TOTAL (hampir transparan murni) saat zoom mikro (street/satellite level)
    } else if (z >= 10) {
      baseOpacity = 0.1
    }

    return {
      fillColor: isSelected ? selColor : baseColor,
      weight: isSelected ? 3.5 : (z >= 11 ? 1.5 : 2),
      opacity: z >= 11 ? 0.35 : 0.95,
      color: strokeColor,
      fillOpacity: baseOpacity,
      dashArray: isSelected ? '' : (hasData ? '3' : '5')
    }
  }

  const onEachFeature = (feature, layer) => {
    const name = feature?.properties?.name || ''
    const id = feature?.properties?.id || name.toLowerCase()
    const w = wilayahList.find(x => x.id.toLowerCase() === id.toLowerCase() || x.name.toLowerCase() === name.toLowerCase())

    layer.on({
      mouseover: (e) => {
        const l = e.target
        const z = zoomLevelRef.current || 9
        l.setStyle({
          fillOpacity: z >= 11 ? 0.05 : 0.6,
          weight: 3,
          color: '#10B981'
        })
      },
      mouseout: (e) => {
        const l = e.target
        l.setStyle(geoJsonStyle(feature))
      },
      click: () => {
        if (onSelect) onSelect(id)
      }
    })

    if (name) {
      const stokFmt = w ? `Total Stok: ${w.stok}` : 'Status Stok Terpantau'
      const tooltipContent = `
        <div style="font-family: Inter, sans-serif; padding: 2px 4px;">
          <strong style="font-size: 12px; color: #1A1D29;">Kabupaten ${name}</strong>
          <br/>
          <span style="font-size: 11px; color: #045498; font-weight: 600;">${stokFmt}</span>
        </div>`
      layer.bindTooltip(tooltipContent, { direction: 'top', sticky: true, opacity: 0.95 })
    }
  }

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[450px] relative bg-slate-100/70 rounded-2xl overflow-hidden animate-pulse flex flex-col items-center justify-center border border-slate-200/50">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Peta Stok Tumbasna...</span>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        key="tumbasna-stok-map-root"
        center={center}
        zoom={9}
        maxBounds={[[-12.0, 94.0], [8.0, 142.5]]}
        maxBoundsViscosity={1.0}
        minZoom={7}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* Layers Control Mode Satelit & Map Type Selector */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satelit (Google Earth)">
            <TileLayer
              attribution="&copy; Google Earth"
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Peta Kontur (Google Terrain)">
            <TileLayer
              attribution="&copy; Google Maps"
              url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Peta Ringkas (OpenStreetMap)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Track map zoom level & sidebar resize expansion */}
        <MapZoomTracker onZoomChange={setZoomLevel} zoomRef={zoomLevelRef} />
        <MapResizeTracker sidebarOpen={sidebarOpen} />

        {/* Auto-pan ke wilayah terpilih */}
        <PanToSelected selected={selectedId} pins={pins} />

        {/* CSS transition for smooth polygon opacity fading */}
        <style>{`
          .leaflet-interactive {
            transition: fill-opacity 0.45s ease-in-out, opacity 0.45s ease-in-out, fill 0.3s ease !important;
          }
        `}</style>

        {/* 1. Administrative Boundaries (GeoJSON Polygons Jawa Tengah) */}
        {jawaTengahGeoJSON && (
          <GeoJSON
            key={`${selectedId}-${zoomLevel >= 11 ? 'micro' : 'macro'}`}
            data={jawaTengahGeoJSON}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* 2. Animated Marker Cluster Group */}
        <StokMarkerClusterGroup
          pins={pins}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      </MapContainer>
    </div>
  )
})

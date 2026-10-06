import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, useMap, LayersControl, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MarkerClusterGroup } from './MarkerClusterGroup.jsx'
import { tierPinIcon } from './brand-pin.js'
import { kabupatenBoundaries } from '../data/kabupatenBoundaries.js'

function FlyToUmkm({ selected }) {
  const map = useMap()
  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 12, { duration: 0.6 })
    }
  }, [selected, map])
  return null
}

function FlyToKabupaten({ selected }) {
  const map = useMap()
  const bounds = useMemo(() => {
    const kb = kabupatenBoundaries.find((k) => k.name === selected)
    if (!kb) return null
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180
    for (const poly of kb.polys) {
      for (const ring of poly) {
        for (const [lng, lat] of ring) {
          if (lat < minLat) minLat = lat
          if (lat > maxLat) maxLat = lat
          if (lng < minLng) minLng = lng
          if (lng > maxLng) maxLng = lng
        }
      }
    }
    return L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng))
  }, [selected])

  useEffect(() => {
    if (bounds && selected) {
      // Panel ringkasan jadi sidebar kanan (lebar 340px) mulai breakpoint `sm`
      // Tailwind, yang mengacu ke lebar viewport — bukan lebar peta. Di bawah itu
      // panel jadi bottom sheet setinggi ~85% peta, jadi offset tak menolong.
      const { x } = map.getSize()
      const panelIsSidebar = window.innerWidth >= 640
      map.flyToBounds(bounds, {
        paddingTopLeft: [24, 24],
        paddingBottomRight: panelIsSidebar ? [Math.min(356, Math.round(x * 0.55)), 24] : [24, 24],
        duration: 0.8
      })
    }
  }, [bounds, selected, map])
  return null
}

function KabupatenBoundaryLayer({ selected, onSelect }) {
  return (
    <>
      {kabupatenBoundaries.map((kb) => {
        const isSelected = selected === kb.name
        const dimmed = selected !== null && selected !== 'Semua' && !isSelected
        return (
          <GeoJSON
            key={kb.kode}
            data={{
              type: 'Feature',
              properties: { name: kb.name },
              geometry: { type: 'MultiPolygon', coordinates: kb.polys }
            }}
            style={() => ({
              color: kb.color,
              weight: isSelected ? 3.5 : 1.5,
              opacity: isSelected ? 1 : dimmed ? 0.3 : 0.85,
              dashArray: isSelected ? '0' : '6 4',
              fillColor: kb.color,
              fillOpacity: isSelected ? 0.16 : dimmed ? 0.03 : 0.1,
              interactive: true,
              cursor: 'pointer'
            })}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(`<span style="font-weight:600;font-size:11px;color:#1e293b;">Kab. ${feature.properties.name}</span>`, {
                sticky: true,
                direction: 'top',
                className: 'kabupaten-boundary-tooltip'
              })
              layer.on('click', () => onSelect(feature.properties.name))
            }}
          />
        )
      })}
    </>
  )
}

export default function ExportMap({ selectedId, onSelect, selectedKabupaten, onSelectKabupaten, data }) {
  return (
    <MapContainer
      center={[-7.44, 109.22]}
      zoom={10}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Peta Kontur (Google Terrain)">
          <TileLayer
            attribution="&copy; Google Maps"
            url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Satelit (Google Earth)">
          <TileLayer
            attribution="&copy; Google Earth"
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Peta Ringkas (OpenStreetMap)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <FlyToUmkm selected={data.find((u) => u.id === selectedId)} />
      <FlyToKabupaten selected={selectedKabupaten} />

      <KabupatenBoundaryLayer selected={selectedKabupaten} onSelect={onSelectKabupaten} />

      <MarkerClusterGroup
        pins={data}
        onPinClick={(pin) => onSelect(pin.id)}
        focusId={selectedId}
        getIcon={(pin, selected) => tierPinIcon(pin.tierColor, selected)}
        getTooltip={(pin) => `
          <div style="font-family: 'Inter', sans-serif;">
            <span style="font-weight: 600; font-size: 12px; color: #1e293b;">${pin.name}</span>
            <br />
            <span style="font-size: 11px; color: #64748b;">${pin.komoditas} · Skor Kesiapan: ${pin.readinessScore}</span>
          </div>
        `}
      />
    </MapContainer>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { kecamatanZonation } from '../data/heatmapData.js'
import { MarkerClusterGroup } from './MarkerClusterGroup.jsx'

const metricColorRamp = {
  merchantDensity: ['#2E7D32', '#81C784', '#FBC02D', '#5D4037'],
  transactionVolume: ['#4CAF50', '#81C784', '#FBC02D', '#D32F2F'],
  fraudRisk: ['#388E3C', '#FBC02D', '#E64A19', '#D32F2F']
}

// Menempelkan Leaflet.heat sebagai layer imperatif di atas peta React-Leaflet,
// karena leaflet.heat tidak punya wrapper komponen resmi.
function HeatLayer({ metric, range, data }) {
  const map = useMap()
  const layerRef = useRef(null)

  const points = useMemo(
    () =>
      data.map((k) => {
        const rangeFactor = range === '7d' ? 1 : range === '30d' ? 0.92 : 0.88
        const weight = (k.metricWeights[metric] || 0.5) * rangeFactor
        return [k.lat, k.lng, weight]
      }),
    [data, metric, range]
  )

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
      layerRef.current = null
    }

    if (points.length === 0) return

    const ramp = metricColorRamp[metric] || ['#4CAF50', '#81C784', '#FBC02D', '#D32F2F']
    const gradient = {
      0.2: ramp[0],
      0.45: ramp[1],
      0.7: ramp[2],
      1: ramp[3]
    }
    // eslint-disable-next-line no-undef
    const heat = L.heatLayer(points, {
      radius: 42,
      blur: 30,
      maxZoom: 12,
      minOpacity: 0.35,
      gradient
    })
    heat.addTo(map)
    layerRef.current = heat

    return () => {
      map.removeLayer(heat)
    }
  }, [map, points, metric])

  return null
}

function FlyToKecamatan({ selected }) {
  const map = useMap()
  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 11.5, { duration: 0.6 })
    }
  }, [selected, map])
  return null
}

export default function HeatmapMap({ metric, range, selectedId, onSelect, data }) {
  const mapData = data || kecamatanZonation

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
        <LayersControl.BaseLayer name="Peta Ringkas (CARTO Light)">
          <TileLayer
            attribution='&copy; OpenStreetMap &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <HeatLayer metric={metric} range={range} data={mapData} />
      <FlyToKecamatan selected={mapData.find((k) => k.id === selectedId)} />

      <MarkerClusterGroup
        pins={mapData}
        onPinClick={(pin) => onSelect(pin.id)}
        focusId={selectedId}
      />
    </MapContainer>
  )
}
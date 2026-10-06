import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, useMap, LayersControl, GeoJSON, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MarkerClusterGroup } from './MarkerClusterGroup.jsx'
import { kabupatenGeoJSON } from '../data/kabupatenGeoJSON.js'
import { kabupatenPADData } from '../data/kabupatenPADData.js'
import { banyumasPajakNegaraRaw, sdaSectorData } from '../data/banyumasPajakNegaraData.js'

const metricColorRamp = {
  pbjt: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  pbb: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  bphtb: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  ppn: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  pph: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  kepatuhan: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  penerimaan: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  wajibPajak: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  lapor: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50'],
  bayar: ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50']
}

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

    const ramp = metricColorRamp[metric] || ['#D32F2F', '#FBC02D', '#81C784', '#4CAF50']
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

function FlyToRegency({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 10, { duration: 0.6 })
    }
  }, [center, zoom, map])
  return null
}

const PANE_STYLE_ID = 'pajak-map-pane-styles'

function MapPanesSetup() {
  const map = useMap()
  useEffect(() => {
    if (!map) return

    // 1. Inject CSS !important rules — paling robust, tidak tergantung timing
    if (!document.getElementById(PANE_STYLE_ID)) {
      const style = document.createElement('style')
      style.id = PANE_STYLE_ID
      style.textContent = `
        .leaflet-pane.leaflet-geojsonPane-pane {
          z-index: 250 !important;
          pointer-events: none !important;
        }
        .leaflet-pane.leaflet-overlay-pane {
          z-index: 400 !important;
        }
        .leaflet-pane.leaflet-marker-pane,
        .leaflet-pane.leaflet-shadow-pane {
          z-index: 600 !important;
        }
        .leaflet-pane.leaflet-tooltip-pane {
          z-index: 650 !important;
        }
        .leaflet-pane.leaflet-popup-pane {
          z-index: 700 !important;
        }
      `
      document.head.appendChild(style)
    }

    // 2. Create pane secara programatik sebagai backup
    const geojsonPane = map.getPane('geojsonPane') || map.createPane('geojsonPane')
    geojsonPane.style.zIndex = '250'
    geojsonPane.style.pointerEvents = 'none'
  }, [map])
  return null
}

const regencyColors = {
  Banyumas: '#3b82f6',
  Purbalingga: '#f5a623',
  Banjarnegara: '#ef4444',
  Cilacap: '#10b981',
  Kebumen: '#8b5cf6'
}

const getPinLabelAndValue = (kab, metric, isDaerah = true, range = '2024') => {
  if (isDaerah) {
    if (metric === 'penerimaan') {
      const val = kab.padTotal
      const formatted = val >= 1e9 ? `Rp ${(val / 1e9).toFixed(1)} M` : `Rp ${(val / 1e6).toFixed(0)} Jt`
      return { label: 'Total PAD', value: formatted }
    } else if (metric === 'wajibPajak') {
      const val = kab.pajak.kanal.qris
      const formatted = val >= 1e9 ? `Rp ${(val / 1e9).toFixed(2)} M` : `Rp ${(val / 1e6).toFixed(1)} Jt`
      return { label: 'Pajak QRIS', value: formatted }
    } else if (metric === 'lapor') {
      const val = kab.pajakRetribusiNontunai
      const formatted = val >= 1e9 ? `Rp ${(val / 1e9).toFixed(1)} M` : `Rp ${(val / 1e6).toFixed(0)} Jt`
      return { label: 'Total PAD Nontunai', value: formatted }
    } else if (metric === 'bayar') {
      const val = kab.retribusi.kanal.qris
      const formatted = val >= 1e9 ? `Rp ${(val / 1e9).toFixed(2)} M` : `Rp ${(val / 1e6).toFixed(1)} Jt`
      return { label: 'Retribusi QRIS', value: formatted }
    }
  } else {
    // Pajak Pemerintah Pusat
    let baseVal = 0
    let label = ''
    let isCount = false

    if (metric === 'penerimaan') {
      label = 'PPh Orang Pribadi'
      baseVal = range === '2024' ? 641077660390 : range === '2025' ? 638283813809 : 295400000000
    } else if (metric === 'wajibPajak') {
      label = 'Total Bayar'
      baseVal = range === '2024' ? 10850 : range === '2025' ? 10247 : 3289
      isCount = true
    } else if (metric === 'lapor') {
      label = 'Total SDA'
      baseVal = range === '2024' ? 115177566395 : range === '2025' ? 58529127939 : 28329171069
    } else if (metric === 'bayar') {
      label = 'PPh Badan UMKM'
      baseVal = range === '2024' ? 160269415097 : range === '2025' ? 159570953452 : 73850000000
    }

    let multiplier = 1.0
    if (kab.name === 'Cilacap' || kab.id === 'kab-cilacap') multiplier = 1.12
    else if (kab.name === 'Kebumen' || kab.id === 'kab-kebumen') multiplier = 0.58
    else if (kab.name === 'Purbalingga' || kab.id === 'kab-purbalingga') multiplier = 0.42
    else if (kab.name === 'Banjarnegara' || kab.id === 'kab-banjarnegara') multiplier = 0.38

    const finalVal = Math.round(baseVal * multiplier)
    if (isCount) {
      return { label, value: new Intl.NumberFormat('id-ID').format(finalVal) + ' orang' }
    } else {
      const formatted = finalVal >= 1e9 
        ? `Rp ${(finalVal / 1e9).toFixed(1)} M` 
        : `Rp ${(finalVal / 1e6).toFixed(0)} Jt`
      return { label, value: formatted }
    }
  }
  return { label: 'Total PAD', value: '0' }
}

const createKabupatenIcon = (name, label, value) => {
  return L.divIcon({
    html: `
      <div class="flex flex-col items-center group cursor-pointer animate-float-in">
        <div class="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700 text-[10px] font-bold text-center whitespace-nowrap transition-transform duration-200 group-hover:scale-105">
          <div class="text-[8px] text-slate-400 uppercase leading-none font-semibold mb-0.5">${name}</div>
          <div class="text-[8px] text-slate-300 font-medium leading-none mb-0.5">${label}</div>
          <div class="text-[10px] font-extrabold text-emerald-400 leading-none">${value}</div>
        </div>
        <div class="w-2 h-2 bg-slate-950 rounded-full border border-white -mt-0.5 shadow-md"></div>
      </div>
    `,
    className: 'custom-kabupaten-marker',
    iconSize: [110, 52],
    iconAnchor: [55, 36]
  })
}

export default function PajakMap({
  metric,
  range,
  selectedId,
  onSelect,
  data,
  selectedRegency,
  regencyCenter,
  regencyZoom,
  viewMode = 'kecamatan',
  onSelectKabupaten,
  selectedKabupatenId,
  isDaerah = true
}) {
  const activeName = useMemo(() => {
    if (viewMode === 'kabupaten') {
      return kabupatenPADData.find(k => k.id === selectedKabupatenId)?.name
    }
    return selectedRegency
  }, [viewMode, selectedRegency, selectedKabupatenId])

  return (
    <MapContainer
      center={regencyCenter || [-7.44, 109.22]}
      zoom={regencyZoom || 10}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <MapPanesSetup />

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

      <GeoJSON
        key={`${activeName}-${viewMode}`}
        data={kabupatenGeoJSON}
        pane="geojsonPane"
        style={(feature) => {
          const regName = feature.properties.name
          const color = regencyColors[regName] || '#94a3b8'
          const isActive = regName === activeName
          return {
            color: isActive ? '#ffffff' : color,
            weight: isActive ? 3 : 1.5,
            fillOpacity: isActive ? 0.25 : 0.15,
            fillColor: color,
            dashArray: isActive ? '' : '4, 5',
            interactive: viewMode === 'kabupaten'
          }
        }}
        onEachFeature={(feature, layer) => {
          if (viewMode === 'kabupaten') {
            layer.on({
              click: () => {
                const regName = feature.properties.name
                const kab = kabupatenPADData.find(k => k.name === regName)
                if (kab) {
                  onSelectKabupaten(kab.id)
                }
              },
              mouseover: (e) => {
                const l = e.target
                const regName = feature.properties.name
                const isActive = regName === activeName
                l.setStyle({
                  fillOpacity: isActive ? 0.4 : 0.3,
                  weight: isActive ? 4 : 2
                })
              },
              mouseout: (e) => {
                const l = e.target
                const regName = feature.properties.name
                const isActive = regName === activeName
                l.setStyle({
                  fillOpacity: isActive ? 0.25 : 0.15,
                  weight: isActive ? 3 : 1.5
                })
              }
            })
          }
        }}
      />

      {/* Heat layer is active only in kecamatan mode, to avoid clutter on kabupaten overview */}
      {viewMode === 'kecamatan' && (
        <HeatLayer metric={metric} range={range} data={data} />
      )}
      
      {viewMode === 'kecamatan' && (
        <>
          <FlyToKecamatan selected={data.find((k) => k.id === selectedId)} />
          <FlyToRegency center={regencyCenter} zoom={regencyZoom} />
          <MarkerClusterGroup
            pins={data}
            onPinClick={(pin) => onSelect(pin.id)}
            focusId={selectedId}
          />
        </>
      )}

      {viewMode === 'kabupaten' && (
        <>
          <FlyToRegency center={regencyCenter} zoom={regencyZoom} />
          {kabupatenPADData
            .filter((kab) => isDaerah || kab.id === 'kab-banyumas')
            .map((kab) => {
              const pinInfo = getPinLabelAndValue(kab, metric, isDaerah, range)
              const customIcon = createKabupatenIcon(kab.name, pinInfo.label, pinInfo.value)
              return (
                <Marker
                  key={kab.id}
                  position={[kab.lat, kab.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      onSelectKabupaten(kab.id)
                    }
                  }}
                />
              )
            })}
        </>
      )}
    </MapContainer>
  )
}

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import { brandPinIcon, clusterIconCreate } from './brand-pin'

function isMapAlive(map) {
  if (!map) return false
  try {
    const container = map.getContainer?.()
    return !!(container && container.isConnected)
  } catch {
    return false
  }
}

export function MarkerClusterGroup({ pins, onPinClick, focusId, getIcon, getTooltip }) {
  const map = useMap()
  const onPinClickRef = useRef(onPinClick)
  onPinClickRef.current = onPinClick

  useEffect(() => {
    if (!isMapAlive(map)) return
    if (typeof L.markerClusterGroup !== 'function') return

    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 16,
      iconCreateFunction: clusterIconCreate
    })

    const markersById = new Map()

    for (const pin of pins) {
      if (!Number.isFinite(pin.lat) || !Number.isFinite(pin.lng)) continue
      const isSelected = pin.id === focusId
      const icon =
        typeof getIcon === 'function' ? getIcon(pin, isSelected) : brandPinIcon
      const marker = L.marker([pin.lat, pin.lng], {
        icon,
        title: pin.name
      })

      const tooltipContent =
        typeof getTooltip === 'function'
          ? getTooltip(pin)
          : `
        <div style="font-family: 'Inter', sans-serif;">
          <span style="font-weight: 600; font-size: 12px; color: #1e293b;">${pin.name}</span>
          <br />
          <span style="font-size: 11px; color: #64748b;">Skor Zonasi: ${pin.zonationScore}</span>
        </div>
      `
      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -36],
        opacity: 1
      })

      marker.on('click', () => onPinClickRef.current(pin))
      group.addLayer(marker)
      markersById.set(pin.id, marker)
    }

    try {
      map.addLayer(group)
    } catch {
      return
    }

    if (focusId) {
      const m = markersById.get(focusId)
      if (m && typeof group.zoomToShowLayer === 'function') {
        try {
          group.zoomToShowLayer(m)
        } catch {
          /* ignore */
        }
      }
    }

    return () => {
      try {
        if (isMapAlive(map) && map.hasLayer(group)) {
          map.removeLayer(group)
        }
      } catch {
        /* map already torn down */
      }
      try {
        group.clearLayers()
      } catch {
        /* ignore */
      }
    }
  }, [map, pins, focusId])

  return null
}

export default MarkerClusterGroup


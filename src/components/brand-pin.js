import L from 'leaflet'

const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44" fill="none">
  <path d="M18 42C18 42 32 28.5 32 16.5C32 8.5 25.7 2 18 2C10.3 2 4 8.5 4 16.5C4 28.5 18 42 18 42Z" fill="#1266A8" stroke="#0B2E4A" stroke-width="1.5"/>
  <circle cx="18" cy="16.5" r="6" fill="#FFFFFF"/>
  <circle cx="18" cy="16.5" r="3" fill="#F28A24"/>
</svg>
`

export const brandAnimatedPinIcon = L.divIcon({
  html: `<div class="animated-marker-pin">${PIN_SVG}</div>`,
  className: 'animated-pin-wrapper',
  iconSize: [36, 44],
  iconAnchor: [18, 42],
  popupAnchor: [0, -36]
})

export const brandPinIcon = brandAnimatedPinIcon

export function tierPinIcon(color, selected = false) {
  const size = selected ? 44 : 36
  const svg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 8}" viewBox="0 0 36 44" fill="none">
  <path d="M18 42C18 42 32 28.5 32 16.5C32 8.5 25.7 2 18 2C10.3 2 4 8.5 4 16.5C4 28.5 18 42 18 42Z" fill="${color}" stroke="#0B2E4A" stroke-width="${selected ? 2.5 : 1.5}"/>
  <circle cx="18" cy="16.5" r="6" fill="#FFFFFF"/>
  <circle cx="18" cy="16.5" r="3" fill="#F28A24"/>
</svg>
`)
  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 6],
    popupAnchor: [0, -(size + 4)]
  })
}

export const clusterIconCreate = (cluster) => {
  const count = cluster.getChildCount()
  let size = 40
  let font = 13
  if (count >= 50) {
    size = 52
    font = 15
  } else if (count >= 10) {
    size = 46
    font = 14
  }
  return L.divIcon({
    html: `<div class="bx-map-cluster" style="width:${size}px;height:${size}px;font-size:${font}px">${count}</div>`,
    className: 'bx-map-cluster-wrap',
    iconSize: L.point(size, size)
  })
}

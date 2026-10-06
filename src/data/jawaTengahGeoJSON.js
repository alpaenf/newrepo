// GeoJSON Polygons untuk Kabupaten Banyumas, Purbalingga, Banjarnegara, Cilacap, Kebumen (Banyumas Raya)
export const jawaTengahGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "banyumas", name: "Banyumas" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [108.98, -7.31], [109.12, -7.31], [109.28, -7.30], [109.32, -7.35],
          [109.34, -7.42], [109.32, -7.52], [109.28, -7.56], [109.15, -7.56],
          [109.02, -7.52], [108.98, -7.45], [108.96, -7.38], [108.98, -7.31]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { id: "purbalingga", name: "Purbalingga" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [109.28, -7.20], [109.42, -7.18], [109.48, -7.28], [109.45, -7.42],
          [109.34, -7.42], [109.32, -7.35], [109.28, -7.30], [109.28, -7.20]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { id: "banjarnegara", name: "Banjarnegara" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [109.45, -7.20], [109.78, -7.20], [109.82, -7.35], [109.75, -7.50],
          [109.52, -7.48], [109.45, -7.42], [109.48, -7.28], [109.45, -7.20]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { id: "cilacap", name: "Cilacap" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [108.72, -7.28], [108.98, -7.31], [108.96, -7.38], [108.98, -7.45],
          [109.02, -7.52], [109.15, -7.56], [109.28, -7.56], [109.30, -7.72],
          [109.15, -7.78], [108.92, -7.78], [108.72, -7.58], [108.72, -7.28]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { id: "kebumen", name: "Kebumen" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [109.32, -7.52], [109.52, -7.48], [109.75, -7.50], [109.82, -7.62],
          [109.75, -7.82], [109.45, -7.82], [109.30, -7.72], [109.28, -7.56],
          [109.32, -7.52]
        ]]
      }
    }
  ]
};

export default jawaTengahGeoJSON;

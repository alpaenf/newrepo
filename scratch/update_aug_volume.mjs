import fs from 'fs'
import path from 'path'

const filePath = path.resolve('c:/laragon/www/coba qris/src/data/qrisData.js')
let content = fs.readFileSync(filePath, 'utf-8')

// Real August 2026 data
const augRealVolume = {
  Banjarnegara: {
    UMI: 624339,
    UKE: 123773,
    UME: 120074,
    UBE: 76047
  },
  Banyumas: {
    UMI: 4205102,
    UKE: 878622,
    UME: 1208936,
    UBE: 742393
  },
  Cilacap: {
    UMI: 1978827,
    UKE: 314621,
    UME: 680440,
    UBE: 414621
  },
  Purbalingga: {
    UMI: 865201,
    UKE: 106417,
    UME: 385088,
    UBE: 4943808
  }
}

// Monthly seasonal factor relative to August (Aug = 1.0)
const seasonalFactors = {
  "01": 0.72,
  "02": 0.75,
  "03": 0.82,
  "04": 0.95, // Lebaran / Eid season
  "05": 0.88,
  "06": 0.92,
  "07": 0.96,
  "08": 1.00, // Real baseline from user
  "09": 0.95,
  "10": 0.98,
  "11": 0.96,
  "12": 1.05  // Year end peak
}

console.log("Updating qrisData.js with real August 2026 volumes...")

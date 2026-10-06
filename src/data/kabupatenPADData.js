// Data PAD (Pendapatan Asli Daerah) riil 5 Kabupaten Banyumas Raya
// Sumber: Spreadsheet user — realisasi per kanal pembayaran

export const kabupatenPADData = [
  {
    id: 'kab-banyumas',
    name: 'Banyumas',
    lat: -7.45,
    lng: 109.2,
    padTotal: 461500907430,
    pajakRetribusiNontunai: 443805098662,
    rasio: 96.2,
    pajak: {
      total: 226040386480,
      totalNontunai: 226040386480,
      kanal: {
        qris: 3587279465,
        teller: 190561070859,
        atm: 487004757,
        edc: 0,
        mBanking: 10291093336,
        agenBank: 13610167863,
        ueReader: 0,
        ecommerce: 7503770200
      }
    },
    retribusi: {
      total: 217764712182,
      totalNontunai: 217764712182,
      kanal: {
        qris: 1000000,
        teller: 215024200764,
        atm: 1315130284,
        edc: 0,
        mBanking: 1180738884,
        agenBank: 233990300,
        ueReader: 0,
        ecommerce: 9651950
      }
    }
  },
  {
    id: 'kab-cilacap',
    name: 'Cilacap',
    lat: -7.55,
    lng: 108.97,
    padTotal: 502436816769,
    pajakRetribusiNontunai: 419752138171,
    rasio: 83.5,
    pajak: {
      total: 240239429446,
      totalNontunai: 240239429446,
      kanal: {
        qris: 25403490991,
        teller: 122555659192,
        atm: 4275886,
        edc: 54113689100,
        mBanking: 36412847658,
        agenBank: 1695726843,
        ueReader: 0,
        ecommerce: 15256776
      }
    },
    retribusi: {
      total: 179512708725,
      totalNontunai: 179512708725,
      kanal: {
        qris: 653276416,
        teller: 120609439595,
        atm: 54644650,
        edc: 31372668,
        mBanking: 1815970297,
        agenBank: 1767234535,
        ueReader: 517771079,
        ecommerce: 12994000
      }
    }
  },
  {
    id: 'kab-banjarnegara',
    name: 'Banjarnegara',
    lat: -7.35,
    lng: 109.7,
    padTotal: 181341404472,
    pajakRetribusiNontunai: 165697833638,
    rasio: 91.4,
    pajak: {
      total: 68847455895,
      totalNontunai: 68847455895,
      kanal: {
        qris: 1115617904,
        teller: 4178852132,
        atm: 248987958,
        edc: 0,
        mBanking: 23608872743,
        agenBank: 1040784604,
        ueReader: 0,
        ecommerce: 1044620464
      }
    },
    retribusi: {
      total: 96850377833,
      totalNontunai: 96850377833,
      kanal: {
        qris: 1289561496,
        teller: 1398274005,
        atm: 7000000,
        edc: 241590196,
        mBanking: 78394054963,
        agenBank: 0,
        ueReader: 0,
        ecommerce: 2935597173
      }
    }
  },
  {
    id: 'kab-kebumen',
    name: 'Kebumen',
    lat: -7.65,
    lng: 109.65,
    padTotal: 269765425949,
    pajakRetribusiNontunai: 247001796842,
    rasio: 91.6,
    pajak: {
      total: 120371709496,
      totalNontunai: 120371709496,
      kanal: {
        qris: 3207622639,
        teller: 41948053146,
        atm: 2819438113,
        edc: 0,
        mBanking: 72378613853,
        agenBank: 14593550,
        ueReader: 0,
        ecommerce: 3388195
      }
    },
    retribusi: {
      total: 126630087346,
      totalNontunai: 126630087346,
      kanal: {
        qris: 1455274268,
        teller: 10977188905,
        atm: 1008000,
        edc: 12370297,
        mBanking: 109713456828,
        agenBank: 6905700,
        ueReader: 1823805395,
        ecommerce: 2577916153
      }
    }
  },
  {
    id: 'kab-purbalingga',
    name: 'Purbalingga',
    lat: -7.3,
    lng: 109.35,
    padTotal: 169001648000,
    pajakRetribusiNontunai: 132004790734,
    rasio: 78.1,
    pajak: {
      total: 69485806198,
      totalNontunai: 69485806198,
      kanal: {
        qris: 1107189437,
        teller: 43754935741,
        atm: 1103437,
        edc: 92484500,
        mBanking: 22607045666,
        agenBank: 616845,
        ueReader: 0,
        ecommerce: 1296270732
      }
    },
    retribusi: {
      total: 62939464725,
      totalNontunai: 62518984536,
      rasioNontunai: 99.33,
      selisih: 420480189,
      kanal: {
        qris: 3306392363,
        teller: 44039816628,
        atm: 640000,
        edc: 34633423,
        mBanking: 14933269748,
        agenBank: 150000,
        ueReader: 0,
        ecommerce: 204082374
      }
    }
  }
]

// Label kanal untuk tabel realisasi
export const kanalLabels = [
  { key: 'qris', label: 'QRIS' },
  { key: 'teller', label: 'Teller' },
  { key: 'atm', label: 'ATM' },
  { key: 'edc', label: 'EDC' },
  { key: 'mBanking', label: 'M-banking' },
  { key: 'agenBank', label: 'Agen Bank' },
  { key: 'ueReader', label: 'UE Reader' },
  { key: 'ecommerce', label: 'Ecommerce' }
]

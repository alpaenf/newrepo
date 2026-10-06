// Data Pajak Negara (PPh & PPN) Kabupaten Banyumas (berdasarkan KPP Pratama Purwokerto)
// Serta data pajak per Klasifikasi Lapangan Usaha (KLU) / Sektor Dominan (SDA)

export const banyumasPajakNegaraRaw = {
  "Purwokerto Timur": {
    years: {
      "2024": { wp: 26438, lapor: 5702, bayar: 1497, penerimaan: 101161363629 },
      "2025": { wp: 27309, lapor: 5700, bayar: 1462, penerimaan: 103725582047 },
      "2026": { wp: 27404, lapor: 4, bayar: 653, penerimaan: 43725000000 }
    },
    sectorCode: "G", // Perdagangan Besar dan Eceran
    dominantIndustry: "Perdagangan Besar dan Eceran"
  },
  "Purwokerto Selatan": {
    years: {
      "2024": { wp: 28384, lapor: 6307, bayar: 1428, penerimaan: 188025955168 },
      "2025": { wp: 29549, lapor: 6289, bayar: 1393, penerimaan: 188946860353 },
      "2026": { wp: 29681, lapor: 1, bayar: 572, penerimaan: 89345000000 }
    },
    sectorCode: "C", // Industri Pengolahan
    dominantIndustry: "Industri Pengolahan"
  },
  "Purwokerto Utara": {
    years: {
      "2024": { wp: 20061, lapor: 4612, bayar: 811, penerimaan: 96022319171 },
      "2025": { wp: 20923, lapor: 4847, bayar: 852, penerimaan: 86427370902 },
      "2026": { wp: 21021, lapor: 3, bayar: 269, penerimaan: 41250000000 }
    },
    sectorCode: "P", // Jasa Pendidikan
    dominantIndustry: "Jasa Pendidikan"
  },
  "Purwokerto Barat": {
    years: {
      "2024": { wp: 21465, lapor: 4440, bayar: 711, penerimaan: 36074134229 },
      "2025": { wp: 22288, lapor: 4425, bayar: 685, penerimaan: 28770274632 },
      "2026": { wp: 22375, lapor: 0, bayar: 206, penerimaan: 12450000000 }
    },
    sectorCode: "G", // Perdagangan Besar dan Eceran
    dominantIndustry: "Ritel & Perdagangan"
  },
  "Sokaraja": {
    years: {
      "2024": { wp: 27114, lapor: 4533, bayar: 662, penerimaan: 24626240930 },
      "2025": { wp: 28206, lapor: 4634, bayar: 634, penerimaan: 34227115952 },
      "2026": { wp: 28324, lapor: 3, bayar: 197, penerimaan: 15600000000 }
    },
    sectorCode: "I", // Penyediaan Akomodasi dan Makan Minum
    dominantIndustry: "Kuliner Tradisional & Batik"
  },
  "Kembaran": {
    years: {
      "2024": { wp: 23581, lapor: 3797, bayar: 519, penerimaan: 10435739332 },
      "2025": { wp: 24571, lapor: 3956, bayar: 478, penerimaan: 10862319298 },
      "2026": { wp: 24658, lapor: 0, bayar: 116, penerimaan: 4850000000 }
    },
    sectorCode: "G", // Perdagangan
    dominantIndustry: "Ritel & Pendidikan"
  },
  "Ajibarang": {
    years: {
      "2024": { wp: 27253, lapor: 2728, bayar: 450, penerimaan: 23256638272 },
      "2025": { wp: 28429, lapor: 2773, bayar: 398, penerimaan: 21232788169 },
      "2026": { wp: 28556, lapor: 0, bayar: 117, penerimaan: 9110000000 }
    },
    sectorCode: "G", // Perdagangan
    dominantIndustry: "Transportasi & Ritel"
  },
  "Cilongok": {
    years: {
      "2024": { wp: 27767, lapor: 2627, bayar: 401, penerimaan: 24608186642 },
      "2025": { wp: 29202, lapor: 3049, bayar: 362, penerimaan: 23644301362 },
      "2026": { wp: 29372, lapor: 1, bayar: 101, penerimaan: 11500000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Gula Semut & Pertanian"
  },
  "Baturraden": {
    years: {
      "2024": { wp: 16394, lapor: 2596, bayar: 382, penerimaan: 10394776059 },
      "2025": { wp: 17131, lapor: 2689, bayar: 383, penerimaan: 13832338251 },
      "2026": { wp: 17205, lapor: 0, bayar: 89, penerimaan: 5400000000 }
    },
    sectorCode: "I", // Akomodasi
    dominantIndustry: "Hotel & Wisata"
  },
  "Sumbang": {
    years: {
      "2024": { wp: 21502, lapor: 2296, bayar: 376, penerimaan: 7621337453 },
      "2025": { wp: 22436, lapor: 2508, bayar: 374, penerimaan: 7472884944 },
      "2026": { wp: 22539, lapor: 2, bayar: 83, penerimaan: 3200000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Pertanian & Wisata Air"
  },
  "Wangon": {
    years: {
      "2024": { wp: 25074, lapor: 3321, bayar: 341, penerimaan: 9876753892 },
      "2025": { wp: 26142, lapor: 3376, bayar: 333, penerimaan: 12865704869 },
      "2026": { wp: 26209, lapor: 1, bayar: 111, penerimaan: 5120000000 }
    },
    sectorCode: "G", // Perdagangan
    dominantIndustry: "Ritel & Transit Selatan"
  },
  "Karanglewas": {
    years: {
      "2024": { wp: 16229, lapor: 2197, bayar: 328, penerimaan: 6035784374 },
      "2025": { wp: 17055, lapor: 2330, bayar: 282, penerimaan: 4845294308 },
      "2026": { wp: 17142, lapor: 0, bayar: 63, penerimaan: 2100000000 }
    },
    sectorCode: "C", // Industri Pengolahan
    dominantIndustry: "Logam & Makanan Olahan"
  },
  "Banyumas": {
    years: {
      "2024": { wp: 14020, lapor: 2166, bayar: 287, penerimaan: 27438987000 },
      "2025": { wp: 14697, lapor: 2294, bayar: 248, penerimaan: 28629788698 },
      "2026": { wp: 14780, lapor: 1, bayar: 103, penerimaan: 12400000000 }
    },
    sectorCode: "G", // Perdagangan
    dominantIndustry: "Batik & Sentra Tradisional"
  },
  "Patikraja": {
    years: {
      "2024": { wp: 18160, lapor: 2690, bayar: 281, penerimaan: 5485996789 },
      "2025": { wp: 18961, lapor: 2765, bayar: 264, penerimaan: 6279265824 },
      "2026": { wp: 19039, lapor: 1, bayar: 57, penerimaan: 2800000000 }
    },
    sectorCode: "G", // Perdagangan
    dominantIndustry: "Ritel & Kerajinan"
  },
  "Kedungbanteng": {
    years: {
      "2024": { wp: 14705, lapor: 1834, bayar: 276, penerimaan: 4892741810 },
      "2025": { wp: 15483, lapor: 1993, bayar: 261, penerimaan: 4976403591 },
      "2026": { wp: 15567, lapor: 2, bayar: 68, penerimaan: 2150000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Perikanan Air Tawar"
  },
  "Kemranjen": {
    years: {
      "2024": { wp: 17248, lapor: 2231, bayar: 238, penerimaan: 3738945890 },
      "2025": { wp: 18153, lapor: 2340, bayar: 191, penerimaan: 3337137396 },
      "2026": { wp: 18248, lapor: 2, bayar: 60, penerimaan: 1450000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Sentra Hortikultura (Durian)"
  },
  "Pekuncen": {
    years: {
      "2024": { wp: 20173, lapor: 1907, bayar: 236, penerimaan: 15822977243 },
      "2025": { wp: 21068, lapor: 2033, bayar: 184, penerimaan: 15593649615 },
      "2026": { wp: 21147, lapor: 0, bayar: 47, penerimaan: 7200000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Pertanian & Sapi Perah"
  },
  "Kalibagor": {
    years: {
      "2024": { wp: 15257, lapor: 2006, bayar: 215, penerimaan: 8793275319 },
      "2025": { wp: 15919, lapor: 2101, bayar: 224, penerimaan: 8543696132 },
      "2026": { wp: 15999, lapor: 1, bayar: 54, penerimaan: 3900000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Kebun Buah & Hortikultura"
  },
  "Jatilawang": {
    years: {
      "2024": { wp: 17891, lapor: 2100, bayar: 208, penerimaan: 5094230487 },
      "2025": { wp: 18908, lapor: 2067, bayar: 199, penerimaan: 4987068946 },
      "2026": { wp: 18996, lapor: 0, bayar: 50, penerimaan: 2100000000 }
    },
    sectorCode: "G", // Perdagangan
    dominantIndustry: "Pertanian & Ritel"
  },
  "Kebasen": {
    years: {
      "2024": { wp: 15998, lapor: 1749, bayar: 204, penerimaan: 9558973507 },
      "2025": { wp: 16661, lapor: 1787, bayar: 166, penerimaan: 6831564238 },
      "2026": { wp: 16721, lapor: 1, bayar: 42, penerimaan: 3100000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Kerajinan Bambu & Tani"
  },
  "Sumpiuh": {
    years: {
      "2024": { wp: 14513, lapor: 1745, bayar: 198, penerimaan: 4356385914 },
      "2025": { wp: 15190, lapor: 1834, bayar: 190, penerimaan: 4482896734 },
      "2026": { wp: 15265, lapor: 0, bayar: 78, penerimaan: 1900000000 }
    },
    sectorCode: "G", // Perdagangan
    dominantIndustry: "Pusat Ritel Selatan"
  },
  "Tambak": {
    years: {
      "2024": { wp: 12532, lapor: 1611, bayar: 185, penerimaan: 3372312535 },
      "2025": { wp: 13075, lapor: 1597, bayar: 152, penerimaan: 3640995766 },
      "2026": { wp: 13138, lapor: 0, bayar: 44, penerimaan: 1500000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Pertanian & Kuliner Bebek"
  },
  "Gumelar": {
    years: {
      "2024": { wp: 12233, lapor: 1295, bayar: 156, penerimaan: 2056987511 },
      "2025": { wp: 12766, lapor: 1327, bayar: 123, penerimaan: 2011612104 },
      "2026": { wp: 12829, lapor: 0, bayar: 24, penerimaan: 890000000 }
    },
    sectorCode: "A", // Pertanian
    dominantIndustry: "Gula Kelapa & Hasil Hutan"
  },
  // Subdistricts not detailed in image, using simulated/interpolated data to complete the map
  "Lumbir": {
    years: {
      "2024": { wp: 11050, lapor: 1100, bayar: 120, penerimaan: 1850000000 },
      "2025": { wp: 11500, lapor: 1150, bayar: 110, penerimaan: 1750000000 },
      "2026": { wp: 11700, lapor: 0, bayar: 20, penerimaan: 750000000 }
    },
    sectorCode: "A",
    dominantIndustry: "Perkebunan Rakyat"
  },
  "Purwojati": {
    years: {
      "2024": { wp: 13200, lapor: 1400, bayar: 150, penerimaan: 2400000000 },
      "2025": { wp: 13700, lapor: 1450, bayar: 140, penerimaan: 2300000000 },
      "2026": { wp: 13900, lapor: 0, bayar: 25, penerimaan: 950000000 }
    },
    sectorCode: "A",
    dominantIndustry: "Pertanian & Perkayuan"
  },
  "Rawalo": {
    years: {
      "2024": { wp: 15400, lapor: 1800, bayar: 210, penerimaan: 3100000000 },
      "2025": { wp: 16100, lapor: 1850, bayar: 190, penerimaan: 3000000000 },
      "2026": { wp: 16300, lapor: 1, bayar: 35, penerimaan: 1200000000 }
    },
    sectorCode: "A",
    dominantIndustry: "Tani & Sentra Genteng"
  },
  "Somagede": {
    years: {
      "2024": { wp: 12800, lapor: 1300, bayar: 160, penerimaan: 2100000000 },
      "2025": { wp: 13400, lapor: 1350, bayar: 145, penerimaan: 2000000000 },
      "2026": { wp: 13600, lapor: 0, bayar: 30, penerimaan: 850000000 }
    },
    sectorCode: "A",
    dominantIndustry: "Kerajinan Logam & Tani"
  }
}

export const sdaSectorData = [
  { code: 'A', name: 'Pertanian, Kehutanan, dan Perikanan', y2024: 122062214, y2025: 223731458, y2026: 71416386 },
  { code: 'B', name: 'Pertambangan dan Penggalian', y2024: 605495387, y2025: 24344000, y2026: 9230500 },
  { code: 'C', name: 'Industri Pengolahan', y2024: 4017892633, y2025: 5522425911, y2026: 2463384854 },
  { code: 'D', name: 'Pengadaan Listrik, Gas, Uap/Air Panas dan Udara Dingin', y2024: 71286812, y2025: 71246585, y2026: 9326657 },
  { code: 'E', name: 'Pengadaan Air, Pengelolaan Sampah dan Daur Ulang, Pembuangan dan Pembersihan', y2024: 37606735, y2025: 106280290, y2026: 44860846 },
  { code: 'F', name: 'Konstruksi', y2024: 7093641679, y2025: 2400469471, y2026: 1506460988 },
  { code: 'G', name: 'Perdagangan Besar dan Eceran; Reparasi dan Perawatan Mobil dan Sepeda Motor', y2024: 16087213266, y2025: 16260997201, y2026: 7883935405 },
  { code: 'H', name: 'Transportasi dan Pergudangan', y2024: 2192921301, y2025: 2010818747, y2026: 219328229 },
  { code: 'I', name: 'Penyediaan Akomodasi dan Penyediaan Makan Minum', y2024: 540684100, y2025: 561592802, y2026: 294782137 },
  { code: 'J', name: 'Informasi dan Komunikasi', y2024: 368070964, y2025: 223776350, y2026: 113128572 },
  { code: 'K', name: 'Jasa Keuangan dan Asuransi', y2024: 1377640303, y2025: 1587954073, y2026: 559597775 },
  { code: 'L', name: 'Real Estate', y2024: 1153129331, y2025: 941832345, y2026: 467175438 },
  { code: 'M', name: 'Jasa Profesional, Ilmiah dan Teknis', y2024: 698647364, y2025: 570786091, y2026: 646879844 },
  { code: 'N', name: 'Jasa Persewaan, Ketenagakerjaan, Agen Perjalanan dan Penunjang Usaha Lainnya', y2024: 696024749, y2025: 497117416, y2026: 129896502 },
  { code: 'O', name: 'Administrasi Pemerintahan dan Jaminan Sosial Wajib', y2024: 24726491422, y2025: 17688288637, y2026: 10676868306 },
  { code: 'P', name: 'Jasa Pendidikan', y2024: 608218200, y2025: 633058707, y2026: 532131974 },
  { code: 'Q', name: 'Jasa Kesehatan dan Kegiatan Sosial', y2024: 1668189382, y2025: 2113070406, y2026: 933203351 },
  { code: 'R', name: 'Kebudayaan, Hiburan dan Rekreasi', y2024: 14177462, y2025: 477447512, y2026: 83839594 },
  { code: 'S', name: 'Kegiatan Jasa Lainnya', y2024: 219770216, y2025: 236896769, y2026: 108102370 },
  { code: 'T', name: 'Jasa Perorangan yang Melayani Rumah Tangga; Kegiatan yang Menghasilkan Barang dan Jasa', y2024: 7713591, y2025: 20605986, y2026: 2022345 },
  { code: 'Z', name: 'Sektor Z', y2024: 5774945226, y2025: 5868139109, y2026: 1173793503 },
  { code: 'unknown', name: 'Wajib Pajak KLU Error', y2024: 47095744058, y2025: 488248073, y2026: 399805493 }
]

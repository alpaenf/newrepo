// Zona QRIS - Interactive 3D Canvas (Three.js) & Leaflet Map Engine

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. SPLASH SCREEN DISMISSAL (1.8s)
  // ==========================================
  const splashScreen = document.getElementById('splashScreen');
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
    }, 1800);
  }

  // ==========================================
  // 1. TYPEWRITER ANIMATION (PAGE 1 COVER)
  // ==========================================
  const typewriterElem = document.getElementById('typewriterSubtitle');
  if (typewriterElem) {
    const textToType = typewriterElem.getAttribute('data-text');
    const textContainer = typewriterElem.querySelector('.typewriter-text');
    const cursorElem = typewriterElem.querySelector('.typewriter-cursor');

    if (textContainer && textToType) {
      let charIndex = 0;
      textContainer.textContent = '';

      function typeChar() {
        if (charIndex < textToType.length) {
          textContainer.textContent += textToType.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, 22);
        } else {
          setTimeout(() => {
            if (cursorElem) cursorElem.style.display = 'none';
          }, 2500);
        }
      }

      setTimeout(typeChar, 350);
    }
  }

  // ==========================================
  // 2. LEAFLET MAP ENGINE (PAGE 2: MAP.HTML)
  // ==========================================
  const mapElement = document.getElementById('qrisMap');
  
  if (mapElement && typeof L !== 'undefined') {
    // Center of Indonesia
    const defaultCenter = [-2.5489, 118.0149];
    const defaultZoom = 5;

    const map = L.map('qrisMap', {
      center: defaultCenter,
      zoom: defaultZoom,
      scrollWheelZoom: true
    });

    // Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Zona QRIS BI'
    }).addTo(map);

    // Curated Zona QRIS Dataset (Vector SVGs replace all emojis)
    const qrisZones = [
      {
        id: 'z1',
        title: 'Pasar Tanah Abang Digital',
        city: 'DKI Jakarta',
        lat: -6.1884,
        lng: 106.8142,
        category: 'pasar',
        categoryName: 'Pasar Tradisional',
        merchants: '12.450 Merchant',
        mdr: '0% (Subsidi BI UMI)',
        desc: 'Pusat tekstil terbesar se-Asia Tenggara yang telah 100% menerapkan Zona QRIS Digital untuk seluruh pedagang grosir dan eceran.',
        tags: ['QRIS Statis', 'QRIS Dinamis', 'Watermark NMID', 'MDR 0%'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
      },
      {
        id: 'z2',
        title: 'Kawasan Wisata Malioboro & Pasar Beringharjo',
        city: 'DI Yogyakarta',
        lat: -7.7928,
        lng: 110.3658,
        category: 'wisata',
        categoryName: 'Wisata & Kuliner',
        merchants: '8.750 Merchant',
        mdr: '0% (Usaha Mikro)',
        desc: 'Zona Sentra Wisata Kebudayaan & Kuliner Yogyakarta. Seluruh pedagang lesehan, souvenir, dan penginapan terintegrasi QRIS.',
        tags: ['QRIS Statis', 'Cross-Border Spore/Malay', 'Akses Difabel'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
      },
      {
        id: 'z3',
        title: 'Pasar Gede Hardjonagoro & Sentra Batik Solo',
        city: 'Surakarta, Jawa Tengah',
        lat: -7.5694,
        lng: 110.8322,
        category: 'pasar',
        categoryName: 'Pasar Tradisional',
        merchants: '4.200 Merchant',
        mdr: '0% (Bebas Biaya UMI)',
        desc: 'Pasar bersejarah Surakarta modern dengan transaksi QRIS contactless untuk produk pangan, kuliner khas, dan kerajinan batik.',
        tags: ['QRIS Statis', 'Pembukuan PJP', 'UMI 0%'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
      },
      {
        id: 'z4',
        title: 'Kawasan Wisata & Shopping Beachwalk Kuta',
        city: 'Denpasar / Badung, Bali',
        lat: -8.7183,
        lng: 115.1689,
        category: 'wisata',
        categoryName: 'Wisata & Kuliner',
        merchants: '15.300 Merchant',
        mdr: '0.3% (UKM) & Antarnegara',
        desc: 'Pusat pariwisata internasional Bali mendukung penuh transaksi QRIS Antarnegara wisatawan Singapura, Malaysia, Thailand, & Korsel.',
        tags: ['QRIS Antarnegara', 'Multi-Currency Auto', 'EDC Dinamis'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
      },
      {
        id: 'z5',
        title: 'Koridor Utama TransJakarta & MRT Jakarta',
        city: 'DKI Jakarta',
        lat: -6.2088,
        lng: 106.8456,
        category: 'transport',
        categoryName: 'Transportasi Publik',
        merchants: '350 Stasiun & Halte',
        mdr: '0% (Layanan Publik)',
        desc: 'Integrasi ticketing QRIS TUNTAS & QRIS Tap di stasiun MRT, LRT, Commuter Line, serta seluruh rute busway TransJakarta.',
        tags: ['QRIS Tap', 'QRIS TUNTAS', 'Instant Verification'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="15" rx="2"/><circle cx="7" cy="15" r="1.5"/><circle cx="17" cy="15" r="1.5"/><path d="M3 9h18"/><path d="M7 18.5V21"/><path d="M17 18.5V21"/></svg>`
      },
      {
        id: 'z6',
        title: 'Kawasan Masjid Istiqlal & Katedral Jakarta',
        city: 'DKI Jakarta',
        lat: -6.1702,
        lng: 106.8314,
        category: 'ibadah',
        categoryName: 'Tempat Ibadah & Sosial',
        merchants: '1.200 Kotak Infaq Digital',
        mdr: '0% (Donasi Nirlaba)',
        desc: 'Digitalisasi donasi, zakat, infaq, dan sedekah nontunai transparan berizin resmi BI dengan tarif MDR 0%.',
        tags: ['Donasi 0%', 'Transparansi Real-time', 'QRIS Statis Resmi'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`
      },
      {
        id: 'z7',
        title: 'Sentra Kuliner Jalan Cibadak & Chinatown',
        city: 'Bandung, Jawa Barat',
        lat: -6.9215,
        lng: 107.6047,
        category: 'wisata',
        categoryName: 'Wisata & Kuliner',
        merchants: '3.600 Merchant UMKM',
        mdr: '0% (Bebas Biaya)',
        desc: 'Sentra wisata malam jajanan kuliner Bandung yang viral dengan adopsi 100% QRIS oleh pedagang gerobak hingga kafe.',
        tags: ['QRIS Statis', 'Cashback Merchant', 'MDR 0% UMI'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
      },
      {
        id: 'z8',
        title: 'Kawasan Tunjungan Plaza & Jalan Tunjungan',
        city: 'Surabaya, Jawa Timur',
        lat: -7.2618,
        lng: 112.7384,
        category: 'retail',
        categoryName: 'Mall & Retail Modern',
        merchants: '9.800 Merchant',
        mdr: '0.7% (Regular Retail)',
        desc: 'Ikon pusat bisnis & modern retail Surabaya dengan sistem transaksi QRIS Dinamis terintegrasi POS Kasir.',
        tags: ['QRIS Dinamis EDC', 'Auto Reconciliation', 'PJP Enterprise'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
      },
      {
        id: 'z9',
        title: 'Pasar Petisah & Sentra Kuliner Lapangan Merdeka',
        city: 'Medan, Sumatera Utara',
        lat: 3.5952,
        lng: 98.6722,
        category: 'pasar',
        categoryName: 'Pasar Tradisional',
        merchants: '6.500 Merchant',
        mdr: '0% (Subsidi BI)',
        desc: 'Pusat perdagangan buah, bahan pokok, dan oleh-oleh khas Medan dengan percepatan elektronifikasi pembayaran daerah.',
        tags: ['QRIS UMI 0%', 'Pendampingan BI', 'Watermark NMID'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
      },
      {
        id: 'z10',
        title: 'Kawasan Pantai Losari & Kuliner Somba Opu',
        city: 'Makassar, Sulawesi Selatan',
        lat: -5.1477,
        lng: 119.4061,
        category: 'wisata',
        categoryName: 'Wisata & Kuliner',
        merchants: '5.100 Merchant',
        mdr: '0% (Usaha Mikro)',
        desc: 'Destinasi ikonik Sulawesi Selatan mendukung transaksi cepat coto Makassar & pisang epe pakai QRIS tanpa kembalian.',
        tags: ['QRIS Statis', 'CUMAX BI', 'MDR 0% UMI'],
        svgIcon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
      }
    ];

    let currentMarkers = [];

    // SVG Pin Generator for Leaflet
    function createCustomPin(svgContent) {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="qris-custom-pin" style="width:38px; height:38px;">${svgContent}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19]
      });
    }

    // Render Markers Function
    function renderMarkers(categoryFilter = 'all') {
      currentMarkers.forEach(m => map.removeLayer(m));
      currentMarkers = [];

      const filteredZones = categoryFilter === 'all' 
        ? qrisZones 
        : qrisZones.filter(z => z.category === categoryFilter);

      filteredZones.forEach(zone => {
        const marker = L.marker([zone.lat, zone.lng], { icon: createCustomPin(zone.svgIcon) }).addTo(map);

        const popupContent = `
          <div class="popup-qris-card">
            <div class="popup-qris-badge">${zone.categoryName}</div>
            <div class="popup-qris-title">${zone.title}</div>
            <div class="popup-qris-meta">${zone.city} | ${zone.merchants}</div>
            <div style="font-size:12px; color:#16a34a; font-weight:700; margin-bottom:8px;">Tarif MDR: ${zone.mdr}</div>
            <a href="javascript:void(0)" class="popup-qris-btn" onclick="window.selectZoneFromMap('${zone.id}')">Lihat Detail Zona →</a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          updateZoneDetailPanel(zone);
        });

        currentMarkers.push(marker);
      });
    }

    // Update Detail Panel UI
    function updateZoneDetailPanel(zone) {
      const badge = document.getElementById('zoneCategoryBadge');
      const title = document.getElementById('zoneTitle');
      const cityText = document.getElementById('zoneCityText');
      const mCount = document.getElementById('zoneMerchantCount');
      const mdr = document.getElementById('zoneMdrRate');
      const desc = document.getElementById('zoneDescription');
      const tagsContainer = document.getElementById('zoneTags');

      if (badge) badge.textContent = zone.categoryName;
      if (title) title.textContent = zone.title;
      if (cityText) cityText.textContent = zone.city;
      if (mCount) mCount.textContent = zone.merchants;
      if (mdr) mdr.textContent = zone.mdr;
      if (desc) desc.textContent = zone.desc;

      if (tagsContainer) {
        tagsContainer.innerHTML = zone.tags.map(tag => `
          <span class="feature-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ${tag}
          </span>
        `).join('');
      }

      if (window.innerWidth <= 768) {
        const detailPanel = document.getElementById('zoneDetailCard');
        if (detailPanel) {
          detailPanel.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    // Global Selection Helper
    window.selectZoneFromMap = function(zoneId) {
      const zone = qrisZones.find(z => z.id === zoneId);
      if (zone) {
        updateZoneDetailPanel(zone);
        map.flyTo([zone.lat, zone.lng], 13, { duration: 1.2 });
      }
    };

    // Initial render
    renderMarkers('all');

    // Category Filter Pills
    const filterPills = document.querySelectorAll('#mapCategoryFilters .filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.getAttribute('data-category');
        renderMarkers(category);
      });
    });

    // Search Handler
    const mapSearchInput = document.getElementById('mapSearchInput');
    const btnMapSearch = document.getElementById('btnMapSearch');

    function performMapSearch() {
      if (!mapSearchInput) return;
      const query = mapSearchInput.value.trim().toLowerCase();
      if (!query) {
        map.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
        return;
      }

      const match = qrisZones.find(z => 
        z.title.toLowerCase().includes(query) || 
        z.city.toLowerCase().includes(query) ||
        z.categoryName.toLowerCase().includes(query)
      );

      if (match) {
        updateZoneDetailPanel(match);
        map.flyTo([match.lat, match.lng], 13, { duration: 1.2 });

        const matchingMarker = currentMarkers.find(m => {
          const latLng = m.getLatLng();
          return Math.abs(latLng.lat - match.lat) < 0.001 && Math.abs(latLng.lng - match.lng) < 0.001;
        });
        if (matchingMarker) {
          matchingMarker.openPopup();
        }
      } else {
        alert(`Lokasi "${query}" tidak ditemukan di sampel lokasi Zona QRIS. Menampilkan seluruh wilayah.`);
        map.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
      }
    }

    if (btnMapSearch) {
      btnMapSearch.addEventListener('click', performMapSearch);
    }
    if (mapSearchInput) {
      mapSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performMapSearch();
        }
      });
    }

    // Verify Button Event
    const btnVerifyZone = document.getElementById('btnVerifyZone');
    if (btnVerifyZone) {
      btnVerifyZone.addEventListener('click', () => {
        const titleText = document.getElementById('zoneTitle').textContent;
        alert(`[VERIFIKASI RESMI BANK INDONESIA]\n\nZona: ${titleText}\nStatus: 100% TERINTEGRASI ZONA QRIS RESMI\nSertifikasi: ASPI & Bank Indonesia`);
      });
    }
  }

});

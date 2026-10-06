import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Heatmap from './pages/Heatmap.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PotensiEkspor from './pages/komoditas/PotensiEkspor.jsx'
import StokKomoditas from './pages/komoditas/StokKomoditas.jsx'
import PajakDaerah from './pages/PajakDaerah.jsx'
import PajakNegara from './pages/PajakNegara.jsx'
import TransaksiPemerintah from './pages/transaksi/TransaksiPemerintah.jsx'
import TransaksiUMKM from './pages/transaksi/TransaksiUMKM.jsx'
import { Power, ShieldCheck, User, ChevronDown, ChevronUp, Menu } from './components/icons.jsx'

import {
  logoBI,
  logo4Kab,
  logoKpw,
  logoKiri1,
  logoKiri2,
  logoKiri3,
  logoKiri4,
  logoP2dd
} from '@/assets/logos'

const NAV_TABS = [
  { id: 'heatmap', label: 'Heatmap Zonasi' },
  { id: 'potensi-ekspor', label: 'Potensi Ekspor' },
  { id: 'stok', label: 'Stok Komoditas' },
  { id: 'pajak-daerah', label: 'Pajak Daerah' },
  { id: 'pajak-negara', label: 'Pajak Pemerintah Pusat' },
  { id: 'transaksi-pemerintah', label: 'Transaksi Pemerintah' },
  { id: 'transaksi-umkm', label: 'Transaksi UMKM' }
]

function WelcomeSplash({ onComplete }) {
  const [fade, setFade] = useState(false)
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 2400)
    const removeTimer = setTimeout(() => onComplete(), 2900)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [onComplete])

  return (
    <div className={`splash-screen-overlay ${fade ? 'fade-out' : ''}`}>
      <picture style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <source media="(max-width: 767px)" srcSet="/assets/splash/potrait.PNG" />
        <img
          src="/assets/splash/loading.PNG"
          alt="Zonation Command Center Welcome"
          className="splash-image-welcome"
          loading="eager"
          decoding="sync"
          fetchpriority="high"
        />
      </picture>
      <div className="splash-loading-indicator-wrap">
        <div className="splash-loader-bar">
          <div className="splash-loader-progress" />
        </div>
        <span className="splash-loader-text">Memuat Sistem Data...</span>
      </div>
    </div>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('zonasi_is_logged_in') === 'true'
  })
  const [showSplash, setShowSplash] = useState(true)
  const [guestView, setGuestView] = useState('landing') // 'landing' or 'login'
  const [active, setActive] = useState(() => {
    return localStorage.getItem('zonasi_active_tab') || 'heatmap'
  })
  const [isNavOpen, setIsNavOpen] = useState(true)
  const lastScrollY = useRef(0)
  const manualActionTimeRef = useRef(0)

  // Auto-collapse navigation only on active downward scroll, expand when at top
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const timeSinceManualAction = Date.now() - manualActionTimeRef.current

          // When user manually opens/closes, don't trigger auto scroll action for 1.2s
          if (timeSinceManualAction > 1200) {
            const diff = currentScrollY - lastScrollY.current
            if (currentScrollY <= 20) {
              setIsNavOpen(true)
            } else if (diff > 18 && currentScrollY > 70) {
              setIsNavOpen(false)
            }
          }
          lastScrollY.current = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLoginSuccess = () => {
    localStorage.setItem('zonasi_is_logged_in', 'true')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('zonasi_is_logged_in')
    localStorage.removeItem('zonasi_active_tab')
    setIsLoggedIn(false)
    setGuestView('landing')
  }

  const handleTabChange = (tabId) => {
    setActive(tabId)
    localStorage.setItem('zonasi_active_tab', tabId)
  }

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <WelcomeSplash onComplete={handleSplashComplete} />
  }

  if (!isLoggedIn) {
    if (guestView === 'landing') {
      return (
        <LandingPage
          onOpenMap={() => setGuestView('login')}
          onOpenLogin={() => setGuestView('login')}
          onLoginSuccess={handleLoginSuccess}
        />
      )
    }
    return (
      <LoginPage
        onBack={() => setGuestView('landing')}
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted font-sans">
      {/* ==========================================
          TOP HEADER: LOGOS & LOGOUT (NATURAL SCROLL)
          ========================================== */}
      <header className="bg-white border-b border-surface-border shrink-0 font-sans">
        <div className="max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Left Container: Bank Indonesia Logo + Partner Logos */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Bank Indonesia Main Logo */}
            <img
              src={logoBI}
              alt="Bank Indonesia Logo"
              className="h-7 sm:h-10 w-auto object-contain shrink-0 cursor-pointer"
              onClick={() => handleTabChange('heatmap')}
            />

            <div className="h-6 sm:h-8 w-px bg-surface-border mx-1 hidden sm:block" />

            {/* 4 Kabupaten Logo (desktop & tablet) */}
            <img
              src={logo4Kab}
              alt="Logo 4 Kabupaten"
              className="h-6 sm:h-9 w-auto object-contain hidden md:block shrink-0"
            />

            {/* Sponsor / Partner Logos (logokiri 1-4 on large screens) */}
            <div className="hidden xl:flex items-center gap-2 sm:gap-2.5 shrink-0 ml-2">
              <img src={logoKiri1} alt="Logo Kiri 1" className="h-7 sm:h-8 w-auto object-contain" />
              <img src={logoKiri2} alt="Logo Kiri 2" className="h-7 sm:h-8 w-auto object-contain" />
              <img src={logoKiri3} alt="Logo Kiri 3" className="h-7 sm:h-8 w-auto object-contain" />
              <img src={logoKiri4} alt="Logo Kiri 4" className="h-7 sm:h-8 w-auto object-contain" />
            </div>
          </div>

          {/* Right Container: KPw BI Purwokerto Logo & Logout Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* KPw BI Purwokerto Logo Image */}
            <img
              src={logoKpw}
              alt="Logo KPw Bank Indonesia Purwokerto"
              className="h-8 sm:h-10 w-auto object-contain hidden sm:block shrink-0 drop-shadow-xs"
            />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all duration-150 active:scale-95 shadow-xs cursor-pointer"
              title="Keluar dari sesi administrator"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          PREMIUM FLOATING NAVIGATION CAPSULE (BUKA / TUTUP & TRANSPARENT BG)
          ========================================== */}
      <nav className="sticky top-0 z-[1000] font-sans py-2 sm:py-2.5 pointer-events-none transition-all">
        <div className="max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isNavOpen ? (
              <motion.div
                key="nav-expanded"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md border border-surface-border rounded-2xl shadow-md px-2 py-1.5 min-w-0"
              >
                {/* Scrollable Floating Pill Tabs */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0 py-0.5 px-0.5">
                  {NAV_TABS.map((tab) => {
                    const isActive = active === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-brand text-white shadow-sm shadow-brand/30 ring-1 ring-brand'
                            : 'text-ink-600 hover:bg-slate-100 hover:text-ink-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-surface-border shrink-0" />

                {/* Right Action: Collapse Toggle Button */}
                <button
                  onClick={() => {
                    manualActionTimeRef.current = Date.now()
                    setIsNavOpen(false)
                  }}
                  className="px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-ink-500 hover:bg-slate-100 hover:text-ink-800 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
                  title="Sembunyikan Menu Navigasi"
                >
                  <ChevronUp size={14} className="text-ink-400" />
                  <span className="hidden sm:inline">Tutup</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="nav-collapsed"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-start pointer-events-auto"
              >
                {/* Floating Island Compact Menu Button */}
                <button
                  type="button"
                  onClick={() => {
                    manualActionTimeRef.current = Date.now()
                    setIsNavOpen(true)
                  }}
                  className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-surface-border shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer group text-xs sm:text-sm font-semibold font-sans text-brand hover:text-brand-dark"
                  title="Buka Menu Navigasi"
                >
                  <Menu size={16} className="text-brand shrink-0" />
                  <span>Menu</span>
                  <ChevronDown size={14} className="transition-transform group-hover:translate-y-0.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ==========================================
          MAIN CONTENT AREA (FULL WIDTH RESPONSIVE)
          ========================================== */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto p-3 sm:p-5 lg:p-7 relative">
        {active === 'heatmap' && <Heatmap isAdmin={true} />}
        {active === 'potensi-ekspor' && <PotensiEkspor isAdmin={true} />}
        {active === 'stok' && <StokKomoditas isAdmin={true} />}
        {active === 'pajak-daerah' && <PajakDaerah isAdmin={true} />}
        {active === 'pajak-negara' && <PajakNegara isAdmin={true} />}
        {active === 'transaksi-pemerintah' && <TransaksiPemerintah isAdmin={true} />}
        {active === 'transaksi-umkm' && <TransaksiUMKM isAdmin={true} />}
        {active !== 'heatmap' &&
          active !== 'potensi-ekspor' &&
          active !== 'stok' &&
          active !== 'pajak-daerah' &&
          active !== 'pajak-negara' &&
          active !== 'transaksi-pemerintah' &&
          active !== 'transaksi-umkm' && (
            <div className="flex items-center justify-center h-[70vh] text-ink-300 text-sm">
              Halaman "{active}" belum diimplementasikan pada prototipe ini.
            </div>
          )}
      </main>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="bg-white border-t border-surface-border py-6 text-center text-xs text-ink-300 shrink-0">
        <div className="max-w-[1680px] mx-auto px-4 space-y-2">
          <div className="flex justify-center items-center gap-4">
            <img src={logoP2dd} alt="Logo P2DD" className="h-6 sm:h-7 w-auto object-contain opacity-85" />
          </div>
          <p className="text-[11px] text-ink-400 font-medium">
            © 2026 Bank Indonesia KPw Purwokerto · Zonation Command Center Banyumas Raya. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  )
}
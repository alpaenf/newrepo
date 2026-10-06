import { useState, useEffect } from 'react'
import Heatmap from './pages/Heatmap.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PotensiEkspor from './pages/komoditas/PotensiEkspor.jsx'
import StokKomoditas from './pages/komoditas/StokKomoditas.jsx'
import PajakDaerah from './pages/PajakDaerah.jsx'
import PajakNegara from './pages/PajakNegara.jsx'
import TransaksiPemerintah from './pages/transaksi/TransaksiPemerintah.jsx'
import TransaksiUMKM from './pages/transaksi/TransaksiUMKM.jsx'
import { Power, ShieldCheck, User } from './components/icons.jsx'

import logoBI from '../logo1.png'
import logo4Kab from '../logo 4 kab.png'
import logoKiri1 from '../logokiri1.png'
import logoKiri2 from '../logokiri2.png'
import logoKiri3 from '../logokiri3.png'
import logoKiri4 from '../logokiri4.png'
import logoP2dd from '../logo p2dd.png'

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
    const fadeTimer = setTimeout(() => setFade(true), 2800)
    const removeTimer = setTimeout(() => onComplete(), 3200)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`splash-screen-overlay ${fade ? 'fade-out' : ''}`}
      style={{
        backgroundColor: '#021429',
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <picture style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <source media="(max-width: 767px)" srcSet="/assets/splash/potrait.PNG" />
        <img
          src="/assets/splash/loading.PNG"
          alt="Zonation Command Center Welcome"
          className="splash-image-welcome"
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
  const [showSplash, setShowSplash] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [guestView, setGuestView] = useState('landing') // 'landing' or 'login'
  const [active, setActive] = useState('heatmap')

  const handleLogout = () => {
    setIsLoggedIn(false)
    setGuestView('landing')
  }

  if (showSplash) {
    return <WelcomeSplash onComplete={() => setShowSplash(false)} />
  }

  if (!isLoggedIn) {
    if (guestView === 'landing') {
      return (
        <LandingPage
          onOpenMap={() => setGuestView('login')}
          onOpenLogin={() => setGuestView('login')}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      )
    }
    return (
      <LoginPage
        onBack={() => setGuestView('landing')}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted font-sans">
      {/* ==========================================
          TOP NAVIGATION BAR (REPLACES SIDEBAR)
          ========================================== */}
      <header className="bg-white border-b border-surface-border sticky top-0 z-[10000] shadow-sm">
        <div className="max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Left Container: Bank Indonesia Logo + Partner Logos */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Bank Indonesia Main Logo */}
            <img
              src={logoBI}
              alt="Bank Indonesia Logo"
              className="h-7 sm:h-10 w-auto object-contain shrink-0 cursor-pointer"
              onClick={() => setActive('heatmap')}
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

          {/* Right Container: Admin Badge & Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Admin Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs font-bold">
              <ShieldCheck size={15} className="text-brand shrink-0" />
              <span className="truncate max-w-[200px]">KPw BI Purwokerto</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all duration-150 active:scale-95 shadow-xs"
              title="Keluar dari sesi administrator"
            >
              <Power size={14} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          SUB-HEADER: HORIZONTAL PILL TABS (IMAGE 2 MODEL)
          ========================================== */}
      <div className="bg-white border-b border-surface-border sticky top-16 sm:top-20 z-[990] overflow-x-auto no-scrollbar shadow-xs shrink-0 font-sans">
        <div className="max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center gap-2 sm:gap-3">
          {NAV_TABS.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-150 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-brand text-white shadow-md ring-1 ring-brand'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

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
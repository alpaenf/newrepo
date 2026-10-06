import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Heatmap from './pages/Heatmap.jsx'
import LandingPage from './pages/LandingPage.jsx'
import MapGuest from './pages/MapGuest.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PotensiEkspor from './pages/komoditas/PotensiEkspor.jsx'
import StokKomoditas from './pages/komoditas/StokKomoditas.jsx'
import PajakDaerah from './pages/PajakDaerah.jsx'
import PajakNegara from './pages/PajakNegara.jsx'
import TransaksiPemerintah from './pages/transaksi/TransaksiPemerintah.jsx'
import TransaksiUMKM from './pages/transaksi/TransaksiUMKM.jsx'
import { Menu } from './components/icons.jsx'

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
    <div className={`splash-screen-overlay ${fade ? 'fade-out' : ''}`} style={{ backgroundColor: '#021429', position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
  const [guestView, setGuestView] = useState('landing') // 'landing', 'map', or 'login'
  const [active, setActive] = useState('heatmap')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface-muted">
      <Sidebar
        active={active}
        onNavigate={setActive}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        isAdmin={true}
      />

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-surface-border sticky top-0 z-[900] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-ink-700 hover:bg-surface-muted active:scale-95 transition-all"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo Bank Indonesia" className="h-7 w-auto object-contain" />
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 relative">

        {active === 'heatmap' && <Heatmap isAdmin={true} />}
        {active === 'potensi-ekspor' && <PotensiEkspor isAdmin={true} />}
        {active === 'stok' && <StokKomoditas isAdmin={true} />}
        {active === 'pajak-daerah' && <PajakDaerah isAdmin={true} />}
        {active === 'pajak-negara' && <PajakNegara isAdmin={true} />}
        {active === 'transaksi-pemerintah' && <TransaksiPemerintah isAdmin={true} />}
        {active === 'transaksi-umkm' && <TransaksiUMKM isAdmin={true} />}
        {active !== 'heatmap' && active !== 'potensi-ekspor' && active !== 'stok' && active !== 'pajak-daerah' && active !== 'pajak-negara' && active !== 'transaksi-pemerintah' && active !== 'transaksi-umkm' && (
          <div className="flex items-center justify-center h-[70vh] text-ink-300 text-sm">
            Halaman "{active}" belum diimplementasikan pada prototipe ini.
          </div>
        )}
      </main>
    </div>
  )
}
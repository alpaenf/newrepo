import { useState, useEffect } from 'react'
import logoBI from '../../logo1.png'
import logo4Kab from '../../logo 4 kab.png'
import logoKiri1 from '../../logokiri1.png'
import logoKiri2 from '../../logokiri2.png'
import logoKiri3 from '../../logokiri3.png'
import logoKiri4 from '../../logokiri4.png'
import logoP2dd from '../../logo p2dd.png'
import { BankIndonesiaLogo } from './MapGuest.jsx'
import { Lock, X, User, KeyRound } from '../components/icons.jsx'

export default function LandingPage({ onOpenMap, onOpenLogin, onLoginSuccess }) {
  const desktopText = "Zona QRIS Banyumas Raya merupakan instrumen strategis KPwBI Purwokerto untuk mengintegrasikan pemetaan potensi wilayah sebagai dasar pelaksanaan program yang lebih tepat sasaran. Melalui sinergi dengan Instansi Vertikal Pemerintah Pusat, Organisasi Perangkat Daerah (OPD), Kecamatan, Perbankan, serta Komunitas terkait di Banyumas Raya, Zona QRIS mendukung penguatan digitalisasi sistem pembayaran, elektronifikasi transaksi pemerintah daerah, optimalisasi potensi ekonomi dan penerimaan daerah, pengembangan UMKM hingga pasar ekspor, serta perluasan manfaat transaksi digital bagi masyarakat."
  const mobileText = "Melalui kolaborasi dengan Instansi Vertikal Pemerintah Pusat, Organisasi Perangkat Daerah, Kecamatan, Perbankan, serta Komunitas terkait di Banyumas Raya, Zona QRIS hadir mengintegrasikan pemetaan potensi wilayah untuk mendukung penguatan digitalisasi sistem pembayaran, optimalisasi penerimaan dan elektronifikasi transaksi pemerintah daerah, pengembangan UMKM berpotensi ekspor, serta perluasan manfaat transaksi digital bagi masyarakat."

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fullText = isMobile ? mobileText : desktopText

  // Typewriter effect logic
  useEffect(() => {
    let timeoutId
    let charIndex = 0

    const startTyping = setTimeout(() => {
      const typeChar = () => {
        if (charIndex < fullText.length) {
          setTypedText(fullText.substring(0, charIndex + 1))
          charIndex++
          timeoutId = setTimeout(typeChar, isMobile ? 10 : 12)
        } else {
          setTimeout(() => setShowCursor(false), 2500)
        }
      }
      typeChar()
    }, 350)

    return () => {
      clearTimeout(startTyping)
      clearTimeout(timeoutId)
    }
  }, [fullText, isMobile])

  return (
    <div className="page-cover-body min-h-screen flex flex-col relative overflow-hidden">



      {/* Hero Background Video Layer */}
      <div className="hero-video-container">
        <video autoPlay loop muted playsInline className="hero-bg-video">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
      </div>

      {/* ==========================================
           NAVBAR FLOATING CAPSULE
           ========================================== */}
      <div className="cover-header-wrap">
        <header className="cover-header">
          {/* Left Side: Bank Indonesia Logo */}
          <div className="navbar-left-logos">
            <img src={logoBI} alt="Bank Indonesia Logo" className="navbar-logo-img" />
            <div className="brand-divider" />
            <img src={logo4Kab} alt="Logo 4 Kabupaten" className="navbar-logo-4kab-img" />
          </div>

          {/* Right Side: logokiri 1, 2, 3, 4 + 4 Regency Logos */}
          <div className="navbar-right-logos">
            <img src={logoKiri1} alt="Logo Kiri 1" className="navbar-logo-kiri" />
            <img src={logoKiri2} alt="Logo Kiri 2" className="navbar-logo-kiri" />
            <img src={logoKiri3} alt="Logo Kiri 3" className="navbar-logo-kiri" />
            <img src={logoKiri4} alt="Logo Kiri 4" className="navbar-logo-kiri" />
            
          </div>
        </header>
      </div>

      {/* ==========================================
           SINGLE SECTION HERO COVER
           ========================================== */}
      <main className="cover-hero-section">
        <div className="container cover-content">
          <h1 className="cover-title">
            <span className="title-main-line">Intervensi Kebijakan berbasis Data Zonasi. Ekonomi Daerah Tumbuh Inklusif</span> <br />
            <span className="serif-italic-accent">Dari KPw Bank Indonesia Purwokerto untuk Banyumas Raya dan Indonesia</span>
          </h1>

          <p className="cover-subtitle">
            <span className="typewriter-text">{typedText}</span>
            {showCursor && <span className="typewriter-cursor">|</span>}
          </p>

          {/* ACTION BUTTON TO ROUTE TO MAP GUEST */}
          <div className="cover-action-wrapper">
            <button onClick={onOpenMap} className="cover-arrow-btn" id="btnPage2">
              <span>Buka Peta Zona QRIS</span>
              <svg className="btn-arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <footer className="cover-footer">
        <div className="container flex justify-center items-center">
          <img src={logoP2dd} alt="Logo P2DD" className="cover-footer-logo" />
        </div>
      </footer>
    </div>
  )
}

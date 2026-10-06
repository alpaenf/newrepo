import { useState } from 'react'
import logoBI from '../../logo1.png'
import logo4Kab from '../../logo 4 kab.png'
import logoKiri1 from '../../logokiri1.png'
import logoKiri2 from '../../logokiri2.png'
import logoKiri3 from '../../logokiri3.png'
import logoKiri4 from '../../logokiri4.png'
import logoP2dd from '../../logo p2dd.png'
import Heatmap from './Heatmap.jsx'
import PotensiEkspor from './komoditas/PotensiEkspor.jsx'
import StokKomoditas from './komoditas/StokKomoditas.jsx'
import PajakDaerah from './PajakDaerah.jsx'
import PajakNegara from './PajakNegara.jsx'
import TransaksiPemerintah from './transaksi/TransaksiPemerintah.jsx'
import TransaksiUMKM from './transaksi/TransaksiUMKM.jsx'
import { Lock, X, KeyRound, User, ShieldCheck } from '../components/icons.jsx'

// Beautiful SVG Logo for Bank Indonesia
export function BankIndonesiaLogo({ className = "w-12 h-12" }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="#073B73" stroke="#C5A059" strokeWidth="3.5" />
      {/* Stylized B and I Monogram */}
      <path
        d="M38 35H58C66.5 35 71 39 71 45.5C71 49.5 68.5 52.5 64 54C70 55.5 73 59 73 66.5C73 74.5 67.5 79 58 79H38V35ZM49 43.5V52.5H57C61 52.5 62.5 51.5 62.5 48C62.5 44.5 61 43.5 57 43.5H49ZM49 61.5V70.5H58C62 70.5 63.5 69.5 63.5 66C63.5 62.5 62 61.5 58 61.5H49Z"
        fill="#C5A059"
      />
      <path d="M82 35V79H73V35H82Z" fill="#C5A059" />
      {/* Arching line at the bottom */}
      <path d="M35 92C50 97 70 97 85 92" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function MapGuest({ onLoginSuccess, onBackToLanding, onOpenLogin }) {
  const [step, setStep] = useState('map') // default directly to map in MapGuest
  const [active, setActive] = useState('heatmap')

  const guestTabs = [
    { id: 'heatmap', label: 'Heatmap Zonasi' },
    { id: 'potensi-ekspor', label: 'Potensi Ekspor' },
    { id: 'stok', label: 'Stok Komoditas' },
    { id: 'pajak-daerah', label: 'Pajak Daerah' },
    { id: 'pajak-negara', label: 'Pajak Pemerintah Pusat' },
    { id: 'transaksi-pemerintah', label: 'Transaksi Pemerintah' },
    { id: 'transaksi-umkm', label: 'Transaksi UMKM' }
  ]

  const handleBack = () => {
    if (onBackToLanding) {
      onBackToLanding()
    } else {
      setStep('welcome')
    }
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#073B73] via-[#0a4d91] to-[#0b2e4a] text-white p-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="w-full max-w-lg text-center space-y-8 z-10 animate-float-in">
          {/* Logo & Title */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-[#C5A059]/30">
              <BankIndonesiaLogo className="w-20 h-20" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-[#C5A059]">
                BANK INDONESIA
              </h1>
              <p className="text-xs sm:text-sm font-medium tracking-widest text-blue-200 uppercase">
                Kantor Perwakilan Purwokerto
              </p>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Zonation Command Center
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Sistem Pemetaan Wilayah & Analisis Zonasi QRIS Terintegrasi untuk Wilayah Banyumas Raya.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setStep('map')}
              className="flex-1 py-3.5 px-6 bg-[#C5A059] hover:bg-[#b08e4f] text-[#073B73] font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Masuk Sebagai Guest
            </button>
            <button
              onClick={onOpenLogin}
              className="flex-1 py-3.5 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Lock size={15} className="text-[#C5A059]" />
              Login Administrator
            </button>
          </div>

          {/* Footer */}
          <p className="text-[10px] text-blue-300/70 pt-4">
            © 2026 Bank Indonesia. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-surface-border sticky top-0 z-[10000] shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-3">
          {/* Left Container: Back button + logoBI + logokiri 1-4 (desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleBack}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-surface-muted text-ink-700 transition-colors shrink-0 border border-surface-border"
              title="Kembali ke Halaman Awal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>

            {/* Bank Indonesia logo right next to back button */}
            <img src={logoBI} alt="Bank Indonesia Logo" className="h-6 sm:h-9 w-auto object-contain shrink-0" />

            {/* logokiri 1-4 only shown on desktop (md:flex) */}
            <div className="hidden md:flex items-center gap-2 sm:gap-2.5 shrink-0 ml-1">
              <img src={logoKiri1} alt="Logo Kiri 1" className="h-7 sm:h-8 w-auto object-contain" />
              <img src={logoKiri2} alt="Logo Kiri 2" className="h-7 sm:h-8 w-auto object-contain" />
              <img src={logoKiri3} alt="Logo Kiri 3" className="h-7 sm:h-8 w-auto object-contain" />
              <img src={logoKiri4} alt="Logo Kiri 4" className="h-7 sm:h-8 w-auto object-contain" />
            </div>
          </div>

          {/* Right Container: logo4Kab (desktop) + Login Admin button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src={logo4Kab} alt="Logo 4 Kabupaten" className="h-5 sm:h-8 w-auto object-contain hidden sm:block" />

            <button onClick={onOpenLogin} className="cover-nav-link btn-nav-glass text-xs sm:text-sm px-2.5 py-1.5 sm:px-3.5 sm:py-2 whitespace-nowrap shrink-0 ml-1">
              <span>Login Admin</span>
              <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header: Horizontal Navigation Tabs for Guest */}
      <div className="bg-white border-b border-surface-border sticky top-16 sm:top-20 z-[990] overflow-x-auto no-scrollbar shadow-xs shrink-0 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 sm:gap-2.5">
          {guestTabs.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Map Content - Horizontal layout deleted, full width maps */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-surface-border shadow-sm p-3 sm:p-6">
          {active === 'heatmap' && <Heatmap isAdmin={false} />}
          {active === 'potensi-ekspor' && <PotensiEkspor isAdmin={false} />}
          {active === 'stok' && <StokKomoditas isAdmin={false} />}
          {active === 'pajak-daerah' && <PajakDaerah isAdmin={false} />}
          {active === 'pajak-negara' && <PajakNegara isAdmin={false} />}
          {active === 'transaksi-pemerintah' && <TransaksiPemerintah isAdmin={false} />}
          {active === 'transaksi-umkm' && <TransaksiUMKM isAdmin={false} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-border py-6 text-center text-xs text-ink-300 shrink-0">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <img src={logoP2dd} alt="Logo P2DD" className="h-10 sm:h-12 w-auto object-contain mx-auto" />
          <p>© 2026 Bank Indonesia. Kantor Perwakilan Bank Indonesia Purwokerto. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}

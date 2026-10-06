import { useState } from 'react'
import logoBI from '../../logo1.png'
import logoKpw from '../../logo kpw0.png'
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Lightbulb } from '../components/icons.jsx'

export default function LoginPage({ onBack, onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (username === 'KPwBankIndonesiaPurwokerto' && password === 'admin') {
      setError('')
      onLoginSuccess()
    } else {
      setError('Username atau password salah. Gunakan KPwBankIndonesiaPurwokerto/admin.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10 transition-all">
        
        {/* LEFT COLUMN: Visual Panel (Hidden on Mobile) */}
        <div className="hidden md:flex md:col-span-5 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200/80 p-6 sm:p-8 flex-col items-center justify-center text-center relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col items-center my-auto space-y-4">
            {/* Logo Zona QRIS Emblem */}
            <div className="w-full flex items-center justify-center">
              <img
                src="/logo2.png"
                alt="Zona QRIS Emblem"
                className="max-h-36 sm:max-h-44 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1 max-w-xs">
              <h3 className="font-bold text-ink-900 text-base tracking-tight">ZONA QRIS</h3>
              <p className="text-xs text-ink-500 leading-relaxed">
                Satu QR Code untuk Semua Pembayaran Digital Nusantara. Hubungkan pedagang pasar & UMKM.
              </p>
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/80 w-full text-[11px] font-semibold text-[#045498] flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-[#045498] shrink-0" />
            <span>Bank Indonesia KPw Purwokerto</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean & Neat Form Panel */}
        <div className="col-span-12 md:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto space-y-4">
            
            {/* Header Title */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
                <img src={logoBI} alt="Bank Indonesia Logo" className="h-6 sm:h-7 w-auto object-contain" loading="eager" decoding="async" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-px bg-slate-200" />
                  <img src={logoKpw} alt="Logo KPw Bank Indonesia" className="h-6 sm:h-7 w-auto object-contain" loading="eager" decoding="async" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
                Selamat Datang Kembali!
              </h2>
              <p className="text-xs text-ink-500 mt-1">
                Silakan masuk untuk mengelola Zonation Command Center.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Username Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider block">
                  USERNAME ATAU EMAIL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="KPwBankIndonesiaPurwokerto"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-ink-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#045498] focus:ring-2 focus:ring-[#045498]/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider block">
                  KATA SANDI
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-ink-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#045498] focus:ring-2 focus:ring-[#045498]/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-ink-700 transition-colors"
                    title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-medium text-ink-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#045498] focus:ring-[#045498] cursor-pointer"
                  />
                  <span>Ingat Saya</span>
                </label>

                <button
                  type="button"
                  onClick={() => window.alert('Silakan hubungi tim Administrator Bank Indonesia KPw Purwokerto untuk reset password.')}
                  className="text-xs font-semibold text-[#045498] hover:text-[#033f73] hover:underline"
                >
                  LUPA KATA SANDI?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 px-5 bg-[#045498] hover:bg-[#033f73] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Masuk ke Panel Admin</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Back Button Link */}
            <div className="pt-2 text-center">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#045498] hover:text-[#033f73] hover:underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Kembali ke Beranda Utama</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

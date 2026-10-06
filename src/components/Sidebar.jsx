import { useState } from 'react'
import logoKpw from '../../logo kpw0.png'
import {
  LayoutGrid,
  Store,
  Users,
  Receipt,
  Map,
  FileBarChart2,
  ShieldAlert,
  Bell,
  Settings,
  Lock,
  Bot,
  X,
  ChevronDown,
  Layers,
  Landmark,
  Globe,
  Banknote,
  ArrowLeftRight,
  Package,
  Power
} from './icons.jsx'

const menuStructure = [
  { key: 'heatmap', label: 'Heatmap', icon: Map },
  {
    key: 'komoditas',
    label: 'Komoditas',
    icon: Layers,
    children: [
      { key: 'potensi-ekspor', label: 'Potensi Ekspor', icon: Globe },
      { key: 'stok', label: 'Stok', icon: Package }
    ]
  },
  {
    key: 'pajak',
    label: 'Pajak',
    icon: Landmark,
    children: [
      { key: 'pajak-daerah', label: 'Pajak Daerah', icon: Banknote },
      { key: 'pajak-negara', label: 'Pajak Pemerintah Pusat', icon: Receipt }
    ]
  },
  {
    key: 'transaksi',
    label: 'Transaksi',
    icon: ArrowLeftRight,
    children: [
      { key: 'transaksi-pemerintah', label: 'Transaksi Pemerintah', icon: Landmark },
      { key: 'transaksi-umkm', label: 'Transaksi UMKM', icon: Store }
    ]
  }
]

const settingsItems = [
  // { key: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
  // { key: 'akses', label: 'Manajemen Akses', icon: Lock }
]

export default function Sidebar({ active, onNavigate, isOpen, onClose, onLogout, isAdmin = true }) {
  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {}
    if (active === 'potensi-ekspor' || active === 'stok') initial.komoditas = true
    if (active === 'pajak-daerah' || active === 'pajak-negara') initial.pajak = true
    if (active === 'transaksi-pemerintah' || active === 'transaksi-umkm') initial.transaksi = true
    return initial
  })

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-[1090] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[1100] w-64 flex flex-col bg-white border-r border-surface-border h-screen transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 shrink-0 border-b border-surface-border/40">
          <div className="flex items-center">
            <img src={logoKpw} alt="Logo Bank Indonesia KPw" className="h-10 max-w-full w-auto object-contain" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-muted text-ink-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Guest Badge */}
        {!isAdmin && (
          <div className="mx-6 mb-3 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-center shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600">Mode Peninjau</span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 pt-2">
          <ul className="space-y-1">
            {menuStructure.map((item) => {
              const Icon = item.icon
              const hasChildren = item.children && item.children.length > 0

              if (!hasChildren) {
                const isActive = active === item.key
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        onNavigate?.(item.key)
                        onClose?.()
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand text-white shadow-card'
                          : 'text-ink-700 hover:bg-surface-muted'
                      }`}
                    >
                      <Icon size={18} strokeWidth={2} className={isActive ? 'text-white' : 'text-ink-500'} />
                      {item.label}
                    </button>
                  </li>
                )
              }

              const isParentActive = item.children.some(child => child.key === active)
              const isMenuOpen = !!openMenus[item.key]

              return (
                <li key={item.key} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isParentActive
                        ? 'text-brand font-semibold'
                        : 'text-ink-700 hover:bg-surface-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} strokeWidth={2} className={isParentActive ? 'text-brand' : 'text-ink-500'} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-ink-500 transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isMenuOpen && (
                    <ul className="pl-4 space-y-1 mt-1 border-l border-surface-border ml-5">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon
                        const isChildActive = active === child.key
                        return (
                          <li key={child.key}>
                            <button
                              onClick={() => {
                                onNavigate?.(child.key)
                                onClose?.()
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                isChildActive
                                  ? 'bg-brand/10 text-brand font-semibold'
                                  : 'text-ink-500 hover:bg-surface-muted hover:text-ink-700'
                              }`}
                            >
                              <ChildIcon size={14} strokeWidth={2} className={isChildActive ? 'text-brand' : 'text-ink-300'} />
                              <span>{child.label}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          {/* <p className="px-3 mt-6 mb-2 text-[11px] font-semibold tracking-wider text-ink-300 uppercase">
            Pengaturan
          </p> */}
          <ul className="space-y-1">
            {settingsItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.key
              return (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      onNavigate?.(item.key)
                      onClose?.()
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand text-white shadow-card'
                        : 'text-ink-700 hover:bg-surface-muted'
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} className={isActive ? 'text-white' : 'text-ink-500'} />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Logout Button */}
        {onLogout && (
          <div className="p-4 border-t border-surface-border mt-auto shrink-0">
            <button
              onClick={() => {
                onLogout()
                onClose?.()
              }}
              className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98 ${
                isAdmin
                  ? 'bg-white border border-brand/30 text-brand hover:bg-brand-light'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Power size={15} />
              <span>{isAdmin ? 'Logout Admin' : 'Keluar Mode Tamu'}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

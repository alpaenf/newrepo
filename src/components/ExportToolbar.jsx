import { useEffect, useRef, useState } from 'react'
import { Image, FileSpreadsheet, ChevronDown, SlidersHorizontal, MapPin, Wallet, Search, X, CheckCircle2 } from './icons.jsx'
import { Upload } from 'lucide-react'
import FilterDropdown from './FilterDropdown.jsx'
import { kabupatenOptions, pendanaanStatusOptions } from '../data/exportData.js'

function SearchDropdown({ icon: Icon, label, value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const isActive = value !== 'Semua'
  const q = query.trim().toLowerCase()
  const filtered = q ? options.filter((opt) => opt.toLowerCase().includes(q)) : options

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
          setQuery('')
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center justify-center sm:justify-start gap-1.5 border rounded-xl pl-2.5 pr-1.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
          isActive
            ? 'bg-brand-light border-brand-soft shadow-sm'
            : 'bg-surface-muted border-surface-border hover:bg-surface-border/50'
        }`}
      >
        <Icon size={14} className="text-brand shrink-0" />
        <span className="text-ink-300">{label}</span>
        <span className="font-semibold text-ink-900 max-w-[130px] truncate">{value}</span>
        {isActive && (
          <span
            role="button"
            aria-label={`Reset ${label}`}
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              onChange('Semua')
            }}
            className="text-ink-300 hover:text-ink-700 shrink-0 -mr-0.5 cursor-pointer"
          >
            <X size={13} />
          </span>
        )}
        <ChevronDown size={14} className={`text-ink-300 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-[1200] min-w-[220px] sm:min-w-[260px] bg-white border border-surface-border rounded-xl shadow-lg" role="listbox">
          <div className="p-2 pb-1.5">
            <div className="flex items-center gap-1.5 bg-surface-muted border border-surface-border rounded-lg px-2 focus-within:border-brand-soft">
              <Search size={13} className="text-ink-300 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder || 'Cari...'}
                className="bg-transparent outline-none text-xs sm:text-sm py-1.5 w-full text-ink-900 placeholder:text-ink-300"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs text-ink-300">Tidak ada hasil untuk "{query}"</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  onClick={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-1.5 text-left px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    opt === value ? 'bg-brand-light text-brand font-semibold' : 'text-ink-700 hover:bg-surface-muted'
                  }`}
                >
                  {opt === value && <CheckCircle2 size={13} className="shrink-0" />}
                  {opt !== value && <span className="w-[13px] shrink-0" />}
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExportToolbar({ komoditas, onKomoditasChange, kabupaten, onKabupatenChange, pendanaan, onPendanaanChange, onExport, exporting, onExportExcel, onImportExcel, komoditasOptions, isAdmin = true }) {
  return (
    <div className="bg-white border border-surface-border rounded-xl sm:rounded-2xl shadow-card p-3 sm:p-4 space-y-3">
      {/* Baris atas: label filter + aksi */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink-700">
          <SlidersHorizontal size={14} className="text-brand shrink-0" />
          Filter Data
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                  input.multiple = true
                  input.onchange = (e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length > 0) onImportExcel?.(files)
                  }
                  input.click()
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-brand text-white rounded-xl text-xs sm:text-sm font-semibold shadow-card hover:bg-brand-dark transition-colors whitespace-nowrap"
              >
                <Upload size={14} className="shrink-0" />
                <span>Import Excel / CSV</span>
              </button>

              <button
                onClick={onExport}
                disabled={exporting}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-white border border-surface-border rounded-xl text-xs sm:text-sm font-medium text-ink-700 shadow-sm hover:bg-surface-muted disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                <Image size={14} className="text-ink-500 shrink-0" />
                <span>{exporting ? 'Menyiapkan...' : 'Ekspor Peta'}</span>
              </button>

              <button
                onClick={onExportExcel}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-white border border-surface-border rounded-xl text-xs sm:text-sm font-medium text-ink-700 shadow-sm hover:bg-surface-muted transition-colors whitespace-nowrap"
              >
                <FileSpreadsheet size={14} className="text-brand shrink-0" />
                <span>Ekspor CSV</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Baris filter: komoditas (search) + kabupaten + pendanaan */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
        <SearchDropdown
          icon={Search}
          label="Komoditas"
          value={komoditas}
          options={komoditasOptions}
          onChange={onKomoditasChange}
          placeholder="Cari komoditas..."
        />
        <FilterDropdown icon={MapPin} label="Kabupaten" value={kabupaten} options={kabupatenOptions} onChange={onKabupatenChange} />
        <FilterDropdown icon={Wallet} label="Pendanaan" value={pendanaan} options={pendanaanStatusOptions} onChange={onPendanaanChange} />
      </div>
    </div>
  )
}
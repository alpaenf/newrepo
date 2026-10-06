import { useEffect, useRef, useState } from 'react'
import { ChevronDown, CheckCircle2 } from './icons.jsx'

export default function FilterDropdown({ icon: Icon, label, value, options, onChange, align = 'left', variant = 'filter' }) {
  const [open, setOpen] = useState(false)
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

  const norm = (o) => (typeof o === 'string' ? { key: o, label: o } : o)
  const opts = options.map(norm)
  const active = opts.find((o) => o.key === value)
  const isActive = variant === 'filter' && value !== 'Semua'
  const compact = variant === 'sort'

  const buttonClasses =
    variant === 'sort'
      ? 'bg-surface-muted border-surface-border hover:bg-surface-border/50'
      : isActive
        ? 'bg-brand-light border-brand-soft shadow-sm'
        : 'bg-surface-muted border-surface-border hover:bg-surface-border/50'

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center justify-center sm:justify-start border font-medium cursor-pointer whitespace-nowrap transition-colors ${buttonClasses} ${
          compact
            ? 'gap-1 rounded-lg pl-2 pr-1 py-0.5 sm:py-1 text-[11px] sm:text-xs'
            : 'gap-1.5 rounded-xl pl-2.5 pr-1.5 py-1.5 sm:py-2 text-xs sm:text-sm'
        }`}
      >
        {Icon && <Icon size={compact ? 12 : 14} className="text-brand shrink-0" />}
        {label && <span className="text-ink-300">{label}</span>}
        <span className={`font-semibold text-ink-900 truncate ${compact ? 'max-w-[90px]' : 'max-w-[110px]'}`}>
          {active ? active.label : value}
        </span>
        <ChevronDown size={compact ? 12 : 14} className={`text-ink-300 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute top-full mt-1.5 z-[1200] min-w-full bg-white border border-surface-border rounded-xl shadow-lg py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {opts.map((o) => (
            <button
              key={o.key}
              type="button"
              role="option"
              aria-selected={o.key === value}
              onClick={() => {
                onChange(o.key)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-1.5 text-left px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
                o.key === value ? 'bg-brand-light text-brand font-semibold' : 'text-ink-700 hover:bg-surface-muted'
              }`}
            >
              {o.key === value && <CheckCircle2 size={13} className="shrink-0" />}
              {o.key !== value && <span className="w-[13px] shrink-0" />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

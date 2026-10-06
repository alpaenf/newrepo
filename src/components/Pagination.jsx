import { ChevronLeft, ChevronRight } from 'lucide-react'

const pageSizeOptions = [5, 8, 10, 20]

export default function Pagination({ page, pageSize, totalItems, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const visiblePages = []
  const maxVisible = 5
  let lo = Math.max(1, page - Math.floor(maxVisible / 2))
  const hi = Math.min(totalPages, lo + maxVisible - 1)
  lo = Math.max(1, hi - maxVisible + 1)
  for (let p = lo; p <= hi; p++) visiblePages.push(p)

  const go = (target) => {
    const next = Math.min(totalPages, Math.max(1, target))
    onPageChange?.(next)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 sm:px-5 py-3 border-t border-surface-border bg-surface-muted/30">
      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-ink-400">
        <span className="font-medium">Menampilkan {start}-{end} dari {totalItems.toLocaleString('id-ID')}</span>
        {totalItems > pageSize && (
          <label className="flex items-center gap-1.5">
            / per halaman
            <select
              value={pageSize}
              onChange={(e) => { onPageSizeChange?.(Number(e.target.value)) }}
              className="py-1 px-1.5 bg-white border border-surface-border rounded-lg text-xs font-medium text-ink-700 focus:outline-none"
            >
              {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-ink-600 bg-white border border-surface-border hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={15} />
        </button>
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
              p === page ? 'bg-brand text-white shadow-sm' : 'bg-white border border-surface-border text-ink-600 hover:bg-surface-muted'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-ink-600 bg-white border border-surface-border hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
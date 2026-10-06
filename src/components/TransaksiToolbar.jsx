import { Search, Filter, Image } from './icons.jsx'
import { Upload } from 'lucide-react'

export default function TransaksiToolbar({
  range, onRangeChange, rangeOptions,
  search, onSearchChange,
  kabupaten, onKabupatenChange, kabupatenOptions,
  kecamatan, onKecamatanChange, kecamatanOptions,
  exportLabel = 'Ekspor Grafik',
  onExport, exporting, onExportExcel, onImportExcel,
  isAdmin = true
}) {
  return (
    <div className="space-y-2.5 sm:space-y-3 w-full">
      {/* Row 1: time range + export/import */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 w-full">
        <div className="flex items-center bg-white border border-surface-border rounded-xl p-1 shadow-card w-full sm:w-auto overflow-x-auto">
          {rangeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onRangeChange(opt.key)}
              className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center whitespace-nowrap ${
                range === opt.key ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-700 hover:bg-surface-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 flex-1 sm:flex-none flex-wrap sm:flex-nowrap">
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
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-white border border-surface-border rounded-xl text-xs sm:text-sm font-medium text-ink-700 shadow-card hover:bg-surface-muted transition-colors whitespace-nowrap"
            >
              <Upload size={14} className="text-brand shrink-0" />
              <span>Import Excel / CSV</span>
            </button>

            <button
              onClick={onExport}
              disabled={exporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-white border border-surface-border rounded-xl text-xs sm:text-sm font-medium text-ink-700 shadow-card hover:bg-surface-muted disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              <Image size={14} className="text-brand shrink-0" />
              <span>{exporting ? 'Menyiapkan...' : exportLabel}</span>
            </button>

            <button
              onClick={onExportExcel}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-white border border-surface-border rounded-xl text-xs sm:text-sm font-medium text-ink-700 shadow-card hover:bg-surface-muted transition-colors whitespace-nowrap"
            >
              <Filter size={14} className="text-brand shrink-0" />
              <span>Ekspor Data</span>
            </button>
          </div>
        )}
      </div>

      {/* Row 2: search + lokasi filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Cari kecamatan atau kategori usaha..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-card"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-ink-400 hidden sm:block" />
          <select
            value={kabupaten}
            onChange={(e) => onKabupatenChange(e.target.value)}
            className="py-2 px-3 bg-white border border-surface-border rounded-xl text-sm font-medium text-ink-700 focus:outline-none shadow-card"
          >
            {kabupatenOptions.length === 0 ? (
              <option value="semua">Semua Kabupaten</option>
            ) : (
              kabupatenOptions.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))
            )}
          </select>
          <select
            value={kecamatan}
            onChange={(e) => onKecamatanChange(e.target.value)}
            className="py-2 px-3 bg-white border border-surface-border rounded-xl text-sm font-medium text-ink-700 focus:outline-none shadow-card"
          >
            {kecamatanOptions.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
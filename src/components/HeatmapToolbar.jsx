import { Image, FileSpreadsheet } from './icons.jsx'
import { Upload } from 'lucide-react'
import { metricOptions, timeRangeOptions } from '../data/heatmapData.js'

const defaultCategories = [
  { key: 'TOTAL', label: 'Semua Jenis Usaha' },
  { key: 'UMI', label: 'Usaha Mikro (UMI)' },
  { key: 'UKE', label: 'Usaha Kecil (UKE)' },
  { key: 'UME', label: 'Usaha Menengah (UME)' },
  { key: 'UBE', label: 'Usaha Besar (UBE)' },
  { key: 'BLU/PSO', label: 'BLU / PSO' },
  { key: 'Lainnya', label: 'Lainnya' }
]

export default function HeatmapToolbar({
  metric,
  onMetricChange,
  range,
  onRangeChange,
  month = '08',
  onMonthChange,
  category = 'TOTAL',
  onCategoryChange,
  onExport,
  exporting,
  onExportExcel,
  onImportExcel,
  metricOptions: customMetricOptions,
  timeRangeOptions: customTimeRangeOptions,
  showExport = true,
  isAdmin = true
}) {
  const activeMetrics = customMetricOptions || metricOptions
  const activeRanges = customTimeRangeOptions || timeRangeOptions

  return (
    <div className="w-full bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-surface-border shadow-card overflow-x-auto no-scrollbar">
      <div className="flex flex-row items-center justify-between gap-4 w-full min-w-max">
        {/* Left Side: Filters Group */}
        <div className="flex flex-row items-center gap-3">
          {/* Metric Selector Tabs */}
          <div className="flex flex-row items-center bg-surface-muted border border-surface-border rounded-xl p-1 gap-1 overflow-x-auto no-scrollbar">
            {activeMetrics.map((opt) => (
              <button
                key={opt.key}
                onClick={() => onMetricChange(opt.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-center whitespace-nowrap ${
                  metric === opt.key ? 'bg-brand text-white shadow-sm' : 'text-ink-700 hover:bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Time range selector (Tahun) */}
          <div className="flex flex-row items-center bg-surface-muted border border-surface-border rounded-xl p-1 gap-1 overflow-x-auto no-scrollbar">
            {activeRanges.map((opt) => (
              <button
                key={opt.key}
                onClick={() => onRangeChange(opt.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-center transition-all whitespace-nowrap ${
                  range === opt.key ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-700 hover:bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Month Selector Dropdown (Active for 2026, or Akhir Tahun for historical) */}
          {onMonthChange && (
            range === '2026' ? (
              <select
                value={month || '08'}
                onChange={(e) => onMonthChange(e.target.value)}
                className="py-2 px-3 bg-white border border-surface-border rounded-xl text-xs font-semibold text-ink-700 focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="ALL">Semua Bulan (Tahunan 2026)</option>
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            ) : (
              <div className="py-2 px-3 bg-slate-50 border border-surface-border rounded-xl text-xs font-semibold text-ink-600 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                <span>Akhir Tahun {range}</span>
                <span className="text-[10px] text-ink-400 font-normal">(Riwayat)</span>
              </div>
            )
          )}

          {/* Business Category (Jenis Usaha) Dropdown Filter */}
          <select
            value={category}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="py-2 px-3 bg-white border border-surface-border rounded-xl text-xs font-semibold text-ink-700 focus:outline-none shadow-sm cursor-pointer"
          >
            {defaultCategories.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side: Action Buttons */}
        {isAdmin && (
          <div className="flex flex-row items-center gap-2">
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
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-surface-border rounded-xl text-xs font-semibold text-ink-700 shadow-sm hover:bg-surface-muted transition-colors whitespace-nowrap"
            >
              <Upload size={14} className="text-brand shrink-0" />
              <span>Import</span>
            </button>

            {showExport && (
              <button
                onClick={onExport}
                disabled={exporting}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-surface-border rounded-xl text-xs font-semibold text-ink-700 shadow-sm hover:bg-surface-muted disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                <Image size={14} className="text-ink-500 shrink-0" />
                <span>{exporting ? 'Menyiapkan...' : 'Ekspor Peta'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
import { useState } from 'react'
import { exportUmkm } from '../data/exportData.js'
import { FileSpreadsheet, Globe, ListOrdered } from './icons.jsx'
import FilterDropdown from './FilterDropdown.jsx'

const SORT_MODES = [
  { key: 'score', label: 'Skor Kesiapan' },
  { key: 'nilai', label: 'Nilai Ekspor' },
  { key: 'pendanaan', label: 'Jumlah Pendanaan' },
  { key: 'negara', label: 'Negara Ekspor' }
]

const rupiahShort = (v) => {
  const n = v || 0
  const abs = Math.abs(n)
  if (abs >= 1e9) return `Rp ${(n / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
  if (abs >= 1e6) return `Rp ${(n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 0 })} jt`
  if (abs >= 1e3) return `Rp ${(n / 1e3).toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`
  return 'Rp 0'
}

function sortData(arr, mode) {
  const sorted = [...arr]
  switch (mode) {
    case 'nilai':
      sorted.sort((a, b) => b.nilaiEkspor - a.nilaiEkspor)
      break
    case 'pendanaan':
      sorted.sort((a, b) => (b.pendanaan?.jumlah ?? 0) - (a.pendanaan?.jumlah ?? 0))
      break
    case 'negara':
      sorted.sort((a, b) => b.negaraTujuan.length - a.negaraTujuan.length || b.readinessScore - a.readinessScore)
      break
    default:
      sorted.sort((a, b) => b.readinessScore - a.readinessScore)
  }
  return sorted
}

function modeValue(u, mode) {
  if (mode === 'nilai') return rupiahShort(u.nilaiEkspor)
  if (mode === 'pendanaan') return rupiahShort(u.pendanaan?.jumlah ?? 0)
  if (mode === 'negara') return `${u.negaraTujuan.length}`
  return u.readinessScore
}

export default function UmkmRankingList({ selectedId, onSelect, data, scopeLabel = null }) {
  const [sortMode, setSortMode] = useState('score')
  const mapData = data || exportUmkm
  const ranked = sortData(mapData, sortMode)
  const activeMode = SORT_MODES.find((m) => m.key === sortMode)

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-surface-border shadow-card p-3.5 sm:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-ink-900 text-sm sm:text-base">Peringkat</h3>
          {scopeLabel && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-brand bg-brand-light border border-brand-soft rounded-md px-1.5 py-0.5 truncate">
              {scopeLabel}
            </span>
          )}
        </div>
        <FilterDropdown
          icon={ListOrdered}
          label="Urutkan"
          value={sortMode}
          options={SORT_MODES.map((m) => ({ key: m.key, label: m.label }))}
          onChange={setSortMode}
          align="right"
          variant="sort"
        />
      </div>

      <ul className="space-y-1 overflow-y-auto flex-1 -mx-1 pr-1">
        {ranked.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 text-ink-500">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-soft flex items-center justify-center mb-2 sm:mb-3">
              <FileSpreadsheet size={20} className="text-brand" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-ink-700">Belum ada data</p>
            <p className="text-[11px] sm:text-xs text-ink-300 mt-1 max-w-[200px]">
              Silakan klik "Import Excel" untuk memuat data UMKM potensi ekspor.
            </p>
          </div>
        ) : (
          ranked.map((u, i) => {
            const isSelected = u.id === selectedId
            return (
              <li key={u.id}>
                <button
                  onClick={() => onSelect(u.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left transition-colors ${
                    isSelected ? 'bg-brand-light' : 'hover:bg-surface-muted'
                  }`}
                >
                  <span className="text-xs font-semibold text-ink-300 w-4 text-right shrink-0">{i + 1}</span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: u.tierColor }}
                  />
                  <span className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-ink-900 truncate">{u.name}</p>
                    <p className="text-[11px] sm:text-xs text-ink-300 truncate">
                      {u.kecamatan} · {u.komoditas}
                      {u.omzet > 0 && ` · Omset ${rupiahShort(u.omzet)}`}
                    </p>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Globe size={12} className="text-ink-300" />
                    <span className="text-xs sm:text-sm font-bold text-ink-900 tabular-nums">
                      {modeValue(u, sortMode)}
                    </span>
                  </span>
                </button>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { kecamatanZonation } from '../data/heatmapData.js'
import { FileSpreadsheet } from './icons.jsx'

export default function KecamatanRankingList({ selectedId, onSelect, data }) {
  const mapData = data || kecamatanZonation
  const [sortBy, setSortBy] = useState('pajak-highest') // 'pajak-highest', 'pajak-lowest', 'name-asc', 'kepatuhan-highest', 'wp-highest'

  const isHeatmap = useMemo(() => {
    if (mapData.length === 0) return true
    return mapData[0].indicators?.penerimaanTotal === undefined
  }, [mapData])

  const ranked = useMemo(() => {
    return [...mapData].sort((a, b) => {
      if (sortBy === 'pajak-highest') {
        return b.zonationScore - a.zonationScore
      }
      if (sortBy === 'pajak-lowest') {
        return a.zonationScore - b.zonationScore
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'kepatuhan-highest') {
        const valA = a.indicators?.kepatuhanBayar || a.indicators?.qrisAdoption || 0
        const valB = b.indicators?.kepatuhanBayar || b.indicators?.qrisAdoption || 0
        return valB - valA
      }
      if (sortBy === 'wp-highest') {
        const valA = a.indicators?.merchants || 0
        const valB = b.indicators?.merchants || 0
        return valB - valA
      }
      return b.zonationScore - a.zonationScore
    })
  }, [mapData, sortBy])

  const formatCurrencyJuta = (valInJuta) => {
    if (valInJuta >= 1000) {
      const miliar = valInJuta / 1000
      return `Rp ${miliar.toFixed(2).replace('.', ',')} M`
    }
    return `Rp ${valInJuta} Jt`
  }

  const getSubValue = (k) => {
    if (sortBy === 'pajak-highest' || sortBy === 'pajak-lowest') {
      if (k.indicators?.penerimaanTotal !== undefined) {
        return formatCurrencyJuta(k.indicators.penerimaanTotal)
      }
      return `Skor ${k.zonationScore}`
    }
    if (sortBy === 'kepatuhan-highest') {
      const val = k.indicators?.kepatuhanBayar || k.indicators?.qrisAdoption || 0
      return `${val}%`
    }
    if (sortBy === 'wp-highest') {
      const val = k.indicators?.merchants || 0
      return isHeatmap ? `${val.toLocaleString()} Merchant` : `${val.toLocaleString()} WP`
    }
    return `Skor ${k.zonationScore}`
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-surface-border shadow-card p-3.5 sm:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 gap-2 shrink-0">
        <h3 className="font-semibold text-ink-900 text-sm sm:text-base shrink-0">Peringkat</h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-[140px] px-2 py-1 bg-surface-muted border border-surface-border rounded-lg text-[11px] font-semibold text-ink-700 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer hover:bg-white transition-all shadow-sm shrink-0 truncate"
        >
          {isHeatmap ? (
            <>
              <option value="pajak-highest">Zonasi Tertinggi</option>
              <option value="pajak-lowest">Zonasi Terendah</option>
              <option value="kepatuhan-highest">Adopsi QRIS</option>
              <option value="wp-highest">Merchant Terbanyak</option>
            </>
          ) : (
            <>
              <option value="pajak-highest">Pajak Tertinggi</option>
              <option value="pajak-lowest">Pajak Terendah</option>
              <option value="kepatuhan-highest">Kepatuhan Tertinggi</option>
              <option value="wp-highest">WP Terbanyak</option>
            </>
          )}
        </select>
      </div>

      <ul className="space-y-1 overflow-y-auto flex-1 -mx-1 pr-1">
        {ranked.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 text-ink-500">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-soft flex items-center justify-center mb-2 sm:mb-3">
              <FileSpreadsheet size={20} className="text-brand" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-ink-700">Belum ada data</p>
            <p className="text-[11px] sm:text-xs text-ink-300 mt-1 max-w-[200px]">
              Silakan klik "Import Excel" untuk memetakan wilayah dan peringkat zona QRIS.
            </p>
          </div>
        ) : (
          ranked.map((k, i) => {
            const isSelected = k.id === selectedId
            return (
              <li key={k.id}>
                <button
                  onClick={() => onSelect(k.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left transition-colors ${
                    isSelected ? 'bg-brand-light' : 'hover:bg-surface-muted'
                  }`}
                >
                  <span className="text-xs font-semibold text-ink-300 w-4 text-right shrink-0">{i + 1}</span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: k.tierColor }}
                  />
                  <span className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-ink-900 truncate">{k.name}</p>
                    <p className="text-[11px] sm:text-xs text-ink-300 truncate">{k.regency} · {k.tier}</p>
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-ink-900 tabular-nums shrink-0">
                    {getSubValue(k)}
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